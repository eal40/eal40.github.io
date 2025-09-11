// End-to-end tests for the portfolio website
describe('Portfolio Website E2E Tests', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/')
    cy.waitForPageLoad()
  })

  describe('Page Load and Basic Structure', () => {
    it('should load the homepage successfully', () => {
      cy.title().should('contain', 'Portfolio')
      cy.get('body').should('be.visible')
      cy.get('main').should('exist')
    })

    it('should have all main sections', () => {
      const sections = ['home', 'about', 'projects', 'skills', 'certifications', 'education', 'contact']
      
      sections.forEach(section => {
        cy.get(`#${section}`).should('exist')
      })
    })

    it('should have proper navigation structure', () => {
      cy.get('.main-navigation').should('be.visible')
      cy.get('.nav-menu a').should('have.length.at.least', 5)
    })
  })

  describe('Navigation Functionality', () => {
    it('should navigate through all sections', () => {
      const sections = ['about', 'projects', 'skills', 'certifications', 'education', 'contact']
      
      sections.forEach(section => {
        cy.navigateToSection(section)
        cy.waitForAnimations()
      })
    })

    it('should highlight active navigation item', () => {
      cy.navigateToSection('about')
      cy.get('a[href="#about"]').should('have.class', 'active').or('have.attr', 'aria-current')
    })

    it('should work with browser back/forward buttons', () => {
      cy.navigateToSection('projects')
      cy.navigateToSection('contact')
      
      cy.go('back')
      cy.url().should('include', '#projects')
      
      cy.go('forward')
      cy.url().should('include', '#contact')
    })
  })

  describe('Hero Section', () => {
    it('should display hero content correctly', () => {
      cy.get('.hero-section').should('be.visible')
      cy.get('.hero-image, .hero-image-container img').should('be.visible')
      cy.get('h1').should('be.visible').and('not.be.empty')
      cy.get('.hero-actions .btn').should('have.length.at.least', 1)
    })

    it('should have working call-to-action buttons', () => {
      cy.get('.hero-actions a[href="#contact"]').should('exist').click()
      cy.get('#contact').should('be.visible')
    })

    it('should have resume download link', () => {
      cy.testDownload('.hero-actions a[download*="resume"], .hero-actions a[href*="resume"]')
    })
  })

  describe('Projects Section', () => {
    it('should display project cards', () => {
      cy.navigateToSection('projects')
      cy.get('.project-card').should('have.length.at.least', 1)
      
      cy.get('.project-card').each($card => {
        cy.wrap($card).find('.project-title').should('be.visible')
        cy.wrap($card).find('.project-description').should('be.visible')
      })
    })

    it('should handle demo toggles for website projects', () => {
      cy.navigateToSection('projects')
      
      cy.get('.demo-toggle').first().then($btn => {
        if ($btn.length > 0) {
          cy.wrap($btn).click()
          cy.get('.embedded-demo').first().should('be.visible')
          
          // Close demo
          cy.wrap($btn).click()
          cy.get('.embedded-demo').first().should('not.be.visible')
        }
      })
    })

    it('should have working external links', () => {
      cy.navigateToSection('projects')
      
      cy.get('.project-link[href*="github"]').each($link => {
        cy.wrap($link).should('have.attr', 'href').and('include', 'github')
        cy.wrap($link).should('have.attr', 'target', '_blank')
        cy.wrap($link).should('have.attr', 'rel').and('include', 'noopener')
      })
    })

    it('should handle installer downloads for desktop projects', () => {
      cy.navigateToSection('projects')
      
      cy.get('.download-btn').then($btns => {
        if ($btns.length > 0) {
          cy.wrap($btns.first()).should('have.attr', 'href')
          cy.wrap($btns.first()).should('have.attr', 'download')
        }
      })
    })
  })

  describe('Contact Form', () => {
    it('should display contact form', () => {
      cy.navigateToSection('contact')
      cy.get('form').should('be.visible')
      cy.get('input[type="text"], input[name="name"]').should('exist')
      cy.get('input[type="email"], input[name="email"]').should('exist')
      cy.get('textarea').should('exist')
      cy.get('button[type="submit"], input[type="submit"]').should('exist')
    })

    it('should validate required fields', () => {
      cy.navigateToSection('contact')
      
      // Try to submit empty form
      cy.get('button[type="submit"], input[type="submit"]').click()
      
      // Check for validation (either HTML5 or custom)
      cy.get('input:invalid, .error, .field-error').should('exist')
    })

    it('should validate email format', () => {
      cy.navigateToSection('contact')
      
      cy.fillContactForm({
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message'
      })
      
      cy.get('button[type="submit"], input[type="submit"]').click()
      
      // Should show email validation error
      cy.get('input[type="email"]:invalid, .email-error').should('exist')
    })

    it('should handle successful form submission', () => {
      cy.navigateToSection('contact')
      
      cy.fillContactForm({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message for the contact form.'
      })
      
      cy.get('button[type="submit"], input[type="submit"]').click()
      
      // Should show loading state or success message
      cy.get('button[disabled], .loading, .success-message').should('exist')
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x')
      cy.get('body').should('be.visible')
      cy.get('.main-navigation').should('exist')
      
      // Test mobile menu if it exists
      cy.get('.mobile-menu-toggle, .hamburger').then($toggle => {
        if ($toggle.length > 0) {
          cy.wrap($toggle).click()
          cy.get('.nav-menu').should('be.visible')
        }
      })
    })

    it('should work on tablet devices', () => {
      cy.viewport('ipad-2')
      cy.get('body').should('be.visible')
      cy.get('.hero-section').should('be.visible')
      cy.get('.projects-section').should('exist')
    })

    it('should work on desktop', () => {
      cy.viewport(1920, 1080)
      cy.get('body').should('be.visible')
      cy.get('.main-navigation').should('be.visible')
      cy.get('.hero-section').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length', 1)
      cy.get('h1, h2, h3, h4, h5, h6').each($heading => {
        cy.wrap($heading).should('not.be.empty')
      })
    })

    it('should have alt text for images', () => {
      cy.get('img').each($img => {
        cy.wrap($img).should('have.attr', 'alt')
      })
    })

    it('should have proper link accessibility', () => {
      cy.get('a').each($link => {
        cy.wrap($link).should('satisfy', $el => {
          const href = $el.attr('href')
          const ariaLabel = $el.attr('aria-label')
          const text = $el.text().trim()
          
          return href && (ariaLabel || text)
        })
      })
    })

    it('should support keyboard navigation', () => {
      cy.get('body').tab()
      cy.focused().should('exist')
      
      // Test tab navigation through interactive elements
      cy.get('a, button, input, textarea').first().focus()
      cy.focused().should('exist')
    })
  })

  describe('Performance', () => {
    it('should load within reasonable time', () => {
      const startTime = Date.now()
      
      cy.visit('/').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(5000) // 5 seconds max
      })
    })

    it('should have optimized images', () => {
      cy.get('img').each($img => {
        cy.wrap($img).should('have.attr', 'src')
        cy.wrap($img).should('satisfy', $el => {
          const src = $el.attr('src')
          // Check for modern image formats or optimization
          return src.includes('.webp') || src.includes('.avif') || src.includes('data:image')
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing images gracefully', () => {
      // This test would need to be customized based on error handling implementation
      cy.get('img').should('be.visible')
      
      // Check for fallback images or error states
      cy.get('.image-error-fallback, .fallback-image').should('not.exist').or('be.visible')
    })

    it('should handle JavaScript errors gracefully', () => {
      // Check that the page still functions even with potential JS errors
      cy.window().then(win => {
        win.onerror = cy.stub().as('jsError')
      })
      
      cy.navigateToSection('projects')
      cy.get('@jsError').should('not.have.been.called')
    })
  })

  describe('SEO and Meta Tags', () => {
    it('should have proper meta tags', () => {
      cy.get('head meta[name="description"]').should('have.attr', 'content').and('not.be.empty')
      cy.get('head meta[name="keywords"]').should('exist')
      cy.get('head meta[name="author"]').should('exist')
    })

    it('should have Open Graph tags', () => {
      cy.get('head meta[property="og:title"]').should('exist')
      cy.get('head meta[property="og:description"]').should('exist')
      cy.get('head meta[property="og:image"]').should('exist')
    })

    it('should have proper canonical URL', () => {
      cy.get('head link[rel="canonical"]').should('have.attr', 'href')
    })
  })
})