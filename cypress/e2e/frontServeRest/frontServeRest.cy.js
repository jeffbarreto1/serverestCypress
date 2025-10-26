/// <reference types="cypress" />

import { dataUser } from "../../support/utils/dataUser"
import pageSelectors from "../../support/selectors/frontServeRest.sel.cy"

const userAdmin = dataUser()
const userCommon = dataUser()

describe('Login Page - front.serverest.dev', () => {

  before(() => {
    // Registering users via API to ensure tests will run
    cy.registerUserIfNeeded(userAdmin, 'true')
    cy.registerUserIfNeeded(userCommon, 'false')
  });

  beforeEach(() => {
    // Visit the login page before every test
    cy.visit('/');
  });

  context('Happy Paths (Successful Logins)', () => {

    it('should successfully log in as an Admin user', () => {
      // This test validates the login performed with a valid administrator user
      cy.intercept('POST', '/login').as('loginRequest')
      cy.login(userAdmin.email, userAdmin.password)
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Login realizado com sucesso')
      })

      // Assertions
      // Validates components of the logged in page
      cy.url().should('include', '/admin/home')
      
      cy.get(pageSelectors.idBtnLogout)
        .should('have.attr', 'type', 'button')
        .and('have.text', 'Logout')
      
      cy.get(pageSelectors.classJumbotron)
        .contains(`Bem Vindo ${userAdmin.name}`)
        .should('be.visible')
      
      cy.get(pageSelectors.classSubtitle)
        .contains('Este é seu sistema para administrar seu ecommerce.')
        .should('be.visible')
      
      cy.get(pageSelectors.classRow)
        .contains('Cadastrar Usuários')
        .should('be.visible')      
    });

    it('should successfully log in as a Common user', () => {
      // This test validates the login performed with a valid common user
      cy.intercept('POST', '/login').as('loginRequest')
      cy.login(userCommon.email, userCommon.password)
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Login realizado com sucesso')
      })

      // Assertions
      // Validates components of the logged in page
      cy.get(pageSelectors.idBtnLogout)
        .should('have.attr', 'type', 'button')
        .and('have.text', 'Logout')
      
      cy.get(pageSelectors.classJumbotron)
        .contains('Serverest Store')
        .should('be.visible')
      
      cy.get(pageSelectors.idSearch)
        .should('have.attr', 'placeholder', 'Pesquisar Produtos')
    });
    
  });

  context('Negative Paths (Validations and Errors)', () => {

    it('should display an error for incorrect password', () => {
      // This test validates login attempts with an invalid password
      cy.intercept('POST', '/login').as('loginRequest')
      cy.login('admin@serverest.dev', 'wrongpassword')
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(401)
          expect(response.body.message).to.equal('Email e/ou senha inválidos')
      })
      
      // Assertion
      // Validates incorrect password alert
      cy.get(pageSelectors.roleAlert)
        .should('contain.text', 'Email e/ou senha inválidos')
    });

    it('should display errors for empty fields', () => {
      // This test validates completion of mandatory fields for login
      cy.intercept('POST', '/login').as('loginRequest')
      cy.get(pageSelectors.idBtnEnter).click()
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body.email).to.equal('email é obrigatório')
          expect(response.body.password).to.equal('password é obrigatório')
      })

      // Assertions
      // Check mandatory fields alert
      cy.get(pageSelectors.roleAlert)
        .should('contain.text', 'Email é obrigatório')
        .and('contain.text', 'Password é obrigatório')
    });

    it('should display an error for empty email', () => {
      // // This test validates completion of mandatory fields for login (email)
      cy.intercept('POST', '/login').as('loginRequest')
      cy.get(pageSelectors.idInputSenha).type('123456')
      cy.get(pageSelectors.idBtnEnter).click()
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body.email).to.equal('email é obrigatório')
      })

      // Assertion
      // Check mandatory fields alert (email)
      cy.get(pageSelectors.roleAlert)
        .should('contain.text', 'Email é obrigatório')
        
    });

    it('should display an error for empty password', () => {
      // // This test validates completion of mandatory fields for login (password)
      cy.intercept('POST', '/login').as('loginRequest')
      cy.get(pageSelectors.idInputEmail).type('admin@serverest.dev')
      cy.get(pageSelectors.idBtnEnter).click()
      cy.wait('@loginRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body.password).to.equal('password é obrigatório')
      })

      // Assertion
      // Check mandatory fields alert (password)
      cy.get(pageSelectors.roleAlert)
        .and('contain.text', 'Password é obrigatório')
    });

    it('should display an error for invalid email format', () => {
      // This test validates valid email input.
      cy.get(pageSelectors.idInputEmail).type('invalid-email-format')
      cy.get(pageSelectors.idInputSenha).type('123456')
      cy.get(pageSelectors.idBtnEnter).click()

      // Assertion
      // Check invalid email alert
      cy.get(`${pageSelectors.idInputEmail}:invalid`)
        .should('exist')
      
      cy.get(pageSelectors.idInputEmail).then(($input) => {
        const validity = $input[0].validity
        expect(validity.valid).to.be.false
        expect(validity.typeMismatch).to.be.true
      })
    });
  });

  context('Navigation', () => {

    it('should navigate to the signup page when clicking the register link', () => {
      // This test validates navigation to the registration screen and its components
      cy.get(pageSelectors.idBtnRegister).click();

      // Assertions
      cy.url().should('include', '/cadastrarusuarios')
      
      cy.get(pageSelectors.classForm)
        .should('contain', 'Cadastro')
      
      cy.get(pageSelectors.idInputName)
      .should('have.attr', 'placeholder', 'Digite seu nome')
      .and('have.attr', 'type', 'text')
      
      cy.get(pageSelectors.idInputEmail)
      .should('have.attr', 'placeholder', 'Digite seu email')
      .and('have.attr', 'type', 'email')
      
      cy.get(pageSelectors.idInputPassword)
      .should('have.attr', 'placeholder', 'Digite sua senha')
      .and('have.attr', 'type', 'password')
      
      cy.get(pageSelectors.idBtnRegister)
      .should('have.attr', 'type', 'submit')
      
    });
  });

});
