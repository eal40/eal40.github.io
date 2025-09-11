// Unit tests for AnalyticsManager class
const AnalyticsManager = require('../assets/scripts/analytics.js');

describe('AnalyticsManager', () => {
  let analyticsManager;
  let mockConfig;

  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    
    // Mock analytics config
    mockConfig = {
      googleAnalytics: {
        trackingId: 'G-TEST123456',
        anonymizeIp: true,
        allowGoogleSignals: false,
        allowAdPersonalization: false
      },
      debug: {
        enabled: true
      },
      conversions: {
        resume_download: {
          value: 10,
          currency: 'USD'
        },
        contact_form_submit: {
          value: 5,
          currency: 'USD'
        }
      }
    };
    
    window.ANALYTICS_CONFIG = mockConfig;
    
    // Reset gtag mock
    global.gtag = jest.fn();
    
    // Mock document elements
    document.body.innerHTML = `
      <nav class="main-navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
      </nav>
      <section id="about"></section>
      <section id="projects"></section>
      <a href="resume.pdf" download="resume.pdf">Download Resume</a>
      <form id="contact-form">
        <input name="name" value="John">
        <input name="email" value="john@example.com">
        <button type="submit">Submit</button>
      </form>
      <div class="project-card">
        <h3 class="project-title">Test Project</h3>
        <button class="demo-toggle" data-project="test">Demo</button>
        <a href="https://github.com/test/repo" class="project-link">GitHub</a>
      </div>
      <a href="installer.exe" class="download-btn windows" download="app.exe">
        <span class="file-size">10 MB</span>
      </a>
    `;
  });

  afterEach(() => {
    if (analyticsManager && analyticsManager.cleanup) {
      analyticsManager.cleanup();
    }
    delete window.ANALYTICS_CONFIG;
  });

  describe('Initialization', () => {
    test('should initialize with valid config', () => {
      localStorage.setItem('analytics_consent', 'true');
      
      analyticsManager = new AnalyticsManager();
      
      expect(analyticsManager.trackingId).toBe('G-TEST123456');
      expect(analyticsManager.debugMode).toBe(true);
      expect(analyticsManager.isAnalyticsLoaded).toBe(true);
    });

    test('should show consent banner when no consent given', () => {
      analyticsManager = new AnalyticsManager();
      
      const consentBanner = document.querySelector('.analytics-consent-banner');
      expect(consentBanner).toBeTruthy();
      expect(consentBanner.textContent).toContain('Google Analytics');
    });

    test('should not load analytics with invalid tracking ID', () => {
      mockConfig.googleAnalytics.trackingId = 'G-XXXXXXXXXX';
      window.ANALYTICS_CONFIG = mockConfig;
      localStorage.setItem('analytics_consent', 'true');
      
      analyticsManager = new AnalyticsManager();
      
      expect(analyticsManager.isAnalyticsLoaded).toBe(false);
    });

    test('should enable debug mode in development', () => {
      // Mock localhost
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });
      
      analyticsManager = new AnalyticsManager();
      
      expect(analyticsManager.debugMode).toBe(true);
    });
  });

  describe('Consent Management', () => {
    test('should handle consent acceptance', () => {
      analyticsManager = new AnalyticsManager();
      
      const consentBanner = document.querySelector('.analytics-consent-banner');
      const acceptButton = consentBanner.querySelector('.consent-accept');
      
      acceptButton.click();
      
      expect(localStorage.getItem('analytics_consent')).toBe('true');
      expect(localStorage.getItem('analytics_consent_shown')).toBe('true');
      expect(document.querySelector('.analytics-consent-banner')).toBeFalsy();
    });

    test('should handle consent decline', () => {
      analyticsManager = new AnalyticsManager();
      
      const consentBanner = document.querySelector('.analytics-consent-banner');
      const declineButton = consentBanner.querySelector('.consent-decline');
      
      declineButton.click();
      
      expect(localStorage.getItem('analytics_consent')).toBe('false');
      expect(localStorage.getItem('analytics_consent_shown')).toBe('true');
      expect(document.querySelector('.analytics-consent-banner')).toBeFalsy();
    });

    test('should not show banner if already shown', () => {
      localStorage.setItem('analytics_consent_shown', 'true');
      
      analyticsManager = new AnalyticsManager();
      
      const consentBanner = document.querySelector('.analytics-consent-banner');
      expect(consentBanner).toBeFalsy();
    });
  });

  describe('Event Tracking', () => {
    beforeEach(() => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
    });

    test('should track custom events', () => {
      const eventData = {
        test_parameter: 'test_value',
        numeric_value: 123
      };
      
      analyticsManager.trackEvent('test_event', eventData);
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'test_event', 
        expect.objectContaining({
          test_parameter: 'test_value',
          numeric_value: 123,
          timestamp: expect.any(String),
          user_agent: expect.any(String)
        })
      );
    });

    test('should track resume downloads', () => {
      const resumeLink = document.querySelector('a[download*="resume"]');
      
      resumeLink.click();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'file_download',
        expect.objectContaining({
          file_name: 'resume.pdf',
          file_type: 'resume',
          download_method: 'direct_link'
        })
      );
    });

    test('should track contact form submissions', () => {
      const form = document.getElementById('contact-form');
      
      const submitEvent = createMockEvent('submit');
      form.dispatchEvent(submitEvent);
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'form_submit',
        expect.objectContaining({
          form_type: 'contact',
          form_fields: 'name,email',
          form_completion: 100
        })
      );
    });

    test('should track project demo interactions', () => {
      const demoButton = document.querySelector('.demo-toggle');
      
      demoButton.click();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'demo_interaction',
        expect.objectContaining({
          project_id: 'test',
          project_name: 'Test Project',
          action: 'open',
          interaction_type: 'demo_toggle'
        })
      );
    });

    test('should track external link clicks', () => {
      const githubLink = document.querySelector('a[href*="github.com"]');
      
      githubLink.click();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'external_link_click',
        expect.objectContaining({
          link_type: 'github',
          destination_url: 'https://github.com/test/repo',
          project_name: 'Test Project'
        })
      );
    });

    test('should track installer downloads', () => {
      const downloadButton = document.querySelector('.download-btn');
      
      downloadButton.click();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'installer_download',
        expect.objectContaining({
          platform: 'windows',
          file_name: 'app.exe',
          file_size: '10 MB',
          download_type: 'installer'
        })
      );
    });

    test('should track navigation clicks', () => {
      const navLink = document.querySelector('.main-navigation a[href="#about"]');
      
      navLink.click();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'navigation_click',
        expect.objectContaining({
          target_section: 'about',
          navigation_type: 'main_menu'
        })
      );
    });
  });

  describe('Conversion Tracking', () => {
    beforeEach(() => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
    });

    test('should track conversions with proper configuration', () => {
      analyticsManager.trackConversion('resume_download');
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'conversion',
        expect.objectContaining({
          conversion_type: 'resume_download',
          conversion_value: 10,
          currency: 'USD'
        })
      );
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'conversion', {
        send_to: 'G-TEST123456',
        value: 10,
        currency: 'USD',
        event_category: 'engagement',
        event_label: 'resume_download'
      });
    });

    test('should track conversions with default values', () => {
      analyticsManager.trackConversion('unknown_conversion');
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'conversion',
        expect.objectContaining({
          conversion_type: 'unknown_conversion',
          conversion_value: 1,
          currency: 'USD'
        })
      );
    });
  });

  describe('Scroll Depth Tracking', () => {
    beforeEach(() => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
      
      // Mock document dimensions
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 800,
        writable: true
      });
    });

    test('should track scroll depth milestones', () => {
      // Mock scroll position for 50% depth
      Object.defineProperty(window, 'scrollY', {
        value: 600, // 50% of (2000 - 800)
        writable: true
      });
      
      // Trigger scroll event
      const scrollEvent = createMockEvent('scroll');
      window.dispatchEvent(scrollEvent);
      
      // Wait for throttled execution
      setTimeout(() => {
        expect(global.gtag).toHaveBeenCalledWith('event', 'scroll_depth',
          expect.objectContaining({
            scroll_percentage: 50
          })
        );
      }, 150);
    });
  });

  describe('Performance Tracking', () => {
    beforeEach(() => {
      localStorage.setItem('analytics_consent', 'true');
      
      // Mock performance API
      global.performance.getEntriesByType = jest.fn((type) => {
        if (type === 'navigation') {
          return [{
            fetchStart: 0,
            loadEventEnd: 1500,
            domContentLoadedEventEnd: 800
          }];
        }
        if (type === 'paint') {
          return [{
            name: 'first-paint',
            startTime: 500
          }];
        }
        return [];
      });
      
      analyticsManager = new AnalyticsManager();
    });

    test('should track page performance metrics on load', (done) => {
      // Simulate window load event
      const loadEvent = createMockEvent('load');
      window.dispatchEvent(loadEvent);
      
      setTimeout(() => {
        expect(global.gtag).toHaveBeenCalledWith('event', 'page_performance',
          expect.objectContaining({
            load_time: expect.any(Number),
            dom_content_loaded: expect.any(Number)
          })
        );
        done();
      }, 1100);
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
    });

    test('should get current section based on scroll position', () => {
      // Mock getBoundingClientRect for sections
      const aboutSection = document.getElementById('about');
      aboutSection.getBoundingClientRect = jest.fn(() => ({
        top: 50,
        bottom: 200
      }));
      
      const currentSection = analyticsManager.getCurrentSection();
      expect(currentSection).toBe('about');
    });

    test('should identify platform from download button', () => {
      const windowsBtn = document.querySelector('.download-btn.windows');
      const platform = analyticsManager.getPlatformFromButton(windowsBtn);
      expect(platform).toBe('windows');
    });

    test('should calculate form completion percentage', () => {
      const formFields = {
        name: 'filled',
        email: 'filled',
        message: 'empty'
      };
      
      const completion = analyticsManager.calculateFormCompletion(formFields);
      expect(completion).toBe(67); // 2 out of 3 fields filled
    });

    test('should identify external links correctly', () => {
      expect(analyticsManager.isExternalLink('https://github.com/test')).toBe(true);
      expect(analyticsManager.isExternalLink('/internal-page')).toBe(false);
      expect(analyticsManager.isExternalLink('#section')).toBe(false);
    });

    test('should categorize link types correctly', () => {
      expect(analyticsManager.getLinkType('https://github.com/user/repo')).toBe('github');
      expect(analyticsManager.getLinkType('https://linkedin.com/in/user')).toBe('linkedin');
      expect(analyticsManager.getLinkType('https://example.com')).toBe('external');
    });
  });

  describe('Debug Mode', () => {
    test('should enable debug mode', () => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
      
      analyticsManager.enableDebugMode();
      expect(analyticsManager.debugMode).toBe(true);
    });

    test('should disable debug mode', () => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
      
      analyticsManager.disableDebugMode();
      expect(analyticsManager.debugMode).toBe(false);
    });

    test('should log events in debug mode', () => {
      localStorage.setItem('analytics_consent', 'true');
      analyticsManager = new AnalyticsManager();
      analyticsManager.enableDebugMode();
      
      const consoleSpy = jest.spyOn(console, 'log');
      
      analyticsManager.trackEvent('test_event', { test: 'data' });
      
      expect(consoleSpy).toHaveBeenCalledWith('Event tracked:', 'test_event', expect.any(Object));
    });
  });

  describe('Error Handling', () => {
    test('should handle missing gtag gracefully', () => {
      localStorage.setItem('analytics_consent', 'true');
      global.gtag = undefined;
      
      analyticsManager = new AnalyticsManager();
      
      expect(() => {
        analyticsManager.trackEvent('test_event');
      }).not.toThrow();
    });

    test('should handle analytics not loaded', () => {
      analyticsManager = new AnalyticsManager();
      analyticsManager.isAnalyticsLoaded = false;
      
      const consoleSpy = jest.spyOn(console, 'log');
      
      analyticsManager.trackEvent('test_event');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Analytics not loaded, event queued:', 'test_event', {}
      );
    });
  });
});