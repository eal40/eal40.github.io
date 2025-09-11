// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to navigate to section
Cypress.Commands.add('navigateToSection', (sectionId) => {
  cy.get(`a[href="#${sectionId}"]`).first().click()
  cy.get(`#${sectionId}`).should('be.visible')
  cy.url().should('include', `#${sectionId}`)
})

// Custom command to fill contact form
Cypress.Commands.add('fillContactForm', (data) => {
  if (data.name) {
    cy.get('input[name="name"], input[id="name"]').type(data.name)
  }
  if (data.email) {
    cy.get('input[name="email"], input[id="email"]').type(data.email)
  }
  if (data.message) {
    cy.get('textarea[name="message"], textarea[id="message"]').type(data.message)
  }
})

// Custom command to check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should(($el) => {
    const rect = $el[0].getBoundingClientRect()
    expect(rect.top).to.be.at.least(0)
    expect(rect.left).to.be.at.least(0)
    expect(rect.bottom).to.be.at.most(Cypress.config('viewportHeight'))
    expect(rect.right).to.be.at.most(Cypress.config('viewportWidth'))
  })
})

// Custom command to test download functionality
Cypress.Commands.add('testDownload', (selector) => {
  cy.get(selector).should('have.attr', 'href').and('not.be.empty')
  cy.get(selector).should('have.attr', 'download').and('not.be.empty')
})

// Custom command to wait for animations
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(500) // Wait for CSS transitions/animations
})