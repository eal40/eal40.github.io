// Performance Optimization Module
class PerformanceOptimizer {
    constructor() {
        this.criticalResourcesLoaded = false;
        this.deferredResourcesLoaded = false;
        this.performanceMetrics = {};
        this.navUpdatePending = false;
        this.init();
    }

    init() {
        this.measureInitialLoad();
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.implementResourceHints();
        this.optimizeCSSDelivery();
        this.optimizeJavaScriptExecution();
        this.deferNonCriticalResources();
        this.optimizeScrollPerformance();
        this.setupPerformanceMonitoring();
        
        // Optimize remaining images after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.optimizeRemainingImages();
            });
        } else {
            this.optimizeRemainingImages();
        }
        
        console.log('Performance optimizer initialized with advanced optimizations');
    }

    // Measure initial page load performance
    measureInitialLoad() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    
                    this.performanceMetrics = {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    };
                    
                    this.reportPerformanceMetrics();
                }, 1000);
            });
        }
    }

    // Get First Paint timing
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    // Get First Contentful Paint timing
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    // Setup lazy loading for images using Intersection Observer
    setupLazyLoading() {
        // Create intersection observer for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load the image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load srcset if available
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Add loading class for smooth transition
                    img.classList.add('lazy-loading');
                    
                    // Handle load completion
                    img.addEventListener('load', () => {
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-loaded');
                    });
                    
                    // Handle load errors
                    img.addEventListener('error', () => {
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-error');
                        console.warn('Failed to load lazy image:', img.dataset.src || img.src);
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
            
            // Add placeholder background
            if (!img.style.backgroundColor && !img.src) {
                img.style.backgroundColor = '#f0f0f0';
                img.style.minHeight = '200px';
            }
        });

        // Also setup lazy loading for iframes
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.removeAttribute('data-src');
                        iframeObserver.unobserve(iframe);
                    }
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        lazyIframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'assets/images/headshot.webp', as: 'image', type: 'image/webp' },
            { href: 'assets/images/headshot.jpg', as: 'image', type: 'image/jpeg' }
        ];

        criticalResources.forEach(resource => {
            const existingLink = document.querySelector(`link[href="${resource.href}"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                if (resource.type) {
                    link.type = resource.type;
                }
                document.head.appendChild(link);
            }
        });

        // Preconnect to external domains
        const preconnectDomains = [
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const existingLink = document.querySelector(`link[href="${domain}"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
    }

    // Defer non-critical resources
    deferNonCriticalResources() {
        // Defer non-critical JavaScript
        window.addEventListener('load', () => {
            // Load analytics after page load
            this.loadAnalytics();
            
            // Load other non-critical scripts
            this.loadNonCriticalScripts();
            
            this.deferredResourcesLoaded = true;
        });
    }

    // Load analytics scripts
    loadAnalytics() {
        // Load Google Analytics 4 if GA_MEASUREMENT_ID is defined
        if (typeof GA_MEASUREMENT_ID !== 'undefined') {
            this.loadGoogleAnalytics(GA_MEASUREMENT_ID);
        }
        
        // Load other analytics services
        this.loadAlternativeAnalytics();
        
        console.log('Analytics loading deferred until after page load');
    }

    // Load Google Analytics 4
    loadGoogleAnalytics(measurementId) {
        // Load gtag script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(gtagScript);

        // Initialize gtag
        gtagScript.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', measurementId, {
                page_title: document.title,
                page_location: window.location.href
            });
            
            // Make gtag globally available
            window.gtag = gtag;
            
            console.log('Google Analytics 4 loaded');
        };
    }

    // Load alternative analytics (privacy-focused)
    loadAlternativeAnalytics() {
        // Example: Load Plausible Analytics if configured
        if (typeof PLAUSIBLE_DOMAIN !== 'undefined') {
            const plausibleScript = document.createElement('script');
            plausibleScript.defer = true;
            plausibleScript.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
            plausibleScript.src = 'https://plausible.io/js/plausible.js';
            document.head.appendChild(plausibleScript);
            
            console.log('Plausible Analytics loaded');
        }
    }

    // Load non-critical scripts
    loadNonCriticalScripts() {
        // Load performance dashboard in development
        if (this.isDevelopmentMode()) {
            this.loadScript('assets/scripts/performance-dashboard.js');
        }
        
        // Load additional non-critical functionality
        this.loadScript('assets/scripts/social-media-integration.js', true);
        this.loadScript('assets/scripts/advanced-animations.js', true);
        
        console.log('Non-critical scripts loading deferred');
    }

    // Check if we're in development mode
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');
    }

    // Load script dynamically
    loadScript(src, optional = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                console.log(`Loaded script: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                if (optional) {
                    console.log(`Optional script not found: ${src}`);
                    resolve();
                } else {
                    console.error(`Failed to load script: ${src}`);
                    reject(new Error(`Failed to load ${src}`));
                }
            };
            
            document.head.appendChild(script);
        });
    }

    // Optimize scroll performance
    optimizeScrollPerformance() {
        let ticking = false;

        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Use passive event listeners for better performance
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250), { passive: true });
    }

    // Handle scroll effects efficiently
    handleScrollEffects() {
        const scrollY = window.scrollY;
        
        // Update navigation background
        const nav = document.querySelector('.main-navigation');
        if (nav) {
            if (scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Update active navigation links (throttled)
        if (!this.navUpdatePending) {
            this.navUpdatePending = true;
            requestAnimationFrame(() => {
                this.updateActiveNavigation();
                this.navUpdatePending = false;
            });
        }
    }

    // Update active navigation efficiently
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        const navigation = document.querySelector('.main-navigation');
        
        if (!navigation) return;
        
        const navigationHeight = navigation.offsetHeight;
        let currentSection = '';
        const scrollPosition = window.scrollY + navigationHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const linkId = link.getAttribute('href').substring(1);
            if (linkId === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Handle window resize
    handleResize() {
        // Recalculate any size-dependent optimizations
        this.optimizeViewportDependentElements();
    }

    // Optimize elements that depend on viewport size
    optimizeViewportDependentElements() {
        // Update image sizes based on viewport
        const images = document.querySelectorAll('img[sizes]');
        images.forEach(img => {
            const newSizes = this.calculateOptimalSizes(img);
            if (newSizes !== img.sizes) {
                img.sizes = newSizes;
            }
        });
    }

    // Calculate optimal sizes attribute for images
    calculateOptimalSizes(img) {
        const viewportWidth = window.innerWidth;
        
        if (img.closest('.hero-section')) {
            if (viewportWidth < 768) return '300px';
            if (viewportWidth < 1200) return '400px';
            return '500px';
        }
        
        if (img.closest('.project-card')) {
            if (viewportWidth < 768) return '100vw';
            if (viewportWidth < 1200) return '50vw';
            return '600px';
        }
        
        // Default responsive sizes
        if (viewportWidth < 768) return '100vw';
        if (viewportWidth < 1200) return '50vw';
        return '33vw';
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Long Tasks
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        console.warn('Long task detected:', entry.duration + 'ms');
                        this.trackPerformanceIssue('long-task', {
                            duration: entry.duration,
                            startTime: entry.startTime
                        });
                    });
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.log('Long task monitoring not supported');
            }
        }

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                    this.trackPerformanceIssue('high-memory', {
                        used: memInfo.usedJSHeapSize,
                        limit: memInfo.jsHeapSizeLimit
                    });
                }
            }, 30000);
        }
    }

    // Track performance issues
    trackPerformanceIssue(type, data) {
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('performance_issue', {
                type,
                data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        }
    }

    // Report performance metrics
    reportPerformanceMetrics() {
        console.log('Performance Metrics:', this.performanceMetrics);
        
        // Track metrics for analytics
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('performance_metrics', {
                ...this.performanceMetrics,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                connection: this.getConnectionInfo()
            });
        }

        // Log warnings for poor performance
        if (this.performanceMetrics.firstContentfulPaint > 2500) {
            console.warn('First Contentful Paint is slow:', this.performanceMetrics.firstContentfulPaint + 'ms');
        }
    }

    // Get connection information
    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get current performance status
    getPerformanceStatus() {
        return {
            criticalResourcesLoaded: this.criticalResourcesLoaded,
            deferredResourcesLoaded: this.deferredResourcesLoaded,
            metrics: this.performanceMetrics,
            memoryUsage: 'memory' in performance ? performance.memory : null,
            connection: this.getConnectionInfo(),
            resourceOptimization: this.getResourceOptimizationStatus()
        };
    }

    // Get resource optimization status
    getResourceOptimizationStatus() {
        const resources = performance.getEntriesByType('resource');
        const cssResources = resources.filter(r => r.name.includes('.css'));
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const imageResources = resources.filter(r => r.initiatorType === 'img');
        
        return {
            totalResources: resources.length,
            cssFiles: cssResources.length,
            jsFiles: jsResources.length,
            images: imageResources.length,
            totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            compressionRatio: this.calculateCompressionRatio(resources),
            cacheHitRate: this.calculateCacheHitRate(resources)
        };
    }

    // Calculate compression ratio
    calculateCompressionRatio(resources) {
        const totalDecodedSize = resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0);
        const totalTransferSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        
        if (totalDecodedSize === 0) return 0;
        return ((totalDecodedSize - totalTransferSize) / totalDecodedSize * 100).toFixed(2);
    }

    // Calculate cache hit rate
    calculateCacheHitRate(resources) {
        const cachedResources = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0);
        return resources.length > 0 ? ((cachedResources.length / resources.length) * 100).toFixed(2) : 0;
    }

    // Optimize remaining images
    optimizeRemainingImages() {
        const images = document.querySelectorAll('img:not(.optimized)');
        images.forEach(img => {
            // Add loading optimization
            if (!img.loading) {
                const rect = img.getBoundingClientRect();
                const isAboveFold = rect.top < window.innerHeight;
                img.loading = isAboveFold ? 'eager' : 'lazy';
            }
            
            // Add decode hint
            img.decoding = 'async';
            
            // Mark as optimized
            img.classList.add('optimized');
        });
    }

    // Optimize CSS delivery
    optimizeCSSDelivery() {
        // Identify critical CSS (above-the-fold styles)
        const criticalCSS = this.extractCriticalCSS();
        
        // Inline critical CSS if small enough
        if (criticalCSS.length < 14000) { // 14KB threshold
            this.inlineCriticalCSS(criticalCSS);
        }
        
        // Load non-critical CSS asynchronously
        this.loadNonCriticalCSS();
    }

    // Extract critical CSS (simplified implementation)
    extractCriticalCSS() {
        // This would typically be done during build time
        // For now, we'll identify critical selectors
        const criticalSelectors = [
            'body', 'html', '.main-navigation', '.hero-section',
            '.skip-link', '.sr-only', 'h1', 'h2', 'p'
        ];
        
        return criticalSelectors.join(',') + ' { /* Critical styles would be here */ }';
    }

    // Inline critical CSS
    inlineCriticalCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        style.setAttribute('data-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Load non-critical CSS asynchronously
    loadNonCriticalCSS() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        cssLinks.forEach(link => {
            // Convert to preload and then to stylesheet
            const href = link.href;
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            
            // Fallback for browsers that don't support preload
            const noscript = document.createElement('noscript');
            const fallbackLink = document.createElement('link');
            fallbackLink.rel = 'stylesheet';
            fallbackLink.href = href;
            noscript.appendChild(fallbackLink);
            document.head.appendChild(noscript);
        });
    }

    // Optimize JavaScript execution
    optimizeJavaScriptExecution() {
        // Add performance marks for script execution
        performance.mark('js-optimization-start');
        
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Optimize event listeners
        this.optimizeEventListeners();
        
        performance.mark('js-optimization-end');
        performance.measure('js-optimization', 'js-optimization-start', 'js-optimization-end');
    }

    // Defer non-critical JavaScript
    deferNonCriticalJS() {
        const scripts = document.querySelectorAll('script[src]:not([data-critical])');
        
        scripts.forEach(script => {
            if (!script.async && !script.defer) {
                script.defer = true;
            }
        });
    }

    // Optimize event listeners for better performance
    optimizeEventListeners() {
        // Use passive listeners where appropriate
        const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
        
        passiveEvents.forEach(eventType => {
            // Override addEventListener to add passive option
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (passiveEvents.includes(type) && typeof options !== 'object') {
                    options = { passive: true };
                } else if (typeof options === 'object' && options.passive === undefined) {
                    options.passive = true;
                }
                
                return originalAddEventListener.call(this, type, listener, options);
            };
        });
    }

    // Implement resource hints
    implementResourceHints() {
        // DNS prefetch for external domains
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com'
        ];
        
        externalDomains.forEach(domain => {
            if (!document.querySelector(`link[href*="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `//${domain}`;
                document.head.appendChild(link);
            }
        });
        
        // Preconnect to critical external resources
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        preconnectDomains.forEach(domain => {
            if (!document.querySelector(`link[href="${domain}"][rel="preconnect"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
    }
}

// Initialize performance optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}