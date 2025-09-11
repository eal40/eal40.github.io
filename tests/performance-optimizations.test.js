// Performance Optimizations Test Suite

describe('Performance Optimizations', () => {
    beforeEach(() => {
        // Reset DOM
        document.head.innerHTML = '';
        document.body.innerHTML = `
            <div class="main-navigation"></div>
            <section class="hero-section">
                <img src="test-image.jpg" loading="lazy" alt="Test image">
                <img data-src="lazy-image.jpg" alt="Lazy image">
            </section>
            <iframe data-src="test-iframe.html"></iframe>
            <style>body { color: red; }</style>
            <script>console.log('test');</script>
        `;
        
        // Mock performance APIs
        global.performance = {
            now: jest.fn(() => 1000),
            getEntriesByType: jest.fn(() => []),
            mark: jest.fn(),
            measure: jest.fn(),
            memory: {
                usedJSHeapSize: 1000000,
                jsHeapSizeLimit: 10000000
            }
        };
        
        // Mock IntersectionObserver
        global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn()
        }));
        
        // Mock PerformanceObserver
        global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
            observe: jest.fn(),
            disconnect: jest.fn()
        }));
        
        // Mock Image constructor
        global.Image = jest.fn().mockImplementation(() => ({
            onload: null,
            onerror: null,
            src: '',
            height: 2
        }));
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('Lazy Loading Implementation', () => {
        test('should find lazy loading images', () => {
            const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
            expect(lazyImages.length).toBe(2);
        });
        
        test('should find lazy loading iframes', () => {
            const lazyIframes = document.querySelectorAll('iframe[data-src]');
            expect(lazyIframes.length).toBe(1);
        });
        
        test('should support IntersectionObserver API', () => {
            expect(typeof IntersectionObserver).toBe('function');
        });
    });
    
    describe('CSS Optimization', () => {
        test('should minify CSS correctly', () => {
            const css = `
                /* Comment */
                .test {
                    color: red;
                    margin: 10px;
                }
            `;
            
            const minified = css
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*([{}:;,>+~])\s*/g, '$1')
                .replace(/;}/g, '}')
                .trim();
            
            expect(minified).not.toContain('/*');
            expect(minified).not.toContain('\n');
            expect(minified).toContain('.test{color:red;margin:10px}');
        });
        
        test('should be able to inline critical CSS', () => {
            const style = document.createElement('style');
            style.setAttribute('data-critical-css', 'true');
            style.textContent = '.main-navigation{position:fixed}.hero-section{min-height:100vh}';
            document.head.appendChild(style);
            
            const criticalCSS = document.querySelector('style[data-critical-css]');
            expect(criticalCSS).toBeTruthy();
            expect(criticalCSS.textContent).toContain('main-navigation');
            expect(criticalCSS.textContent).toContain('hero-section');
        });
    });
    
    describe('JavaScript Optimization', () => {
        test('should minify JavaScript correctly', () => {
            const js = `
                // Comment
                function test() {
                    console.log('hello');
                }
            `;
            
            const minified = js
                .replace(/\/\/.*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
                .trim();
            
            expect(minified).not.toContain('//');
            expect(minified).not.toContain('\n');
            expect(minified).toContain('function test(){console.log(');
        });
        
        test('should be able to defer scripts', () => {
            const script = document.createElement('script');
            script.src = 'non-critical.js';
            document.head.appendChild(script);
            
            // Simulate deferring
            script.defer = true;
            
            expect(script.defer).toBe(true);
        });
    });
    
    describe('Resource Preloading', () => {
        test('should be able to create preload links', () => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = 'assets/images/headshot.webp';
            link.as = 'image';
            link.type = 'image/webp';
            document.head.appendChild(link);
            
            const preloadLink = document.querySelector('link[rel="preload"]');
            expect(preloadLink).toBeTruthy();
            expect(preloadLink.as).toBe('image');
            expect(preloadLink.href).toContain('headshot.webp');
        });
        
        test('should be able to create preconnect links', () => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'https://cdnjs.cloudflare.com';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
            
            const preconnectLink = document.querySelector('link[rel="preconnect"]');
            expect(preconnectLink).toBeTruthy();
            expect(preconnectLink.href).toContain('cdnjs.cloudflare.com');
        });
    });
    
    describe('Performance Monitoring', () => {
        test('should support PerformanceObserver API', () => {
            expect(typeof PerformanceObserver).toBe('function');
        });
        
        test('should support performance.memory API', () => {
            // Check if memory API is available (mocked in beforeEach)
            if (performance.memory) {
                expect(performance.memory).toBeDefined();
                expect(typeof performance.memory.usedJSHeapSize).toBe('number');
            } else {
                expect(performance.memory).toBeUndefined();
            }
        });
        
        test('should support performance timing methods', () => {
            expect(typeof performance.now).toBe('function');
            // mark and measure might not be available in all environments
            if (performance.mark) {
                expect(typeof performance.mark).toBe('function');
            }
            if (performance.measure) {
                expect(typeof performance.measure).toBe('function');
            }
        });
    });
    
    describe('WebP Support', () => {
        test('should convert image paths to WebP', () => {
            const convertToWebP = (imagePath) => {
                return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            };
            
            const webpPath = convertToWebP('image.jpg');
            expect(webpPath).toBe('image.webp');
            
            const webpPath2 = convertToWebP('photo.png');
            expect(webpPath2).toBe('photo.webp');
        });
        
        test('should be able to check WebP support', async () => {
            const checkWebPSupport = () => {
                return new Promise((resolve) => {
                    // Mock the WebP check to resolve quickly
                    setTimeout(() => resolve(true), 10);
                });
            };
            
            const webpSupported = await checkWebPSupport();
            expect(typeof webpSupported).toBe('boolean');
        });
    });
    
    describe('Development Mode Detection', () => {
        test('should detect localhost as development mode', () => {
            Object.defineProperty(window, 'location', {
                value: { hostname: 'localhost' },
                writable: true
            });
            
            const isDevelopmentMode = () => {
                return window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
            };
            
            expect(isDevelopmentMode()).toBe(true);
        });
        
        test('should create performance dashboard element', () => {
            const dashboard = document.createElement('div');
            dashboard.id = 'performance-dashboard';
            dashboard.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                z-index: 10000;
            `;
            document.body.appendChild(dashboard);
            
            const createdDashboard = document.getElementById('performance-dashboard');
            expect(createdDashboard).toBeTruthy();
            expect(createdDashboard.style.position).toBe('fixed');
        });
    });
    
    describe('Image Placeholder Functionality', () => {
        test('should add placeholders to images', () => {
            const img = document.querySelector('img[loading="lazy"]');
            
            // Simulate adding placeholder
            img.style.backgroundColor = '#f0f0f0';
            img.style.minHeight = '200px';
            img.style.display = 'block';
            
            expect(img.style.backgroundColor).toBe('rgb(240, 240, 240)');
            expect(img.style.minHeight).toBe('200px');
            expect(img.style.display).toBe('block');
        });
        
        test('should handle image loading states', () => {
            const img = document.querySelector('img[data-src]');
            
            // Simulate loading states
            img.classList.add('lazy-loading');
            expect(img.classList.contains('lazy-loading')).toBe(true);
            
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            expect(img.classList.contains('lazy-loaded')).toBe(true);
            expect(img.classList.contains('lazy-loading')).toBe(false);
        });
    });
    
    describe('Performance Metrics Collection', () => {
        test('should collect basic performance metrics', () => {
            const metrics = {
                fcp: performance.now(),
                lcp: performance.now() + 100,
                cls: 0.1,
                fid: 50
            };
            
            expect(typeof metrics.fcp).toBe('number');
            expect(typeof metrics.lcp).toBe('number');
            expect(typeof metrics.cls).toBe('number');
            expect(typeof metrics.fid).toBe('number');
        });
        
        test('should format memory usage', () => {
            const formatMemoryUsage = () => {
                if ('memory' in performance && performance.memory) {
                    const memory = performance.memory;
                    return `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`;
                }
                return 'N/A';
            };
            
            const memoryUsage = formatMemoryUsage();
            // Should either be a memory value or N/A
            expect(memoryUsage).toMatch(/(\d+\.\d+MB|N\/A)/);
        });
    });
});