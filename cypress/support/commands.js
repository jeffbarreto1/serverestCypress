import pageSelectors from "./selectors/frontServeRest.sel.cy";

//Creates a new user via API request if they don't already exist.
 
Cypress.Commands.add('registerUserIfNeeded', (user, userType) => {
  const admin = {
      nome: user.name,
      email: user.email,
      password: user.password,
      administrador: userType
    }

  cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/usuarios`,
    body: admin,
    failOnStatusCode: false
  });
});

// Custom command to perform login via the UI.
Cypress.Commands.add('login', (email, password) => {
  
    cy.get(pageSelectors.idInputEmail)
        .should('have.attr', 'placeholder', 'Digite seu email')
        .and('have.attr', 'type', 'email')
    cy.get(pageSelectors.idInputSenha)
        .should('have.attr', 'placeholder', 'Digite sua senha')
        .and('have.attr', 'type', 'password')

    cy.get(pageSelectors.idBtnEnter)
        .should('have.attr', 'type', 'submit')
        .and('have.text', 'Entrar')

    cy.get(pageSelectors.idInputEmail).type(email)
    cy.get(pageSelectors.idInputSenha).type(password)
    cy.get(pageSelectors.idBtnEnter).click()
});
