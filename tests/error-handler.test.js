// Unit tests for ErrorHandler class
const ErrorHandler = require('../assets/scripts/error-handler.js');

describe('ErrorHandler', () => {
  let errorHandler;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create a new ErrorHandler instance for each test
    errorHandler = new ErrorHandler();
  });

  afterEach(() => {
    // Clean up
    if (errorHandler && errorHandler.cleanup) {
      errorHandler.cleanup();
    }
  });

  describe('Image Error Handling', () => {
    test('should handle image load errors with fallback', () => {
      // Create a mock image element
      const img = createMockElement('img', {
        src: 'invalid-image.jpg',
        alt: 'Test image',
        class: 'test-image'
      });
      document.body.appendChild(img);

      // Setup error handling
      errorHandler.setupImageErrorHandling(img);

      // Simulate image error
      const errorEvent = createMockEvent('error');
      img.dispatchEvent(errorEvent);

      // Check if fallback was applied
      const fallbackContainer = document.querySelector('.image-error-fallback');
      expect(fallbackContainer).toBeTruthy();
      expect(fallbackContainer.querySelector('.fallback-image')).toBeTruthy();
      expect(fallbackContainer.querySelector('.error-overlay')).toBeTruthy();
    });

    test('should use appropriate fallback for headshot images', () => {
      const img = createMockElement('img', {
        src: 'headshot.jpg',
        alt: 'Professional headshot',
        class: 'hero-image'
      });
      document.body.appendChild(img);

      errorHandler.setupImageErrorHandling(img);
      
      // Simulate error
      const errorEvent = createMockEvent('error');
      img.dispatchEvent(errorEvent);

      const fallbackImg = document.querySelector('.fallback-image');
      expect(fallbackImg.src).toContain('data:image/svg+xml');
      expect(fallbackImg.src).toContain('Profile image not available');
    });

    test('should use project fallback for project images', () => {
      const projectCard = createMockElement('div', { class: 'project-card' });
      const img = createMockElement('img', {
        src: 'project-screenshot.jpg',
        alt: 'Project screenshot'
      });
      projectCard.appendChild(img);
      document.body.appendChild(projectCard);

      errorHandler.setupImageErrorHandling(img);
      
      // Simulate error
      const errorEvent = createMockEvent('error');
      img.dispatchEvent(errorEvent);

      const fallbackImg = document.querySelector('.fallback-image');
      expect(fallbackImg.src).toContain('Project screenshot not available');
    });

    test('should log image errors', () => {
      const img = createMockElement('img', {
        src: 'invalid.jpg',
        alt: 'Test image'
      });
      document.body.appendChild(img);

      errorHandler.setupImageErrorHandling(img);
      
      // Simulate error
      const errorEvent = createMockEvent('error');
      img.dispatchEvent(errorEvent);

      expect(errorHandler.errorLog.length).toBeGreaterThan(0);
      expect(errorHandler.errorLog[0].type).toBe('image_load_error');
      expect(errorHandler.errorLog[0].src).toBe('invalid.jpg');
    });
  });

  describe('Form Error Handling', () => {
    test('should validate required fields', () => {
      const form = createMockElement('form', { id: 'test-form' });
      const input = createMockElement('input', {
        type: 'text',
        id: 'name',
        required: true
      });
      form.appendChild(input);
      document.body.appendChild(form);

      errorHandler.setupFormErrorHandling(form);

      // Test empty required field
      input.value = '';
      const isValid = errorHandler.validateField(input);
      
      expect(isValid).toBe(false);
      expect(input.classList.contains('error')).toBe(true);
    });

    test('should validate email format', () => {
      const form = createMockElement('form');
      const emailInput = createMockElement('input', {
        type: 'email',
        id: 'email',
        value: 'invalid-email'
      });
      form.appendChild(emailInput);
      document.body.appendChild(form);

      errorHandler.setupFormErrorHandling(form);

      const isValid = errorHandler.validateField(emailInput);
      expect(isValid).toBe(false);

      // Test valid email
      emailInput.value = 'test@example.com';
      const isValidEmail = errorHandler.validateField(emailInput);
      expect(isValidEmail).toBe(true);
    });

    test('should handle form submission with errors', () => {
      const form = createMockElement('form', { id: 'contact-form' });
      const nameInput = createMockElement('input', {
        type: 'text',
        id: 'name',
        required: true
      });
      const emailInput = createMockElement('input', {
        type: 'email',
        id: 'email',
        required: true,
        value: 'invalid-email'
      });
      
      form.appendChild(nameInput);
      form.appendChild(emailInput);
      document.body.appendChild(form);

      errorHandler.setupFormErrorHandling(form);

      // Simulate form submission
      const submitEvent = createMockEvent('submit');
      submitEvent.preventDefault = jest.fn();
      
      form.dispatchEvent(submitEvent);

      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(form.querySelector('.form-errors')).toBeTruthy();
    });

    test('should show loading state on valid form submission', () => {
      const form = createMockElement('form');
      const submitButton = createMockElement('button', {
        type: 'submit',
        textContent: 'Submit'
      });
      const nameInput = createMockElement('input', {
        type: 'text',
        id: 'name',
        required: true,
        value: 'John Doe'
      });
      
      form.appendChild(nameInput);
      form.appendChild(submitButton);
      document.body.appendChild(form);

      errorHandler.setupFormErrorHandling(form);

      // Simulate valid form submission
      const submitEvent = createMockEvent('submit');
      form.dispatchEvent(submitEvent);

      expect(submitButton.disabled).toBe(true);
      expect(submitButton.innerHTML).toContain('Sending...');
    });
  });

  describe('Navigation Error Handling', () => {
    test('should handle smooth scroll errors gracefully', () => {
      // Mock scrollTo to throw an error
      const originalScrollTo = window.scrollTo;
      window.scrollTo = jest.fn(() => {
        throw new Error('Scroll error');
      });

      // Mock scroll fallback
      window.scroll = jest.fn();

      errorHandler.safeScrollTo(100, 'test-section');

      expect(window.scroll).toHaveBeenCalledWith(0, 100);
      expect(errorHandler.errorLog.some(log => log.type === 'smooth_scroll_error')).toBe(true);

      // Restore original scrollTo
      window.scrollTo = originalScrollTo;
    });

    test('should handle missing navigation targets', () => {
      // Create navigation link
      const navLink = createMockElement('a', {
        href: '#nonexistent-section'
      });
      document.body.appendChild(navLink);

      errorHandler.setupSafeScrolling();

      // Simulate click on navigation link
      const clickEvent = createMockEvent('click');
      clickEvent.preventDefault = jest.fn();
      navLink.dispatchEvent(clickEvent);

      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(errorHandler.errorLog.some(log => log.type === 'navigation_click_error')).toBe(true);
    });

    test('should handle hash navigation to missing elements', () => {
      // Simulate hashchange to non-existent element
      window.location.hash = '#missing-section';
      
      const hashChangeEvent = createMockEvent('hashchange');
      window.dispatchEvent(hashChangeEvent);

      expect(errorHandler.errorLog.some(log => log.type === 'navigation_error')).toBe(true);
    });
  });

  describe('Network Error Handling', () => {
    test('should handle offline status', () => {
      const offlineEvent = createMockEvent('offline');
      window.dispatchEvent(offlineEvent);

      // Check if notification was created
      const notification = document.querySelector('.network-notification.offline');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('No internet connection');
    });

    test('should handle online status', () => {
      const onlineEvent = createMockEvent('online');
      window.dispatchEvent(onlineEvent);

      const notification = document.querySelector('.network-notification.online');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('Connection restored');
    });

    test('should handle fetch errors', async () => {
      // Mock fetch to reject
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/api/test');
      } catch (error) {
        // Error should be logged
        expect(errorHandler.errorLog.some(log => log.type === 'network_error')).toBe(true);
      }
    });
  });

  describe('Loading States', () => {
    test('should show and hide global loading overlay', () => {
      errorHandler.showLoading('Testing...');
      
      const overlay = document.getElementById('global-loading-overlay');
      expect(overlay).toBeTruthy();
      expect(overlay.classList.contains('hidden')).toBe(false);
      expect(overlay.textContent).toContain('Testing...');

      errorHandler.hideLoading();
      expect(overlay.classList.contains('hidden')).toBe(true);
    });

    test('should set button loading state', () => {
      const button = createMockElement('button', {
        textContent: 'Click me'
      });
      document.body.appendChild(button);

      errorHandler.setButtonLoading(button, true);
      
      expect(button.disabled).toBe(true);
      expect(button.innerHTML).toContain('Loading...');
      expect(button.getAttribute('aria-busy')).toBe('true');

      errorHandler.setButtonLoading(button, false);
      
      expect(button.disabled).toBe(false);
      expect(button.textContent).toBe('Click me');
      expect(button.hasAttribute('aria-busy')).toBe(false);
    });

    test('should handle iframe loading states', () => {
      const iframe = createMockElement('iframe', {
        src: 'https://example.com'
      });
      document.body.appendChild(iframe);

      errorHandler.setupIframeLoading(iframe);

      // Check if loading placeholder was created
      const placeholder = document.querySelector('.iframe-loading-placeholder');
      expect(placeholder).toBeTruthy();
      expect(iframe.style.display).toBe('none');

      // Simulate iframe load
      const loadEvent = createMockEvent('load');
      iframe.dispatchEvent(loadEvent);

      expect(iframe.style.display).toBe('block');
    });
  });

  describe('Error Logging', () => {
    test('should log errors with proper structure', () => {
      const errorInfo = {
        type: 'test_error',
        message: 'Test error message',
        timestamp: new Date().toISOString()
      };

      errorHandler.logError(errorInfo);

      expect(errorHandler.errorLog).toContain(errorInfo);
      expect(errorHandler.errorLog.length).toBe(1);
    });

    test('should limit error log size', () => {
      // Add more than 100 errors
      for (let i = 0; i < 105; i++) {
        errorHandler.logError({
          type: 'test_error',
          message: `Error ${i}`,
          timestamp: new Date().toISOString()
        });
      }

      expect(errorHandler.errorLog.length).toBe(100);
    });

    test('should send errors to analytics when available', () => {
      const errorInfo = {
        type: 'test_error',
        message: 'Test error'
      };

      errorHandler.logError(errorInfo);

      expect(global.gtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'test_error: Test error',
        fatal: false
      });
    });
  });

  describe('Global Error Handling', () => {
    test('should handle JavaScript errors', () => {
      const errorEvent = new ErrorEvent('error', {
        message: 'Test JS error',
        filename: 'test.js',
        lineno: 10,
        colno: 5
      });

      window.dispatchEvent(errorEvent);

      expect(errorHandler.errorLog.some(log => 
        log.type === 'javascript_error' && log.message === 'Test JS error'
      )).toBe(true);
    });

    test('should handle unhandled promise rejections', () => {
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        reason: 'Promise rejection test'
      });

      window.dispatchEvent(rejectionEvent);

      expect(errorHandler.errorLog.some(log => 
        log.type === 'unhandled_promise_rejection'
      )).toBe(true);
    });

    test('should handle resource loading errors', () => {
      const script = createMockElement('script', {
        src: 'invalid-script.js'
      });
      document.body.appendChild(script);

      const errorEvent = createMockEvent('error');
      Object.defineProperty(errorEvent, 'target', {
        value: script,
        writable: false
      });

      document.dispatchEvent(errorEvent);

      expect(errorHandler.errorLog.some(log => 
        log.type === 'resource_error' && log.element === 'SCRIPT'
      )).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    test('should get field label correctly', () => {
      const input = createMockElement('input', {
        id: 'test-input',
        name: 'test',
        'aria-label': 'Test Input'
      });
      
      const label = errorHandler.getFieldLabel(input);
      expect(label).toBe('Test Input');
    });

    test('should calculate form completion percentage', () => {
      const formFields = {
        name: 'filled',
        email: 'filled',
        message: 'empty',
        phone: 'filled'
      };

      const completion = errorHandler.calculateFormCompletion(formFields);
      expect(completion).toBe(75); // 3 out of 4 fields filled
    });
  });
});