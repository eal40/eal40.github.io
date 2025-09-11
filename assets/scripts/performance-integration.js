// Performance Integration Module
// This module integrates all performance optimizations and ensures they work together

class PerformanceIntegration {
    constructor() {
        this.optimizers = {};
        this.performanceMetrics = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('Initializing performance integration...');
        
        // Initialize all performance optimizers
        await this.initializeOptimizers();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Implement lazy loading for images
        this.implementLazyLoading();
        
        // Minimize and optimize CSS and JavaScript
        this.optimizeAssets();
        
        // Add resource preloading for critical assets
        this.preloadCriticalAssets();
        
        // Setup performance dashboard in development
        if (this.isDevelopmentMode()) {
            this.setupPerformanceDashboard();
        }
        
        this.isInitialized = true;
        console.log('Performance integration initialized successfully');
    }

    // Initialize all performance optimizers
    async initializeOptimizers() {
        try {
            // Wait for other optimizers to be available
            await this.waitForOptimizers();
            
            // Store references to optimizers
            this.optimizers = {
                performance: window.performanceOptimizer,
                image: window.imageOptimizer,
                css: window.cssOptimizer,
                resource: window.resourceOptimizer
            };
            
            console.log('All performance optimizers initialized');
        } catch (error) {
            console.error('Error initializing optimizers:', error);
        }
    }

    // Wait for optimizers to be available
    waitForOptimizers() {
        return new Promise((resolve) => {
            const checkOptimizers = () => {
                if (window.performanceOptimizer && 
                    window.imageOptimizer && 
                    window.cssOptimizer && 
                    window.resourceOptimizer) {
                    resolve();
                } else {
                    setTimeout(checkOptimizers, 100);
                }
            };
            checkOptimizers();
        });
    }

    // Implement lazy loading for images using Intersection Observer
    implementLazyLoading() {
        // Enhanced lazy loading with performance optimizations
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImageWithOptimization(img);
                    lazyImageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => {
            // Add loading placeholder
            this.addImagePlaceholder(img);
            lazyImageObserver.observe(img);
        });

        // Also implement lazy loading for iframes (project demos)
        this.implementIframeLazyLoading();

