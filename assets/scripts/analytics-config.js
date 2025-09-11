/**
 * Analytics Configuration
 * Update this file with your actual tracking IDs and settings
 */

const ANALYTICS_CONFIG = {
    // Google Analytics 4 Configuration
    googleAnalytics: {
        trackingId: 'G-XXXXXXXXXX', // Replace with your actual GA4 tracking ID
        enabled: true,
        
        // Privacy settings
        anonymizeIp: true,
        allowGoogleSignals: false,
        allowAdPersonalization: false,
        
        // Cookie settings
        cookieFlags: 'SameSite=None;Secure',
        cookieExpires: 63072000, // 2 years in seconds
        
        // Custom dimensions (optional)
        customDimensions: {
            user_type: 'student',
            portfolio_version: '1.0',
            university: '[University Name]'
        }
    },
    
    // Alternative Analytics (if not using Google Analytics)
    plausible: {
        domain: '[your-domain].com',
        enabled: false, // Set to true if using Plausible instead of GA
        apiHost: 'https://plausible.io'
    },
    
    // Privacy and Consent Settings
    privacy: {
        requireConsent: true, // Set to false if not in EU/GDPR region
        consentBannerEnabled: true,
        respectDoNotTrack: true,
        
        // Consent banner text
        consentText: {
            message: "This website uses analytics to understand how visitors interact with the site. No personal information is collected.",
            acceptButton: "Accept Analytics",
            declineButton: "Decline",
            learnMoreLink: "/privacy-policy" // Optional privacy policy link
        }
    },
    
    // Event Tracking Configuration
    events: {
        // Resume download tracking
        resumeDownload: {
            enabled: true,
            eventName: 'file_download',
            conversionValue: 10 // Assign value to conversion
        },
        
        // Contact form tracking
        contactForm: {
            enabled: true,
            eventName: 'form_submit',
            conversionValue: 20
        },
        
        // Project demo tracking
        projectDemo: {
            enabled: true,
            eventName: 'demo_interaction',
            trackDuration: true
        },
        
        // Installer download tracking
        installerDownload: {
            enabled: true,
            eventName: 'installer_download',
            conversionValue: 15
        },
        
        // Navigation tracking
        navigation: {
            enabled: true,
            eventName: 'navigation_click',
            trackScrollDepth: true
        },
        
        // Performance tracking
        performance: {
            enabled: true,
            trackPageLoad: true,
            trackTimeOnPage: true,
            scrollDepthThresholds: [25, 50, 75, 90, 100]
        }
    },
    
    // Debug and Development Settings
    debug: {
        enabled: false, // Will be automatically enabled on localhost
        consoleLogging: true,
        showDebugPanel: false,
        trackInDevelopment: false // Set to true to track events in development
    },
    
    // Goals and Conversions
    conversions: {
        resume_download: {
            goalId: 'resume_download',
            value: 1,
            currency: 'USD'
        },
        contact_form_submit: {
            goalId: 'contact_form_submit',
            value: 2,
            currency: 'USD'
        },
        installer_download: {
            goalId: 'installer_download',
            value: 1.5,
            currency: 'USD'
        },
        demo_interaction: {
            goalId: 'demo_view',
            value: 0.5,
            currency: 'USD'
        },
        external_link_click: {
            goalId: 'external_engagement',
            value: 0.25,
            currency: 'USD'
        }
    },
    
    // Enhanced ecommerce tracking (optional)
    ecommerce: {
        enabled: false, // Set to true to track downloads as purchases
        items: {
            resume: {
                item_id: 'resume_pdf',
                item_name: 'Resume Download',
                item_category: 'Document',
                price: 1.00
            },
            installer: {
                item_id: 'app_installer',
                item_name: 'Application Installer',
                item_category: 'Software',
                price: 1.50
            }
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANALYTICS_CONFIG;
} else {
    window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
}