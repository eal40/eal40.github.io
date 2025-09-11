// Comprehensive Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.setupCoreWebVitalsMonitoring();
        this.setupResourceMonitoring();
        this.setupUserInteractionMonitoring();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
        this.schedulePeriodicReports();
        console.log('Performance monitoring initialized');
    }

    // Monitor Core Web Vitals
    setupCoreWebVitalsMonitoring() {
        // First Contentful Paint
        this.observePaintTiming();
        
        // Largest Contentful Paint
        this.observeLCP();
        
        // Cumulative Layout Shift
        this.observeCLS();
        
        // First Input Delay
        this.observeFID();
        
        // Time to Interactive (estimated)
        this.estimateTTI();
    }

    // Observe paint timing
    observePaintTiming() {
        const paintObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.metrics[entry.name] = {
                    value: entry.startTime,
                    timestamp: new Date().toISOString(),
                    rating: this.getRating(entry.name, entry.startTime)
                };
            });
        });
        
        try {
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(paintObserver);
        } catch (e) {
            console.warn('Paint timing not supported');
        }
    }

    // Observe Largest Contentful Paint
    observeLCP() {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.metrics.lcp = {
                value: lastEntry.startTime,
                element: lastEntry.element?.tagName || 'unknown',
                timestamp: new Date().toISOString(),
                rating: this.getRating('lcp', lastEntry.startTime)
            };
        });
        
        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);
        } catch (e) {
            console.warn('LCP monitoring not supported');
        }
    }

    // Observe Cumulative Layout Shift
    observeCLS() {
        let clsValue = 0;
        
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            
            this.metrics.cls = {
                value: clsValue,
                timestamp: new Date().toISOString(),
                rating: this.getRating('cls', clsValue)
            };
        });
        
        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);
        } catch (e) {
            console.warn('CLS monitoring not supported');
        }
    }

    // Observe First Input Delay
    observeFID() {
        const fidObserver = new PerformanceObserver((list) => {
            const firstEntry = list.getEntries()[0];
            const fid = firstEntry.processingStart - firstEntry.startTime;
            
            this.metrics.fid = {
                value: fid,
                timestamp: new Date().toISOString(),
                rating: this.getRating('fid', fid)
            };
        });
        
        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);
        } catch (e) {
            console.warn('FID monitoring not supported');
        }
    }

    // Estimate Time to Interactive
    estimateTTI() {
        window.addEventListener('load', () => {
            // Simple TTI estimation based on when main thread becomes idle
            setTimeout(() => {
                const tti = performance.now();
                this.metrics.tti = {
                    value: tti,
                    timestamp: new Date().toISOString(),
                    rating: this.getRating('tti', tti),
                    estimated: true
                };
            }, 100);
        });
    }

    // Monitor resource loading
    setupResourceMonitoring() {
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.trackResourceLoad(entry);
            });
        });
        
        try {
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.push(resourceObserver);
        } catch (e) {
            console.warn('Resource monitoring not supported');
        }
    }

    // Track individual resource loads
    trackResourceLoad(entry) {
        const resourceType = this.getResourceType(entry);
        
        if (!this.metrics.resources) {
            this.metrics.resources = {
                total: 0,
                byType: {},
                totalSize: 0,
                totalDuration: 0,
                slowResources: []
            };
        }
        
        this.metrics.resources.total++;
        this.metrics.resources.byType[resourceType] = 
            (this.metrics.resources.byType[resourceType] || 0) + 1;
        this.metrics.resources.totalSize += entry.transferSize || 0;
        this.metrics.resources.totalDuration += entry.duration;
        
        // Track slow resources (>1s)
        if (entry.duration > 1000) {
            this.metrics.resources.slowResources.push({
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize,
                type: resourceType
            });
        }
    }

    // Get resource type from entry
    getResourceType(entry) {
        if (entry.initiatorType) return entry.initiatorType;
        
        const url = entry.name;
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'script';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'img';
        if (url.includes('.woff') || url.includes('.ttf')) return 'font';
        
        return 'other';
    }

    // Monitor user interactions
    setupUserInteractionMonitoring() {
        let interactionCount = 0;
        let totalInteractionDelay = 0;
        
        const interactionEvents = ['click', 'keydown', 'touchstart'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = performance.now();
                
                // Measure interaction delay
                requestAnimationFrame(() => {
                    const delay = performance.now() - startTime;
                    interactionCount++;
                    totalInteractionDelay += delay;
                    
                    this.metrics.interactions = {
                        count: interactionCount,
                        averageDelay: totalInteractionDelay / interactionCount,
                        lastInteraction: {
                            type: eventType,
                            delay: delay,
                            timestamp: new Date().toISOString()
                        }
                    };
                });
            }, { passive: true });
        });
    }

    // Monitor memory usage
    setupMemoryMonitoring() {
        if (!('memory' in performance)) {
            console.warn('Memory monitoring not supported');
            return;
        }
        
        const updateMemoryMetrics = () => {
            const memory = performance.memory;
            this.metrics.memory = {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2),
                timestamp: new Date().toISOString()
            };
            
            // Warn if memory usage is high
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected:', this.metrics.memory);
                this.reportPerformanceIssue('high-memory-usage', this.metrics.memory);
            }
        };
        
        // Update memory metrics every 30 seconds
        setInterval(updateMemoryMetrics, 30000);
        updateMemoryMetrics(); // Initial measurement
    }

    // Monitor network conditions
    setupNetworkMonitoring() {
        if (!('connection' in navigator)) {
            console.warn('Network monitoring not supported');
            return;
        }
        
        const updateNetworkMetrics = () => {
            const connection = navigator.connection;
            this.metrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                timestamp: new Date().toISOString()
            };
        };
        
        // Update on connection change
        navigator.connection.addEventListener('change', updateNetworkMetrics);
        updateNetworkMetrics(); // Initial measurement
    }

    // Get performance rating for metrics
    getRating(metric, value) {
        const thresholds = {
            'first-paint': { good: 1000, poor: 3000 },
            'first-contentful-paint': { good: 1800, poor: 3000 },
            'lcp': { good: 2500, poor: 4000 },
            'fid': { good: 100, poor: 300 },
            'cls': { good: 0.1, poor: 0.25 },
            'tti': { good: 3800, poor: 7300 }
        };
        
        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    // Schedule periodic performance reports
    schedulePeriodicReports() {
        // Report every 60 seconds
        setInterval(() => {
            this.generatePerformanceReport();
        }, 60000);
        
        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateFinalReport();
        });
    }

    // Generate performance report
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            sessionDuration: performance.now() - this.startTime,
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics,
            issues: this.identifyPerformanceIssues()
        };
        
        console.log('Performance Report:', report);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_report', {
                custom_parameter: JSON.stringify(report)
            });
        }
        
        return report;
    }

    // Generate final report on page unload
    generateFinalReport() {
        const finalReport = this.generatePerformanceReport();
        finalReport.type = 'final';
        
        // Use sendBeacon for reliable delivery
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(finalReport)], {
                type: 'application/json'
            });
            navigator.sendBeacon('/api/performance', blob);
        }
    }

    // Identify performance issues
    identifyPerformanceIssues() {
        const issues = [];
        
        // Check Core Web Vitals
        Object.entries(this.metrics).forEach(([key, metric]) => {
            if (metric.rating === 'poor') {
                issues.push({
                    type: 'poor-core-web-vital',
                    metric: key,
                    value: metric.value,
                    threshold: 'poor'
                });
            }
        });
        
        // Check for slow resources
        if (this.metrics.resources?.slowResources?.length > 0) {
            issues.push({
                type: 'slow-resources',
                count: this.metrics.resources.slowResources.length,
                resources: this.metrics.resources.slowResources
            });
        }
        
        // Check memory usage
        if (this.metrics.memory?.usagePercentage > 80) {
            issues.push({
                type: 'high-memory-usage',
                percentage: this.metrics.memory.usagePercentage
            });
        }
        
        // Check interaction delays
        if (this.metrics.interactions?.averageDelay > 50) {
            issues.push({
                type: 'slow-interactions',
                averageDelay: this.metrics.interactions.averageDelay
            });
        }
        
        return issues;
    }

    // Report performance issue
    reportPerformanceIssue(type, data) {
        console.warn(`Performance Issue: ${type}`, data);
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_issue', {
                issue_type: type,
                issue_data: JSON.stringify(data)
            });
        }
    }

    // Get current performance status
    getPerformanceStatus() {
        return {
            metrics: this.metrics,
            issues: this.identifyPerformanceIssues(),
            sessionDuration: performance.now() - this.startTime,
            timestamp: new Date().toISOString()
        };
    }

    // Export performance data
    exportPerformanceData() {
        const data = this.generatePerformanceReport();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Cleanup observers
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
    }
}

// Initialize performance monitor
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.performanceMonitor) {
        window.performanceMonitor.cleanup();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}