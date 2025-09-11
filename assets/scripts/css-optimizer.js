// CSS Optimization Utilities
class CSSOptimizer {
    constructor() {
        this.criticalCSS = '';
        this.nonCriticalCSS = '';
        this.init();
    }

    init() {
        this.identifyCriticalCSS();
        this.optimizeCSS();
        console.log('CSS optimizer initialized');
    }

    // Identify critical CSS (above-the-fold styles)
    identifyCriticalCSS() {
        // Critical selectors that should be inlined
        const criticalSelectors = [
            // Base styles
            '*', 'html', 'body',
            
            // Navigation (always visible)
            '.main-navigation', '.nav-container', '.nav-brand', '.brand-link',
            '.nav-menu', '.mobile-menu-toggle',
            
            // Hero section (above the fold)
            '.hero-section', '.hero-container', '.hero-content',
            '.hero-image', '.hero-text', '.hero-actions',
            
            // Typography
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p',
            
            // Buttons
            '.btn', '.btn-primary', '.btn-secondary',
            
            // Accessibility
            '.skip-link', '.sr-only',
            
            // Loading states
            '.loading', '.lazy-loading'
        ];

        // Extract critical CSS rules
        this.criticalCSS = this.extractCSSRules(criticalSelectors);
    }

    // Extract CSS rules for specific selectors
    extractCSSRules(selectors) {
        let criticalRules = '';
        
        // Get all stylesheets
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(stylesheet => {
            try {
                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                
                rules.forEach(rule => {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        const selectorText = rule.selectorText;
                        
                        // Check if this rule matches any critical selector
                        const isCritical = selectors.some(selector => {
                            return selectorText.includes(selector) || 
                                   this.matchesSelector(selectorText, selector);
                        });
                        
                        if (isCritical) {
                            criticalRules += rule.cssText + '\n';
                        }
                    }
                });
            } catch (e) {
                // Cross-origin stylesheets may not be accessible
                console.warn('Cannot access stylesheet rules:', e);
            }
        });
        
        return criticalRules;
    }

    // Check if selector matches critical pattern
    matchesSelector(selectorText, pattern) {
        // Simple pattern matching
        if (pattern.startsWith('.')) {
            return selectorText.includes(pattern);
        }
        if (pattern.startsWith('#')) {
            return selectorText.includes(pattern);
        }
        // Element selector
        return selectorText.includes(pattern);
    }

    // Optimize CSS delivery
    optimizeCSS() {
        // Inline critical CSS
        if (this.criticalCSS.length > 0 && this.criticalCSS.length < 14000) {
            this.inlineCriticalCSS();
        }
        
        // Load non-critical CSS asynchronously
        this.loadNonCriticalCSS();
        
        // Remove unused CSS (basic implementation)
        this.removeUnusedCSS();
    }

    // Inline critical CSS
    inlineCriticalCSS() {
        // Check if critical CSS is already inlined
        if (document.querySelector('style[data-critical-css]')) {
            return;
        }

        const style = document.createElement('style');
        style.setAttribute('data-critical-css', 'true');
        style.textContent = this.minifyCSS(this.criticalCSS);
        
        // Insert at the beginning of head
        const firstLink = document.querySelector('link[rel="stylesheet"]');
        if (firstLink) {
            document.head.insertBefore(style, firstLink);
        } else {
            document.head.appendChild(style);
        }
        
        console.log('Critical CSS inlined:', style.textContent.length, 'characters');
    }

    // Load non-critical CSS asynchronously
    loadNonCriticalCSS() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        cssLinks.forEach(link => {
            // Skip if already optimized
            if (link.dataset.optimized) return;
            
            const href = link.href;
            const media = link.media || 'all';
            
            // Change to preload
            link.rel = 'preload';
            link.as = 'style';
            link.media = 'print'; // Prevent render blocking
            
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

    // Remove unused CSS (basic implementation)
    removeUnusedCSS() {
        // This is a simplified version - in production, use tools like PurgeCSS
        const usedSelectors = new Set();
        
        // Collect all used classes and IDs
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            // Add classes
            if (el.className) {
                const classes = el.className.split(' ');
                classes.forEach(cls => {
                    if (cls.trim()) {
                        usedSelectors.add('.' + cls.trim());
                    }
                });
            }
            
            // Add ID
            if (el.id) {
                usedSelectors.add('#' + el.id);
            }
            
            // Add tag name
            usedSelectors.add(el.tagName.toLowerCase());
        });
        
        console.log('Used selectors detected:', usedSelectors.size);
        
        // In a real implementation, you would remove unused rules here
        // For now, just log the information
        this.logUnusedCSSStats(usedSelectors);
    }

    // Log unused CSS statistics
    logUnusedCSSStats(usedSelectors) {
        let totalRules = 0;
        let usedRules = 0;
        
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(stylesheet => {
            try {
                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                
                rules.forEach(rule => {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        totalRules++;
                        
                        const selectorText = rule.selectorText;
                        const selectors = selectorText.split(',').map(s => s.trim());
                        
                        const isUsed = selectors.some(selector => {
                            // Simple check - in production, use more sophisticated matching
                            return Array.from(usedSelectors).some(used => 
                                selector.includes(used) || used.includes(selector)
                            );
                        });
                        
                        if (isUsed) {
                            usedRules++;
                        }
                    }
                });
            } catch (e) {
                // Ignore cross-origin stylesheets
            }
        });
        
        const unusedPercentage = totalRules > 0 ? 
            ((totalRules - usedRules) / totalRules * 100).toFixed(2) : 0;
        
        console.log(`CSS Usage: ${usedRules}/${totalRules} rules used (${unusedPercentage}% unused)`);
    }

    // Minify CSS (basic implementation)
    minifyCSS(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around special characters
            .replace(/\s*([{}:;,>+~])\s*/g, '$1')
            // Remove trailing semicolons
            .replace(/;}/g, '}')
            // Remove leading/trailing whitespace
            .trim();
    }

    // Get CSS optimization statistics
    getOptimizationStats() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
        const inlinedCSS = document.querySelectorAll('style[data-critical-css]');
        
        return {
            totalStylesheets: stylesheets.length,
            inlinedCriticalCSS: inlinedCSS.length > 0,
            criticalCSSSize: this.criticalCSS.length,
            optimizedLinks: document.querySelectorAll('link[data-optimized]').length
        };
    }

    // Force CSS optimization (for manual triggering)
    forceOptimization() {
        this.identifyCriticalCSS();
        this.optimizeCSS();
        console.log('CSS optimization forced');
    }
}

// Initialize CSS optimizer
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all stylesheets are loaded
    setTimeout(() => {
        window.cssOptimizer = new CSSOptimizer();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSSOptimizer;
}