/**
 * Analytics and Tracking Module
 * Handles Google Analytics 4 integration and custom event tracking
 */

class AnalyticsManager {
    constructor() {
        this.isAnalyticsLoaded = false;
        this.config = window.ANALYTICS_CONFIG || {};
        this.trackingId = this.config.googleAnalytics?.trackingId || 'G-XXXXXXXXXX';
        this.debugMode = this.config.debug?.enabled || false;
        
        // Auto-enable debug mode in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.debugMode = true;
        }
        
        // Initialize analytics
        this.init();
    }

    /**
     * Initialize Google Analytics 4
     */
    init() {
        // Check if user has consented to analytics (GDPR compliance)
        if (this.hasAnalyticsConsent()) {
            this.loadGoogleAnalytics();
            this.setupEventListeners();
        } else {
            this.showConsentBanner();
        }
    }

    /**
     * Load Google Analytics 4 script
     */
    loadGoogleAnalytics() {
        try {
            // Validate tracking ID format
            if (!this.trackingId || this.trackingId === 'G-XXXXXXXXXX') {
                console.warn('Analytics: Invalid or placeholder tracking ID. Please update analytics-config.js');
                return;
            }
            
            // Load gtag script with error handling
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
            script.onerror = () => {
                console.error('Analytics: Failed to load Google Analytics script');
                this.isAnalyticsLoaded = false;
            };
            script.onload = () => {
                if (this.debugMode) {
                    console.log('Google Analytics script loaded successfully');
                }
            };
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            
            // Configure with privacy-friendly settings
            const config = {
                // Privacy settings
                anonymize_ip: this.config.googleAnalytics?.anonymizeIp !== false,
                allow_google_signals: this.config.googleAnalytics?.allowGoogleSignals === true,
                allow_ad_personalization_signals: this.config.googleAnalytics?.allowAdPersonalization === true,
                cookie_flags: this.config.googleAnalytics?.cookieFlags || 'SameSite=None;Secure',
                cookie_expires: this.config.googleAnalytics?.cookieExpires || 63072000,
                
                // Custom dimensions
                ...(this.config.googleAnalytics?.customDimensions || {})
            };
            
            gtag('config', this.trackingId, config);

            this.isAnalyticsLoaded = true;
            
            if (this.debugMode) {
                console.log('Google Analytics 4 configured:', config);
            }
            
        } catch (error) {
            console.error('Analytics: Error loading Google Analytics:', error);
            this.isAnalyticsLoaded = false;
        }
    }

    /**
     * Set up event listeners for tracking
     */
    setupEventListeners() {
        // Track resume downloads
        this.trackResumeDownloads();
        
        // Track contact form submissions
        this.trackContactFormSubmissions();
        
        // Track project demo interactions
        this.trackProjectDemoInteractions();
        
        // Track installer downloads
        this.trackInstallerDownloads();
        
        // Track navigation interactions
        this.trackNavigationClicks();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
        
        // Track performance metrics
        this.trackPerformanceMetrics();
    }

    /**
     * Track resume download events
     */
    trackResumeDownloads() {
        const resumeLinks = document.querySelectorAll('a[download*="resume"], a[href*="resume"]');
        
        resumeLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const fileName = link.download || link.href.split('/').pop();
                
                this.trackEvent('file_download', {
                    file_name: fileName,
                    file_type: 'resume',
                    download_method: 'direct_link',
                    section: this.getCurrentSection()
                });
                
                // Track as conversion goal
                this.trackConversion('resume_download');
                
                if (this.debugMode) {
                    console.log('Resume download tracked:', fileName);
                }
            });
        });
    }

    /**
     * Track contact form submissions
     */
    trackContactFormSubmissions() {
        const contactForms = document.querySelectorAll('form[id*="contact"], .contact-form form');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', (event) => {
                const formData = new FormData(form);
                const formFields = {};
                
                // Collect form field types (not values for privacy)
                for (let [key, value] of formData.entries()) {
                    formFields[key] = value ? 'filled' : 'empty';
                }
                
                this.trackEvent('form_submit', {
                    form_type: 'contact',
                    form_fields: Object.keys(formFields).join(','),
                    form_completion: this.calculateFormCompletion(formFields)
                });
                
                // Track as conversion goal
                this.trackConversion('contact_form_submit');
                
                if (this.debugMode) {
                    console.log('Contact form submission tracked');
                }
            });
        });
    }

    /**
     * Track project demo interactions
     */
    trackProjectDemoInteractions() {
        // Track demo toggle buttons
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('demo-toggle')) {
                const projectId = event.target.dataset.project;
                const isOpening = !event.target.classList.contains('active');
                const projectCard = event.target.closest('.project-card');
                const projectTitle = projectCard?.querySelector('.project-title')?.textContent || 'unknown';
                
                this.trackEvent('demo_interaction', {
                    project_id: projectId,
                    project_name: projectTitle,
                    action: isOpening ? 'open' : 'close',
                    interaction_type: 'demo_toggle'
                });
                
                // Track demo opens as engagement events
                if (isOpening) {
                    this.trackEvent('engagement', {
                        engagement_type: 'demo_view',
                        project_name: projectTitle,
                        engagement_value: 5
                    });
                }
            }
            
            // Track all external links
            const link = event.target.closest('a[href]');
            if (link && this.isExternalLink(link.href)) {
                const linkType = this.getLinkType(link.href);
                const projectCard = link.closest('.project-card');
                const projectTitle = projectCard?.querySelector('.project-title')?.textContent || null;
                
                this.trackEvent('external_link_click', {
                    link_type: linkType,
                    destination_url: link.href,
                    project_name: projectTitle,
                    link_text: link.textContent?.trim() || 'unknown'
                });
            }
        });
        
        // Track iframe load events for demos
        document.addEventListener('load', (event) => {
            if (event.target.tagName === 'IFRAME' && event.target.classList.contains('demo-iframe')) {
                const demoContainer = event.target.closest('.embedded-demo');
                const projectId = demoContainer?.id?.replace('demo-', '') || 'unknown';
                
                this.trackEvent('demo_loaded', {
                    project_id: projectId,
                    iframe_src: event.target.src
                });
            }
        }, true);
    }

    /**
     * Track installer downloads
     */
    trackInstallerDownloads() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const platform = this.getPlatformFromButton(button);
                const fileName = button.download || button.href.split('/').pop();
                const fileSize = button.querySelector('.file-size')?.textContent || 'unknown';
                const projectCard = button.closest('.project-card');
                const projectName = projectCard?.querySelector('.project-title')?.textContent || 'unknown';
                
                this.trackEvent('installer_download', {
                    project_name: projectName,
                    platform: platform,
                    file_name: fileName,
                    file_size: fileSize,
                    download_type: 'installer'
                });
                
                // Track as conversion goal
                this.trackConversion('installer_download');
                
                if (this.debugMode) {
                    console.log('Installer download tracked:', {
                        project: projectName,
                        platform: platform,
                        file: fileName
                    });
                }
            });
        });
    }

    /**
     * Track navigation clicks
     */
    trackNavigationClicks() {
        const navLinks = document.querySelectorAll('.main-navigation a, .nav-menu a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetSection = link.getAttribute('href')?.replace('#', '') || 'unknown';
                
                this.trackEvent('navigation_click', {
                    target_section: targetSection,
                    navigation_type: 'main_menu',
                    current_section: this.getCurrentSection()
                });
            });
        });
    }

    /**
     * Track scroll depth
     */
    trackScrollDepth() {
        const scrollThresholds = [25, 50, 75, 90, 100];
        const trackedThresholds = new Set();
        
        const trackScrollDepth = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    
                    this.trackEvent('scroll_depth', {
                        scroll_percentage: threshold,
                        page_section: this.getCurrentSection()
                    });
                }
            });
        };
        
        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });
    }

    /**
     * Track time spent on page
     */
    trackTimeOnPage() {
        const startTime = Date.now();
        const timeThresholds = [30, 60, 120, 300, 600]; // seconds
        const trackedTimes = new Set();
        
        const trackTimeSpent = () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            timeThresholds.forEach(threshold => {
                if (timeSpent >= threshold && !trackedTimes.has(threshold)) {
                    trackedTimes.add(threshold);
                    
                    this.trackEvent('time_on_page', {
                        time_threshold: threshold,
                        current_section: this.getCurrentSection()
                    });
                }
            });
        };
        
        // Check time spent every 10 seconds
        setInterval(trackTimeSpent, 10000);
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            this.trackEvent('page_exit', {
                total_time_spent: totalTime,
                exit_section: this.getCurrentSection()
            });
        });
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.isAnalyticsLoaded) {
            if (this.debugMode) {
                console.log('Analytics not loaded, event queued:', eventName, parameters);
            }
            return;
        }
        
        // Add common parameters
        const eventData = {
            ...parameters,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        if (this.debugMode) {
            console.log('Event tracked:', eventName, eventData);
        }
    }

    /**
     * Track conversion goals
     */
    trackConversion(conversionType) {
        const conversionConfig = this.config.conversions?.[conversionType] || {};
        const conversionValue = conversionConfig.value || 1;
        const currency = conversionConfig.currency || 'USD';
        
        this.trackEvent('conversion', {
            conversion_type: conversionType,
            conversion_timestamp: Date.now(),
            conversion_value: conversionValue,
            currency: currency
        });
        
        // Send conversion to Google Analytics with proper configuration
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: this.trackingId,
                value: conversionValue,
                currency: currency,
                event_category: 'engagement',
                event_label: conversionType
            });
            
            // Also track as a custom event for better reporting
            gtag('event', conversionType, {
                event_category: 'conversion',
                event_label: 'goal_completion',
                value: conversionValue
            });
        }
        
        if (this.debugMode) {
            console.log('Conversion tracked:', {
                type: conversionType,
                value: conversionValue,
                currency: currency
            });
        }
    }

    /**
     * Get current section based on scroll position
     */
    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        return currentSection;
    }

    /**
     * Get platform from download button
     */
    getPlatformFromButton(button) {
        if (button.classList.contains('windows')) return 'windows';
        if (button.classList.contains('mac')) return 'mac';
        if (button.classList.contains('linux')) return 'linux';
        return 'unknown';
    }

    /**
     * Calculate form completion percentage
     */
    calculateFormCompletion(formFields) {
        const totalFields = Object.keys(formFields).length;
        const filledFields = Object.values(formFields).filter(value => value === 'filled').length;
        return Math.round((filledFields / totalFields) * 100);
    }

    /**
     * Check if user has consented to analytics
     */
    hasAnalyticsConsent() {
        return localStorage.getItem('analytics_consent') === 'true';
    }

    /**
     * Show consent banner for GDPR compliance
     */
    showConsentBanner() {
        // Only show if not already dismissed
        if (localStorage.getItem('analytics_consent_shown') === 'true') {
            return;
        }
        
        const banner = document.createElement('div');
        banner.className = 'analytics-consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <p>This website uses Google Analytics to understand how visitors interact with the site. No personal information is collected.</p>
                <div class="consent-buttons">
                    <button class="consent-accept">Accept Analytics</button>
                    <button class="consent-decline">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            z-index: 10000;
            text-align: center;
        `;
        
        document.body.appendChild(banner);
        
        // Handle consent buttons
        banner.querySelector('.consent-accept').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'true');
            localStorage.setItem('analytics_consent_shown', 'true');
            banner.remove();
            this.loadGoogleAnalytics();
            this.setupEventListeners();
        });
        
        banner.querySelector('.consent-decline').addEventListener('click', () => {
            localStorage.setItem('analytics_consent', 'false');
            localStorage.setItem('analytics_consent_shown', 'true');
            banner.remove();
        });
    }

    /**
     * Enable debug mode
     */
    enableDebugMode() {
        this.debugMode = true;
        console.log('Analytics debug mode enabled');
    }

    /**
     * Disable debug mode
     */
    disableDebugMode() {
        this.debugMode = false;
    }
    
    /**
     * Check if a URL is external
     */
    isExternalLink(url) {
        try {
            const link = new URL(url, window.location.origin);
            return link.hostname !== window.location.hostname;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Determine the type of external link
     */
    getLinkType(url) {
        const hostname = new URL(url).hostname.toLowerCase();
        
        if (hostname.includes('github.com')) return 'github';
        if (hostname.includes('linkedin.com')) return 'linkedin';
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
        if (hostname.includes('instagram.com')) return 'instagram';
        if (hostname.includes('facebook.com')) return 'facebook';
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
        if (hostname.includes('medium.com')) return 'medium';
        if (hostname.includes('dev.to')) return 'dev_to';
        if (hostname.includes('stackoverflow.com')) return 'stackoverflow';
        if (hostname.includes('codepen.io')) return 'codepen';
        if (hostname.includes('netlify.app') || hostname.includes('vercel.app') || hostname.includes('herokuapp.com')) return 'demo_site';
        
        return 'external';
    }
    
    /**
     * Track page performance metrics
     */
    trackPerformanceMetrics() {
        // Track Core Web Vitals when available
        if ('web-vital' in window) {
            return; // Assume another script handles this
        }
        
        // Basic performance tracking
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.trackEvent('page_performance', {
                        load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                        first_paint: this.getFirstPaint(),
                        connection_type: navigator.connection?.effectiveType || 'unknown'
                    });
                }
            }, 1000);
        });
    }
    
    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
    
    // Enable debug mode in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.analyticsManager.enableDebugMode();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}