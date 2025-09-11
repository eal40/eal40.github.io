// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch
  win.fetch = function (...args) {
    return originalFetch.apply(this, args)
  }
})

// Custom command to wait for page to be fully loaded
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document')
  cy.document().should('have.property', 'readyState', 'complete')
})

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  // Basic accessibility checks
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt')
  })
  
  cy.get('a').each(($link) => {
    cy.wrap($link).should('satisfy', ($el) => {
      return $el.attr('href') || $el.attr('aria-label') || $el.text().trim()
    })
  })
  
  cy.get('button').each(($btn) => {
    cy.wrap($btn).should('satisfy', ($el) => {
      return $el.attr('aria-label') || $el.text().trim()
    })
  })
})

// Custom command to test responsive design
Cypress.Commands.add('testResponsive', () => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' }
  ]
  
  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height)
    cy.wait(500) // Allow time for responsive changes
    cy.get('body').should('be.visible')
  })
})