/// <reference types="cypress" />

import { dataUser } from '../../support/utils/dataUser';
import { faker } from '@faker-js/faker';

describe('API Tests - /produtos Endpoint', () => {

  
  const userAdmin = dataUser()
  const userCommon = dataUser()
  let adminToken // Variable to store the Admin user authentication token
  let commonUserToken // Variable to store the common user authentication token
  let createdProductId // Variable to store a product ID to be used between tests

  before(() => {
    // Log in as admin to get the authentication token
    cy.registerUserIfNeeded(userAdmin, 'true')
    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_url')}/login`,
      body: {
        "email": userAdmin.email,
        "password": userAdmin.password
      }
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      adminToken = loginResponse.body.authorization; // Save token
    });
  });

  context('GET /produtos', () => {
    // This test searches for the list of registered products
    it('should list all registered products', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('api_url')}/produtos`
      }).then((response) => {
        
        // Response Assertions
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('quantidade');
        expect(response.body.produtos).to.be.an('array');
        expect(response.body.produtos).to.have.length.greaterThan(0);

        // Product Assertions
        const firstProduct = response.body.produtos[0];
        expect(firstProduct).to.have.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id');

        // Saves a product ID to use in further tests
        createdProductId = firstProduct._id;
      });
    });
  });

  context('GET /produtos/{_id}', () => {

    it('should find a specific product by its ID', () => {
      // This test uses the product ID obtained from the previous test.
      expect(createdProductId, 'Product ID should be available').to.not.be.undefined;

      cy.request({
        method: 'GET',
        url: `${Cypress.env('api_url')}/produtos/${createdProductId}`
      }).then((response) => {
        
        // Response Assertions
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(createdProductId);
        expect(response.body).to.have.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id');
      });
    });

    it('should return 400 for an invalid ID format', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('api_url')}/produtos/ID_INVALIDO`,
        failOnStatusCode: false
      }).then((response) => {
        
        // Response Assertions
        expect(response.status).to.eq(400);
        expect(response.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
      });
    });
  });

  context('DELETE /produtos/{_id}', () => {

    let productIdToDelete;

    // Create a product first to ensure there will be an item to delete, making the test independent
    beforeEach(() => {
      // Create a product
      const productName = faker.commerce.productName()
      const productPrice = faker.commerce.price({ dec: 0 })

      cy.request({
        method: 'POST',
        url: `${Cypress.env('api_url')}/produtos`,
        headers: {
          authorization: adminToken // Use the admin token
        },
        body: {
          "nome": `${productName} (Test Product)`,
          "preco": productPrice,
          "descricao": "Produto para teste de API",
          "quantidade": 100
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        productIdToDelete = response.body._id; // Saves the ID of the newly created product
      });
    });

    it('should successfully delete a product', () => {
      // This test uses the created product ID to perform deletion via API
        cy.request({
        method: 'DELETE',
        url: `${Cypress.env('api_url')}/produtos/${productIdToDelete}`,
        headers: {
          authorization: adminToken // Use the token to authorize deletion
        }
      }).then((response) => {
        
        // Response Assertions
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    });

    it('should fail to delete a product without authorization', () => {
      // This test validates that a deletion without permission fails.
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('api_url')}/produtos/${productIdToDelete}`,
        failOnStatusCode: false // 
      }).then((response) => {
        
        // Asserções da Resposta
        expect(response.status).to.eq(401);
        expect(response.body.message).to.contain('Token de acesso ausente');
      });
    });

    it('should fail to delete a product with a common user token', () => {
      // Create a regular user to prove he can't delete
      cy.registerUserIfNeeded(userCommon, 'false')
        .then(() => {
          // Register the common user
          cy.request({
            method: 'POST',
            url: `${Cypress.env('api_url')}/login`,
            body: {
              "email": userCommon.email,
              "password": userCommon.password
            }
          }).then((loginResponse) => {
            expect(loginResponse.status).to.eq(200);
            commonUserToken = loginResponse.body.authorization; // Save token

            // Attempts to delete the product with the common token
            cy.request({
              method: 'DELETE',
              url: `${Cypress.env('api_url')}/produtos/${productIdToDelete}`,
              headers: {
                authorization: commonUserToken // Use the common token
              },
              failOnStatusCode: false
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(403);
              expect(deleteResponse.body.message).to.eq('Rota exclusiva para administradores');
            });
          });
        });
    });
    
  });
});