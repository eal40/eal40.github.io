// Performance Dashboard for Development
class PerformanceDashboard {
    constructor() {
        this.isVisible = false;
        this.dashboard = null;
        this.metrics = {};
        this.init();
    }

    init() {
        // Only initialize in development mode
        if (this.isDevelopmentMode()) {
            this.createDashboard();
            this.setupKeyboardShortcut();
            this.startMetricsCollection();
            console.log('Performance dashboard initialized (Press Ctrl+Shift+P to toggle)');
        }
    }

    // Check if we're in development mode
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');
    }

    // Create dashboard UI
    createDashboard() {
        this.dashboard = document.createElement('div');
        this.dashboard.id = 'performance-dashboard';
        this.dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>Performance Dashboard</h3>
                <button class="dashboard-close" onclick="window.performanceDashboard.toggle()">×</button>
            </div>
            <div class="dashboard-content">
                <div class="metrics-section">
                    <h4>Core Web Vitals</h4>
                    <div class="metric-item">
                        <span class="metric-label">First Contentful Paint:</span>
                        <span class="metric-value" id="fcp-value">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Largest Contentful Paint:</span>
                        <span class="metric-value" id="lcp-value">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Cumulative Layout Shift:</span>
                        <span class="metric-value" id="cls-value">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">First Input Delay:</span>
                        <span class="metric-value" id="fid-value">Waiting...</span>
                    </div>
                </div>
                
                <div class="resources-section">
                    <h4>Resource Loading</h4>
                    <div class="metric-item">
                        <span class="metric-label">Total Resources:</span>
                        <span class="metric-value" id="total-resources">0</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">CSS Files:</span>
                        <span class="metric-value" id="css-resources">0</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">JS Files:</span>
                        <span class="metric-value" id="js-resources">0</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Images:</span>
                        <span class="metric-value" id="image-resources">0</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Total Size:</span>
                        <span class="metric-value" id="total-size">0 KB</span>
                    </div>
                </div>
                
                <div class="memory-section">
                    <h4>Memory Usage</h4>
                    <div class="metric-item">
                        <span class="metric-label">Used JS Heap:</span>
                        <span class="metric-value" id="used-heap">N/A</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Total JS Heap:</span>
                        <span class="metric-value" id="total-heap">N/A</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Heap Limit:</span>
                        <span class="metric-value" id="heap-limit">N/A</span>
                    </div>
                </div>
                
                <div class="actions-section">
                    <h4>Actions</h4>
                    <button onclick="window.performanceDashboard.refreshMetrics()">Refresh Metrics</button>
                    <button onclick="window.performanceDashboard.exportMetrics()">Export Data</button>
                    <button onclick="window.performanceDashboard.clearCache()">Clear Cache</button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #performance-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                max-height: 80vh;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                display: none;
                overflow-y: auto;
            }
            
            .dashboard-header {
                background: #f8f9fa;
                padding: 15px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }
            
            .dashboard-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
            
            .dashboard-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .dashboard-content {
                padding: 15px;
            }
            
            .dashboard-content h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #555;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
            }
            
            .metric-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .metric-label {
                color: #666;
            }
            
            .metric-value {
                font-weight: 600;
                color: #333;
            }
            
            .metric-value.good {
                color: #28a745;
            }
            
            .metric-value.needs-improvement {
                color: #ffc107;
            }
            
            .metric-value.poor {
                color: #dc3545;
            }
            
            .actions-section {
                margin-top: 15px;
            }
            
            .actions-section button {
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin: 2px;
                font-size: 12px;
            }
            
            .actions-section button:hover {
                background: #0056b3;
            }
            
            .resources-section,
            .memory-section {
                margin-top: 15px;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(this.dashboard);
    }

    // Setup keyboard shortcut
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    // Toggle dashboard visibility
    toggle() {
        this.isVisible = !this.isVisible;
        this.dashboard.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.refreshMetrics();
        }
    }

    // Start collecting metrics
    startMetricsCollection() {
        // Collect initial metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectCoreWebVitals();
                this.collectResourceMetrics();
                this.collectMemoryMetrics();
            }, 1000);
        });

        // Update metrics periodically
        setInterval(() => {
            if (this.isVisible) {
                this.collectResourceMetrics();
                this.collectMemoryMetrics();
            }
        }, 5000);
    }

    // Collect Core Web Vitals
    collectCoreWebVitals() {
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
            this.updateMetric('fcp-value', `${fcp.startTime.toFixed(2)}ms`, this.getPerformanceRating(fcp.startTime, 1800, 3000));
        }

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    this.updateMetric('lcp-value', `${lastEntry.startTime.toFixed(2)}ms`, this.getPerformanceRating(lastEntry.startTime, 2500, 4000));
                }
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                this.updateMetric('lcp-value', 'Not supported', 'neutral');
            }
        }

        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.updateMetric('cls-value', clsValue.toFixed(4), this.getPerformanceRating(clsValue, 0.1, 0.25));
            });
            
            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                this.updateMetric('cls-value', 'Not supported', 'neutral');
            }
        }

        // First Input Delay
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list) => {
                const firstEntry = list.getEntries()[0];
                if (firstEntry) {
                    const fid = firstEntry.processingStart - firstEntry.startTime;
                    this.updateMetric('fid-value', `${fid.toFixed(2)}ms`, this.getPerformanceRating(fid, 100, 300));
                }
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                this.updateMetric('fid-value', 'Not supported', 'neutral');
            }
        }
    }

    // Collect resource metrics
    collectResourceMetrics() {
        const resources = performance.getEntriesByType('resource');
        
        const cssResources = resources.filter(r => r.name.includes('.css') || r.initiatorType === 'css');
        const jsResources = resources.filter(r => r.name.includes('.js') || r.initiatorType === 'script');
        const imageResources = resources.filter(r => r.initiatorType === 'img');
        
        const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        
        this.updateMetric('total-resources', resources.length);
        this.updateMetric('css-resources', cssResources.length);
        this.updateMetric('js-resources', jsResources.length);
        this.updateMetric('image-resources', imageResources.length);
        this.updateMetric('total-size', `${(totalSize / 1024).toFixed(2)} KB`);
    }

    // Collect memory metrics
    collectMemoryMetrics() {
        if ('memory' in performance) {
            const memory = performance.memory;
            this.updateMetric('used-heap', `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
            this.updateMetric('total-heap', `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
            this.updateMetric('heap-limit', `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
        }
    }

    // Update metric display
    updateMetric(elementId, value, rating = 'neutral') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
            element.className = `metric-value ${rating}`;
        }
    }

    // Get performance rating
    getPerformanceRating(value, goodThreshold, poorThreshold) {
        if (value <= goodThreshold) return 'good';
        if (value <= poorThreshold) return 'needs-improvement';
        return 'poor';
    }

    // Refresh all metrics
    refreshMetrics() {
        this.collectCoreWebVitals();
        this.collectResourceMetrics();
        this.collectMemoryMetrics();
        console.log('Performance metrics refreshed');
    }

    // Export metrics to JSON
    exportMetrics() {
        const metrics = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            coreWebVitals: this.getCoreWebVitals(),
            resources: this.getResourceMetrics(),
            memory: this.getMemoryMetrics(),
            connection: this.getConnectionInfo()
        };
        
        const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('Performance metrics exported');
    }

    // Get Core Web Vitals data
    getCoreWebVitals() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        return {
            firstContentfulPaint: fcp ? fcp.startTime : null,
            // LCP and CLS would be collected from observers
            // FID would be collected from first-input observer
        };
    }

    // Get resource metrics data
    getResourceMetrics() {
        const resources = performance.getEntriesByType('resource');
        return {
            total: resources.length,
            css: resources.filter(r => r.name.includes('.css')).length,
            js: resources.filter(r => r.name.includes('.js')).length,
            images: resources.filter(r => r.initiatorType === 'img').length,
            totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
        };
    }

    // Get memory metrics data
    getMemoryMetrics() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // Get connection info
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

    // Clear browser cache (limited to what's possible)
    clearCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
                console.log('Cache cleared');
                alert('Cache cleared successfully');
            });
        } else {
            alert('Cache clearing not supported in this browser');
        }
    }
}

// Initialize performance dashboard in development mode
document.addEventListener('DOMContentLoaded', () => {
    window.performanceDashboard = new PerformanceDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceDashboard;
}