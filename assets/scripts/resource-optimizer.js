// Resource Optimization Utility
class ResourceOptimizer {
    constructor() {
        this.cssCache = new Map();
        this.jsCache = new Map();
        this.init();
    }

    init() {
        console.log('Resource optimizer initialized');
        this.optimizeInlineStyles();
        this.optimizeInlineScripts();
        this.setupResourceMonitoring();
    }

    // Optimize inline CSS
    optimizeInlineStyles() {
        const styleElements = document.querySelectorAll('style');
        
        styleElements.forEach(style => {
            if (style.dataset.optimized) return;
            
            const originalCSS = style.textContent;
            const minifiedCSS = this.minifyCSS(originalCSS);
            
            if (minifiedCSS.length < originalCSS.length) {
                style.textContent = minifiedCSS;
                style.dataset.optimized = 'true';
                
                console.log(`CSS minified: ${originalCSS.length} -> ${minifiedCSS.length} bytes`);
            }
        });
    }

    // Optimize inline JavaScript
    optimizeInlineScripts() {
        const scriptElements = document.querySelectorAll('script:not([src])');
        
        scriptElements.forEach(script => {
            if (script.dataset.optimized) return;
            
            const originalJS = script.textContent;
            const minifiedJS = this.minifyJS(originalJS);
            
            if (minifiedJS.length < originalJS.length) {
                script.textContent = minifiedJS;
                script.dataset.optimized = 'true';
                
                console.log(`JS minified: ${originalJS.length} -> ${minifiedJS.length} bytes`);
            }
        });
    }

