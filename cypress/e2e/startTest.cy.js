
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
    })
  
    it('opens persons button and clicks dropdown menu', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are two matched items,
      // which are the two default items.
      cy.get('.navds-vstack > .navds-stack > :nth-child(2)').click()

  
      // We can go even further and check that the default todos each contain
      // the correct text. We use the `first` and `last` functions
      // to get just the first and last matched elements individually,
      // and then perform an assertion with `should`.
      cy.get(':nth-child(1) > .navds-table__toggle-expand-cell > .navds-table__toggle-expand-button').click()
      cy.get(':nth-child(1) > .navds-table__row > .navds-table__data-cell > :nth-child(2)').click()

    })

    it('uses search field and searches for a person', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.get('.navds-vstack > .navds-stack > :nth-child(2)').click()

        cy.get('#searchfield-rb').type("Anakin")

  
      })
})