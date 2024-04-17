Cypress.on("uncaught:exception", (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false
    }
});

it('passes', () => {
    cy.visit('http://localhost:3000/')
})



it('shows all buttons', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('.navds-vstack > .navds-stack > :nth-child(2)').click()  
    

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    
  })