    // Basic CSS minification
    minifyCSS(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around specific characters
            .replace(/\s*([{}:;,>+~])\s*/g, '$1')
            // Remove trailing semicolons
            .replace(/;}/g, '}')
            // Remove leading/trailing whitespace
            .trim();
    }

    // Basic JavaScript minification
    minifyJS(js) {
        return js
            // Remove single-line comments (basic)
            .replace(/\/\/.*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace (basic)
            .replace(/\s+/g, ' ')
            // Remove whitespace around operators and punctuation
            .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
            // Remove leading/trailing whitespace
            .trim();
    }

    // Setup resource monitoring
    setupResourceMonitoring() {
        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.initiatorType === 'css' || entry.initiatorType === 'script') {
                        this.analyzeResourcePerformance(entry);
                    }
                });
            });
            
            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.log('Resource monitoring not supported');
            }
        }

        // Monitor bundle sizes
        this.monitorBundleSizes();
    }

    // Analyze resource performance
    analyzeResourcePerformance(entry) {
        const loadTime = entry.responseEnd - entry.startTime;
        const size = entry.transferSize || entry.encodedBodySize || 0;
        
        // Log slow resources
        if (loadTime > 1000) {
            console.warn(`Slow resource detected: ${entry.name} (${loadTime.toFixed(2)}ms, ${size} bytes)`);
        }
        
        // Track resource metrics
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('resource_performance', {
                name: entry.name,
                type: entry.initiatorType,
                loadTime: loadTime,
                size: size,
                cached: entry.transferSize === 0
            });
        }
    }

    // Monitor bundle sizes
    monitorBundleSizes() {
        const resources = performance.getEntriesByType('resource');
        let totalCSS = 0;
        let totalJS = 0;
        
        resources.forEach(resource => {
            const size = resource.transferSize || resource.encodedBodySize || 0;
            
            if (resource.name.includes('.css')) {
                totalCSS += size;
            } else if (resource.name.includes('.js')) {
                totalJS += size;
            }
        });
        
        console.log(`Total CSS size: ${(totalCSS / 1024).toFixed(2)} KB`);
        console.log(`Total JS size: ${(totalJS / 1024).toFixed(2)} KB`);
        
        // Warn about large bundles
        if (totalCSS > 100 * 1024) { // 100KB
            console.warn('Large CSS bundle detected:', (totalCSS / 1024).toFixed(2) + ' KB');
        }
        
        if (totalJS > 200 * 1024) { // 200KB
            console.warn('Large JS bundle detected:', (totalJS / 1024).toFixed(2) + ' KB');
        }
    }

    // Optimize external resources
    optimizeExternalResources() {
        // Add loading optimizations to external resources
        const externalLinks = document.querySelectorAll('link[href*="://"]');
        
        externalLinks.forEach(link => {
            if (!link.crossOrigin && link.href.includes('cdnjs')) {
                link.crossOrigin = 'anonymous';
            }
            
            // Add importance hints
            if (link.rel === 'stylesheet' && link.href.includes('font-awesome')) {
                link.importance = 'low';
            }
        });
    }

    // Create resource loading strategy
    createLoadingStrategy() {
        const strategy = {
            critical: [
                'assets/styles/main.css',
                'assets/scripts/performance-optimizer.js'
            ],
            important: [
                'assets/scripts/main.js',
                'assets/scripts/image-optimization.js'
            ],
            deferred: [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ]
        };
        
        return strategy;
    }

    // Implement resource hints
    implementResourceHints() {
        const strategy = this.createLoadingStrategy();
        
        // Preload critical resources
        strategy.critical.forEach(resource => {
            if (!document.querySelector(`link[href="${resource}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource;
                link.as = resource.includes('.css') ? 'style' : 'script';
                document.head.appendChild(link);
            }
        });
        
        // Prefetch important resources
        strategy.important.forEach(resource => {
            if (!document.querySelector(`link[href="${resource}"]`)) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = resource;
                document.head.appendChild(link);
            }
        });
    }

    // Optimize font loading
    optimizeFontLoading() {
        // Add font-display: swap to external fonts
        const fontLinks = document.querySelectorAll('link[href*="fonts"]');
        
        fontLinks.forEach(link => {
            if (!link.dataset.optimized) {
                // Create optimized font loading
                const style = document.createElement('style');
                style.textContent = `
                    @font-face {
                        font-family: 'FontAwesome';
                        font-display: swap;
                        src: url('${link.href}');
                    }
                `;
                document.head.appendChild(style);
                link.dataset.optimized = 'true';
            }
        });
    }

    // Get optimization report
    getOptimizationReport() {
        const resources = performance.getEntriesByType('resource');
        const report = {
            totalResources: resources.length,
            cssResources: resources.filter(r => r.name.includes('.css')).length,
            jsResources: resources.filter(r => r.name.includes('.js')).length,
            imageResources: resources.filter(r => r.initiatorType === 'img').length,
            cachedResources: resources.filter(r => r.transferSize === 0).length,
            totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            averageLoadTime: resources.reduce((sum, r) => sum + (r.responseEnd - r.startTime), 0) / resources.length
        };
        
        console.log('Resource Optimization Report:', report);
        return report;
    }

    // Implement critical resource loading
    loadCriticalResources() {
        return new Promise((resolve) => {
            const criticalResources = [
                'assets/styles/main.css',
                'assets/scripts/performance-optimizer.js'
            ];
            
            let loadedCount = 0;
            const totalCount = criticalResources.length;
            
            const checkComplete = () => {
                loadedCount++;
                if (loadedCount >= totalCount) {
                    resolve();
                }
            };
            
            criticalResources.forEach(resource => {
                if (resource.includes('.css')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = resource;
                    link.onload = checkComplete;
                    link.onerror = checkComplete;
                    document.head.appendChild(link);
                } else if (resource.includes('.js')) {
                    const script = document.createElement('script');
                    script.src = resource;
                    script.onload = checkComplete;
                    script.onerror = checkComplete;
                    document.head.appendChild(script);
                }
            });
        });
    }

    // Clean up unused resources
    cleanupUnusedResources() {
        // Remove unused stylesheets (basic detection)
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        stylesheets.forEach(stylesheet => {
            // Check if stylesheet is actually used
            try {
                const rules = stylesheet.sheet?.cssRules || [];
                let hasUsedRules = false;
                
                for (let rule of rules) {
                    if (rule.selectorText && document.querySelector(rule.selectorText)) {
                        hasUsedRules = true;
                        break;
                    }
                }
                
                if (!hasUsedRules && rules.length > 0) {
                    console.log('Potentially unused stylesheet:', stylesheet.href);
                }
            } catch (e) {
                // Cross-origin stylesheets can't be accessed
                console.log('Cannot analyze cross-origin stylesheet:', stylesheet.href);
            }
        });
    }
}

// Initialize resource optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.resourceOptimizer = new ResourceOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResourceOptimizer;
}