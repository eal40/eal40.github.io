# End-to-End Testing with Cypress

This directory contains end-to-end tests for the portfolio website using Cypress.

## Setup

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   This will start the server on http://localhost:3000

## Running Tests

### Headless Mode (CI)
```bash
npx cypress run
```

### Interactive Mode (Development)
```bash
npx cypress open
```

## Test Files

- `cypress/e2e/basic-functionality.cy.js` - Basic functionality tests
- `cypress/e2e/portfolio.cy.js` - Comprehensive portfolio tests

## Test Coverage

The tests cover:

### Basic Functionality
- Page loading
- Navigation between sections
- Responsive design
- Form presence

### Comprehensive Tests
- **Navigation**: Section navigation, active states, browser history
- **Hero Section**: Content display, call-to-action buttons, resume download
- **Projects**: Project cards, demo toggles, external links, installer downloads
- **Contact Form**: Form validation, email format, submission handling
- **Responsive Design**: Mobile, tablet, and desktop viewports
- **Accessibility**: Heading hierarchy, alt text, keyboard navigation
- **Performance**: Load times, image optimization
- **Error Handling**: Missing images, JavaScript errors
- **SEO**: Meta tags, Open Graph tags, canonical URLs

## Configuration

The Cypress configuration is in `cypress.config.js`:
- Base URL: http://localhost:3000
- Viewport: 1280x720
- Timeouts: 10 seconds
- Screenshots on failure: enabled
- Video recording: disabled (for faster runs)

## Custom Commands

Custom commands are defined in `cypress/support/commands.js`:
- `cy.navigateToSection(sectionId)` - Navigate to a specific section
- `cy.fillContactForm(data)` - Fill out the contact form
- `cy.testDownload(selector)` - Test download functionality
- `cy.waitForAnimations()` - Wait for CSS animations
- `cy.checkA11y()` - Basic accessibility checks
- `cy.testResponsive()` - Test responsive design

## Running Specific Tests

To run a specific test file:
```bash
npx cypress run --spec "cypress/e2e/basic-functionality.cy.js"
```

To run tests with a specific browser:
```bash
npx cypress run --browser chrome
```

## Debugging

1. Use `cy.debug()` in tests to pause execution
2. Use `cy.pause()` to pause the test
3. Use the Cypress Test Runner for interactive debugging
4. Check the `cypress/screenshots` folder for failure screenshots

## CI/CD Integration

For continuous integration, use:
```bash
npx cypress run --headless --browser electron
```

The tests are designed to be reliable and not flaky, with proper waits and assertions.