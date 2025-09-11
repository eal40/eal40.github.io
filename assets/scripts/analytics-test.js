/**
 * Analytics Testing Utilities
 * Use this script to test analytics functionality in development
 */

class AnalyticsTest {
    constructor() {
        this.testResults = [];
    }

    /**
     * Run all analytics tests
     */
    runAllTests() {
        console.log('🧪 Starting Analytics Tests...');
        
        this.testConfigurationLoaded();
        this.testAnalyticsManagerInitialized();
        this.testConsentBanner();
        this.testEventTracking();
        this.testConversionTracking();
        
        this.displayResults();
    }

    /**
     * Test if configuration is loaded properly
     */
    testConfigurationLoaded() {
        const test = {
            name: 'Configuration Loaded',
            passed: false,
            message: ''
        };

        if (window.ANALYTICS_CONFIG) {
            if (window.ANALYTICS_CONFIG.googleAnalytics?.trackingId !== 'G-XXXXXXXXXX') {
                test.passed = true;
                test.message = '✅ Analytics configuration loaded with valid tracking ID';
            } else {
                test.message = '⚠️ Analytics configuration loaded but tracking ID is placeholder';
            }
        } else {
            test.message = '❌ Analytics configuration not found';
        }

        this.testResults.push(test);
    }

    /**
     * Test if analytics manager is initialized
     */
    testAnalyticsManagerInitialized() {
        const test = {
            name: 'Analytics Manager Initialized',
            passed: false,
            message: ''
        };

        if (window.analyticsManager) {
            test.passed = true;
            test.message = '✅ Analytics manager initialized successfully';
        } else {
            test.message = '❌ Analytics manager not found';
        }

        this.testResults.push(test);
    }

    /**
     * Test consent banner functionality
     */
    testConsentBanner() {
        const test = {
            name: 'Consent Banner',
            passed: false,
            message: ''
        };

        // Clear consent to test banner
        localStorage.removeItem('analytics_consent');
        localStorage.removeItem('analytics_consent_shown');

        // Check if banner appears
        setTimeout(() => {
            const banner = document.querySelector('.analytics-consent-banner');
            if (banner) {
                test.passed = true;
                test.message = '✅ Consent banner displayed correctly';
            } else {
                test.message = '❌ Consent banner not found';
            }
        }, 100);

        this.testResults.push(test);
    }

    /**
     * Test event tracking
     */
    testEventTracking() {
        const test = {
            name: 'Event Tracking',
            passed: false,
            message: ''
        };

        if (window.analyticsManager) {
            // Test custom event tracking
            try {
                window.analyticsManager.trackEvent('test_event', {
                    test_parameter: 'test_value'
                });
                test.passed = true;
                test.message = '✅ Event tracking working';
            } catch (error) {
                test.message = `❌ Event tracking failed: ${error.message}`;
            }
        } else {
            test.message = '❌ Analytics manager not available for testing';
        }

        this.testResults.push(test);
    }

    /**
     * Test conversion tracking
     */
    testConversionTracking() {
        const test = {
            name: 'Conversion Tracking',
            passed: false,
            message: ''
        };

        if (window.analyticsManager) {
            try {
                window.analyticsManager.trackConversion('test_conversion');
                test.passed = true;
                test.message = '✅ Conversion tracking working';
            } catch (error) {
                test.message = `❌ Conversion tracking failed: ${error.message}`;
            }
        } else {
            test.message = '❌ Analytics manager not available for testing';
        }

        this.testResults.push(test);
    }

    /**
     * Display test results
     */
    displayResults() {
        console.log('\n📊 Analytics Test Results:');
        console.log('========================');
        
        this.testResults.forEach(test => {
            console.log(`${test.name}: ${test.message}`);
        });

        const passedTests = this.testResults.filter(test => test.passed).length;
        const totalTests = this.testResults.length;
        
        console.log(`\n📈 Summary: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All analytics tests passed!');
        } else {
            console.log('⚠️ Some analytics tests failed. Check configuration and implementation.');
        }
    }

    /**
     * Test specific tracking elements
     */
    testTrackingElements() {
        console.log('\n🔍 Testing Tracking Elements:');
        
        // Test resume download links
        const resumeLinks = document.querySelectorAll('a[download*="resume"], a[href*="resume"]');
        console.log(`📄 Resume download links found: ${resumeLinks.length}`);
        
        // Test contact forms
        const contactForms = document.querySelectorAll('form[id*="contact"], .contact-form form');
        console.log(`📧 Contact forms found: ${contactForms.length}`);
        
        // Test demo buttons
        const demoButtons = document.querySelectorAll('.demo-toggle');
        console.log(`🎮 Demo toggle buttons found: ${demoButtons.length}`);
        
        // Test download buttons
        const downloadButtons = document.querySelectorAll('.download-btn');
        console.log(`⬇️ Download buttons found: ${downloadButtons.length}`);
        
        // Test navigation links
        const navLinks = document.querySelectorAll('.main-navigation a, .nav-menu a');
        console.log(`🧭 Navigation links found: ${navLinks.length}`);
    }

    /**
     * Simulate user interactions for testing
     */
    simulateInteractions() {
        console.log('\n🤖 Simulating User Interactions:');
        
        // Simulate scroll
        window.scrollTo(0, document.body.scrollHeight * 0.5);
        console.log('📜 Simulated scroll to 50%');
        
        // Simulate navigation click
        const firstNavLink = document.querySelector('.main-navigation a');
        if (firstNavLink) {
            firstNavLink.click();
            console.log('🔗 Simulated navigation click');
        }
        
        // Note: Don't simulate form submissions or downloads in testing
        console.log('ℹ️ Form submissions and downloads not simulated to avoid spam');
    }
}

// Initialize testing utilities
window.AnalyticsTest = AnalyticsTest;

// Auto-run tests in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const tester = new AnalyticsTest();
            tester.runAllTests();
            tester.testTrackingElements();
            
            // Add testing commands to console
            console.log('\n🛠️ Analytics Testing Commands:');
            console.log('- window.analyticsTest.runAllTests() - Run all tests');
            console.log('- window.analyticsTest.testTrackingElements() - Check tracking elements');
            console.log('- window.analyticsTest.simulateInteractions() - Simulate user interactions');
            console.log('- window.analyticsManager.enableDebugMode() - Enable debug mode');
            console.log('- window.analyticsManager.trackEvent("test", {param: "value"}) - Test event tracking');
            
            window.analyticsTest = tester;
        }, 2000);
    });
}