        console.log(`Lazy loading implemented for ${lazyImages.length} images`);
    }

    // Load image with performance optimizations
    async loadImageWithOptimization(img) {
        const startTime = performance.now();
        
        try {
            // Get optimized image source (WebP with fallback)
            const optimizedSrc = await this.getOptimizedImageSrc(img);
            
            // Create new image for preloading
            const newImg = new Image();
            
            newImg.onload = () => {
                img.src = optimizedSrc;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                // Remove placeholder styles
                img.style.backgroundColor = '';
                img.style.minHeight = '';
                
                // Track loading performance
                const loadTime = performance.now() - startTime;
                this.trackImageLoadPerformance(img.src, loadTime, true);
            };
            
            newImg.onerror = () => {
                // Fallback to original source
                const originalSrc = img.dataset.src || img.src;
                img.src = originalSrc;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-error');
                
                const loadTime = performance.now() - startTime;
                this.trackImageLoadPerformance(originalSrc, loadTime, false);
            };
            
            // Start loading
            img.classList.add('lazy-loading');
            newImg.src = optimizedSrc;
            
        } catch (error) {
            console.error('Error loading optimized image:', error);
            // Fallback to original
            img.src = img.dataset.src || img.src;
            img.classList.add('lazy-error');
        }
    }

    // Get optimized image source (WebP with JPEG fallback)
    async getOptimizedImageSrc(img) {
        const originalSrc = img.dataset.src || img.src;
        
        // Check if WebP is supported
        const webpSupported = await this.checkWebPSupport();
        
        if (webpSupported) {
            const webpSrc = this.convertToWebP(originalSrc);
            const webpExists = await this.checkImageExists(webpSrc);
            
            if (webpExists) {
                return webpSrc;
            }
        }
        
        return originalSrc;
    }

    // Check WebP support
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Convert image path to WebP
    convertToWebP(imagePath) {
        return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    // Check if image exists
    checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    // Add image placeholder
    addImagePlaceholder(img) {
        if (!img.style.backgroundColor) {
            img.style.backgroundColor = '#f0f0f0';
            img.style.minHeight = '200px';
            img.style.display = 'block';
        }
    }

    // Implement iframe lazy loading for project demos
    implementIframeLazyLoading() {
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

        console.log(`Lazy loading implemented for ${lazyIframes.length} iframes`);
    }

    // Minimize and optimize CSS and JavaScript files
    optimizeAssets() {
        // Optimize CSS
        this.optimizeCSS();
        
        // Optimize JavaScript
        this.optimizeJavaScript();
        
        // Optimize external resources
        this.optimizeExternalResources();
        
        console.log('Asset optimization completed');
    }

    // Optimize CSS delivery and minification
    optimizeCSS() {
        // Inline critical CSS
        this.inlineCriticalCSS();
        
        // Load non-critical CSS asynchronously
        this.loadNonCriticalCSS();
        
        // Minify inline CSS
        this.minifyInlineCSS();
    }

    // Inline critical CSS for above-the-fold content
    inlineCriticalCSS() {
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1e293b}
            .main-navigation{position:fixed;top:0;width:100%;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);z-index:1000;box-shadow:0 2px 20px rgba(0,0,0,0.1)}
            .nav-container{max-width:1200px;margin:0 auto;padding:1rem;display:flex;justify-content:space-between;align-items:center}
            .hero-section{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2563eb 0%,#3b82f6 25%,#0ea5e9 75%,#38bdf8 100%);color:white;text-align:center}
            .hero-image{width:200px;height:200px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.3)}
            .btn{display:inline-block;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;transition:all 0.3s ease}
            .btn-primary{background:#2563eb;color:white}
            .btn-secondary{background:transparent;color:white;border:2px solid white}
            .skip-link{position:absolute;top:-40px;left:6px;background:#2563eb;color:white;padding:8px;text-decoration:none;border-radius:4px;z-index:9999}
            .skip-link:focus{top:6px}
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
            .lazy-loading{opacity:0.7;background:#f0f0f0}
            .lazy-loaded{opacity:1;transition:opacity 0.3s ease}
        `;

        // Check if critical CSS is already inlined
        if (!document.querySelector('style[data-critical-css]')) {
            const style = document.createElement('style');
            style.setAttribute('data-critical-css', 'true');
            style.textContent = criticalCSS;
            document.head.insertBefore(style, document.head.firstChild);
            
            console.log('Critical CSS inlined');
        }
    }

    // Load non-critical CSS asynchronously
    loadNonCriticalCSS() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        cssLinks.forEach(link => {
            if (link.dataset.optimized) return;
            
            const href = link.href;
            const media = link.media || 'all';
            
            // Convert to preload
            link.rel = 'preload';
            link.as = 'style';
            link.media = 'print';
            
            // Switch to stylesheet after load
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
                this.media = media;
            };
            
            // Fallback for browsers without preload support
            const noscript = document.createElement('noscript');
            const fallbackLink = document.createElement('link');
            fallbackLink.rel = 'stylesheet';
            fallbackLink.href = href;
            fallbackLink.media = media;
            noscript.appendChild(fallbackLink);
            document.head.appendChild(noscript);
            
            link.dataset.optimized = 'true';
        });
    }

    // Minify inline CSS
    minifyInlineCSS() {
        const styleElements = document.querySelectorAll('style:not([data-critical-css])');
        
        styleElements.forEach(style => {
            if (style.dataset.minified) return;
            
            const originalCSS = style.textContent;
            const minifiedCSS = this.minifyCSS(originalCSS);
            
            if (minifiedCSS.length < originalCSS.length) {
                style.textContent = minifiedCSS;
                style.dataset.minified = 'true';
            }
        });
    }

    // Optimize JavaScript execution
    optimizeJavaScript() {
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Minify inline JavaScript
        this.minifyInlineJS();
        
        // Optimize script loading order
        this.optimizeScriptLoading();
    }

    // Defer non-critical JavaScript
    deferNonCriticalJS() {
        const scripts = document.querySelectorAll('script[src]:not([data-critical])');
        
        scripts.forEach(script => {
            if (!script.async && !script.defer && !script.dataset.critical) {
                script.defer = true;
            }
        });
    }

    // Minify inline JavaScript
    minifyInlineJS() {
        const scriptElements = document.querySelectorAll('script:not([src]):not([data-minified])');
        
        scriptElements.forEach(script => {
            const originalJS = script.textContent;
            const minifiedJS = this.minifyJS(originalJS);
            
            if (minifiedJS.length < originalJS.length) {
                script.textContent = minifiedJS;
                script.dataset.minified = 'true';
            }
        });
    }

    // Optimize script loading order
    optimizeScriptLoading() {
        // Mark critical scripts
        const criticalScripts = [
            'performance-optimizer.js',
            'performance-integration.js'
        ];
        
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const isCritical = criticalScripts.some(critical => 
                script.src.includes(critical)
            );
            
            if (isCritical) {
                script.dataset.critical = 'true';
                // Remove defer/async for critical scripts
                script.defer = false;
                script.async = false;
            }
        });
    }

    // Add resource preloading for critical assets
    preloadCriticalAssets() {
        const criticalAssets = [
            { href: 'assets/images/headshot.webp', as: 'image', type: 'image/webp' },
            { href: 'assets/images/headshot.jpg', as: 'image', type: 'image/jpeg' },
            { href: 'assets/styles/main.css', as: 'style' },
            { href: 'assets/scripts/main.js', as: 'script' }
        ];

        criticalAssets.forEach(asset => {
            // Check if already preloaded
            const existingLink = document.querySelector(`link[href="${asset.href}"][rel="preload"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = asset.href;
                link.as = asset.as;
                if (asset.type) {
                    link.type = asset.type;
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
            const existingLink = document.querySelector(`link[href="${domain}"][rel="preconnect"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });

        console.log(`Preloaded ${criticalAssets.length} critical assets`);
    }

    // Optimize external resources
    optimizeExternalResources() {
        // Add crossorigin to external stylesheets
        const externalCSS = document.querySelectorAll('link[rel="stylesheet"][href*="://"]');
        externalCSS.forEach(link => {
            if (!link.crossOrigin) {
                link.crossOrigin = 'anonymous';
            }
        });

        // Add crossorigin to external scripts
        const externalJS = document.querySelectorAll('script[src*="://"]');
        externalJS.forEach(script => {
            if (!script.crossOrigin) {
                script.crossOrigin = 'anonymous';
            }
        });
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor long tasks
        this.monitorLongTasks();
        
        console.log('Performance monitoring setup completed');
    }

    // Monitor Core Web Vitals
    monitorCoreWebVitals() {
        // First Contentful Paint (FCP)
        this.measureFCP();
        
        // Largest Contentful Paint (LCP)
        this.measureLCP();
        
        // First Input Delay (FID)
        this.measureFID();
        
        // Cumulative Layout Shift (CLS)
        this.measureCLS();
    }

    // Measure First Contentful Paint
    measureFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
                if (fcp) {
                    this.performanceMetrics.fcp = fcp.startTime;
                    console.log('FCP:', fcp.startTime.toFixed(2) + 'ms');
                    observer.disconnect();
                }
            });
            
            try {
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.log('FCP monitoring not supported');
            }
        }
    }

    // Measure Largest Contentful Paint
    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
            });
            
            try {
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP monitoring not supported');
            }
        }
    }

    // Measure First Input Delay
    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID:', this.performanceMetrics.fid.toFixed(2) + 'ms');
                });
            });
            
            try {
                observer.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID monitoring not supported');
            }
        }
    }

    // Measure Cumulative Layout Shift
    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
                console.log('CLS:', clsValue.toFixed(4));
            });
            
            try {
                observer.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('CLS monitoring not supported');
            }
        }
    }

    // Monitor resource loading
    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    const loadTime = entry.responseEnd - entry.startTime;
                    
                    // Log slow resources
                    if (loadTime > 1000) {
                        console.warn(`Slow resource: ${entry.name} (${loadTime.toFixed(2)}ms)`);
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.log('Resource monitoring not supported');
            }
        }
    }

    // Monitor long tasks
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
                    this.trackPerformanceIssue('long-task', {
                        duration: entry.duration,
                        startTime: entry.startTime
                    });
                });
            });
            
            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.log('Long task monitoring not supported');
            }
        }
    }

    // Setup performance dashboard for development
    setupPerformanceDashboard() {
        // Create performance dashboard UI
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
        `;
        
        // Update dashboard periodically
        setInterval(() => {
            this.updatePerformanceDashboard(dashboard);
        }, 1000);
        
        document.body.appendChild(dashboard);
        console.log('Performance dashboard created');
    }

    // Update performance dashboard
    updatePerformanceDashboard(dashboard) {
        const metrics = this.getPerformanceMetrics();
        
        dashboard.innerHTML = `
            <h4>Performance Metrics</h4>
            <div>FCP: ${metrics.fcp ? metrics.fcp.toFixed(2) + 'ms' : 'N/A'}</div>
            <div>LCP: ${metrics.lcp ? metrics.lcp.toFixed(2) + 'ms' : 'N/A'}</div>
            <div>FID: ${metrics.fid ? metrics.fid.toFixed(2) + 'ms' : 'N/A'}</div>
            <div>CLS: ${metrics.cls ? metrics.cls.toFixed(4) : 'N/A'}</div>
            <div>Memory: ${this.getMemoryUsage()}</div>
            <div>Images: ${this.getImageStats()}</div>
        `;
    }

    // Utility functions
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,>+~])\s*/g, '$1')
            .replace(/;}/g, '}')
            .trim();
    }

    minifyJS(js) {
        return js
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
            .trim();
    }

    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');
    }

    trackImageLoadPerformance(src, loadTime, success) {
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('image_load_performance', {
                src,
                loadTime,
                success,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackPerformanceIssue(type, data) {
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('performance_issue', {
                type,
                data,
                timestamp: new Date().toISOString()
            });
        }
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    getMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`;
        }
        return 'N/A';
    }

    getImageStats() {
        const total = document.querySelectorAll('img').length;
        const loaded = document.querySelectorAll('img.lazy-loaded').length;
        const errors = document.querySelectorAll('img.lazy-error').length;
        return `${loaded}/${total} (${errors} errors)`;
    }

    // Public API
    getStatus() {
        return {
            initialized: this.isInitialized,
            optimizers: Object.keys(this.optimizers),
            metrics: this.performanceMetrics,
            imageStats: this.getImageStats(),
            memoryUsage: this.getMemoryUsage()
        };
    }
}

// Initialize performance integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.performanceIntegration = new PerformanceIntegration();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceIntegration;
}