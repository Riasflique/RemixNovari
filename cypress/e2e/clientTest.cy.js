import { slowCypressDown } from 'cypress-slow-down'
Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully, we figure out why eventually
  // so we can remove this.
  // https://github.com/remix-run/remix/issues/4822#issuecomment-1679195650
  // https://github.com/cypress-io/cypress/issues/27204
  if (
      /hydrat/i.test(err.message) ||
      /Minified React error #418/.test(err.message) ||
      /Minified React error #423/.test(err.message)
  ) {
      return false
  }
});

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000')
    cy.get('header').should('be.visible'); 
    cy.get('.navds-page__content--grow').should('be.visible');
    cy.get('footer').should('be.visible');
  })

it('opens modal to give client a component', () => {
  slowCypressDown(100);
  cy.get('.navds-dropdown__toggle').click();
  cy.get(':nth-child(1) > .navds-dropdown__item').click();
  cy.get(':nth-child(1) > .navds-table__row > .navds-table__data-cell > .navds-dropdown__toggle').click();
  cy.get(':nth-child(1) > .navds-table__row > .navds-table__data-cell > .navds-popover > .navds-dropdown__list > :nth-child(2) > .navds-dropdown__item').click();
  cy.get('#r26').click();
  cy.get('#r30').click();
  cy.get('#r36').click();
  //cy.get('#save-button').click(); for å save, men siden saving ikke fungerer før databasen er koblet til vil vi få en feilmedling med beskjed om at det er error i koden og ikke cypress...
})
})