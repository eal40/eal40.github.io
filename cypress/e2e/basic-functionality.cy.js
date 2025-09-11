// Basic end-to-end functionality tests
describe('Basic Portfolio Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the homepage', () => {
    cy.get('body').should('be.visible')
    cy.title().should('not.be.empty')
  })

  it('should have navigation links', () => {
    cy.get('nav a, .nav-menu a').should('have.length.at.least', 3)
  })

  it('should navigate to different sections', () => {
    // Test navigation to about section
    cy.get('a[href="#about"]').first().click()
    cy.url().should('include', '#about')
    
    // Test navigation to projects section
    cy.get('a[href="#projects"]').first().click()
    cy.url().should('include', '#projects')
  })

  it('should have a contact form', () => {
    cy.get('a[href="#contact"]').first().click()
    cy.get('form').should('exist')
    cy.get('input, textarea').should('have.length.at.least', 2)
  })

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('body').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('body').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.get('body').should('be.visible')
  })
})