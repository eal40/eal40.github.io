// Unit tests for PerformanceMonitor class
const PerformanceMonitor = require('../assets/scripts/performance-monitor.js');

describe('PerformanceMonitor', () => {
  let performanceMonitor;
  let mockPerformanceEntries;

  beforeEach(() => {
    // Reset performance mocks
    mockPerformanceEntries = {
      paint: [
        { name: 'first-paint', startTime: 500 },
        { name: 'first-contentful-paint', startTime: 800 }
      ],
      'largest-contentful-paint': [
        { startTime: 1200, element: { tagName: 'IMG' } }
      ],
      'layout-shift': [
        { value: 0.05, hadRecentInput: false },
        { value: 0.03, hadRecentInput: false }
      ],
      'first-input': [
        { startTime: 1000, processingStart: 1050 }
      ],
      resource: [
        {
          name: 'https://example.com/style.css',
          initiatorType: 'css',
          duration: 200,
          transferSize: 5000
        },
        {
          name: 'https://example.com/script.js',
          initiatorType: 'script',
          duration: 1500,
          transferSize: 10000
        },
        {
          name: 'https://example.com/image.jpg',
          initiatorType: 'img',
          duration: 800,
          transferSize: 50000
        }
      ]
    };

    // Mock PerformanceObserver
    global.PerformanceObserver = jest.fn().mockImplementation((callback) => {
      return {
        observe: jest.fn((options) => {
          const entryType = options.entryTypes[0];
          if (mockPerformanceEntries[entryType]) {
            // Simulate observer callback
            setTimeout(() => {
              callback({
                getEntries: () => mockPerformanceEntries[entryType]
              });
            }, 10);
          }
        }),
        disconnect: jest.fn()
      };
    });

    // Mock performance.now()
    let mockTime = 0;
    global.performance.now = jest.fn(() => {
      mockTime += 100;
      return mockTime;
    });

    // Reset gtag mock
    global.gtag = jest.fn();

    performanceMonitor = new PerformanceMonitor();
  });

  afterEach(() => {
    if (performanceMonitor && performanceMonitor.cleanup) {
      performanceMonitor.cleanup();
    }
  });

  describe('Initialization', () => {
    test('should initialize performance monitoring', () => {
      expect(performanceMonitor.metrics).toBeDefined();
      expect(performanceMonitor.observers).toBeDefined();
      expect(performanceMonitor.startTime).toBeDefined();
    });

    test('should set up performance observers', () => {
      expect(global.PerformanceObserver).toHaveBeenCalledTimes(5); // paint, LCP, CLS, FID, resource
    });
  });

  describe('Core Web Vitals Monitoring', () => {
    test('should observe paint timing metrics', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics['first-paint']).toBeDefined();
        expect(performanceMonitor.metrics['first-paint'].value).toBe(500);
        expect(performanceMonitor.metrics['first-paint'].rating).toBe('good');
        
        expect(performanceMonitor.metrics['first-contentful-paint']).toBeDefined();
        expect(performanceMonitor.metrics['first-contentful-paint'].value).toBe(800);
        expect(performanceMonitor.metrics['first-contentful-paint'].rating).toBe('good');
        done();
      }, 50);
    });

    test('should observe Largest Contentful Paint', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics.lcp).toBeDefined();
        expect(performanceMonitor.metrics.lcp.value).toBe(1200);
        expect(performanceMonitor.metrics.lcp.element).toBe('IMG');
        expect(performanceMonitor.metrics.lcp.rating).toBe('good');
        done();
      }, 50);
    });

    test('should observe Cumulative Layout Shift', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics.cls).toBeDefined();
        expect(performanceMonitor.metrics.cls.value).toBe(0.08); // 0.05 + 0.03
        expect(performanceMonitor.metrics.cls.rating).toBe('good');
        done();
      }, 50);
    });

    test('should observe First Input Delay', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics.fid).toBeDefined();
        expect(performanceMonitor.metrics.fid.value).toBe(50); // 1050 - 1000
        expect(performanceMonitor.metrics.fid.rating).toBe('good');
        done();
      }, 50);
    });

    test('should estimate Time to Interactive', (done) => {
      // Simulate window load event
      const loadEvent = createMockEvent('load');
      window.dispatchEvent(loadEvent);

      setTimeout(() => {
        expect(performanceMonitor.metrics.tti).toBeDefined();
        expect(performanceMonitor.metrics.tti.estimated).toBe(true);
        done();
      }, 150);
    });
  });

  describe('Performance Rating System', () => {
    test('should rate metrics correctly', () => {
      expect(performanceMonitor.getRating('first-paint', 800)).toBe('good');
      expect(performanceMonitor.getRating('first-paint', 2000)).toBe('needs-improvement');
      expect(performanceMonitor.getRating('first-paint', 4000)).toBe('poor');
      
      expect(performanceMonitor.getRating('lcp', 2000)).toBe('good');
      expect(performanceMonitor.getRating('lcp', 3000)).toBe('needs-improvement');
      expect(performanceMonitor.getRating('lcp', 5000)).toBe('poor');
      
      expect(performanceMonitor.getRating('cls', 0.05)).toBe('good');
      expect(performanceMonitor.getRating('cls', 0.15)).toBe('needs-improvement');
      expect(performanceMonitor.getRating('cls', 0.3)).toBe('poor');
      
      expect(performanceMonitor.getRating('fid', 50)).toBe('good');
      expect(performanceMonitor.getRating('fid', 200)).toBe('needs-improvement');
      expect(performanceMonitor.getRating('fid', 400)).toBe('poor');
    });

    test('should return unknown for unrecognized metrics', () => {
      expect(performanceMonitor.getRating('unknown-metric', 100)).toBe('unknown');
    });
  });

  describe('Resource Monitoring', () => {
    test('should track resource loading', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics.resources).toBeDefined();
        expect(performanceMonitor.metrics.resources.total).toBe(3);
        expect(performanceMonitor.metrics.resources.byType.css).toBe(1);
        expect(performanceMonitor.metrics.resources.byType.script).toBe(1);
        expect(performanceMonitor.metrics.resources.byType.img).toBe(1);
        expect(performanceMonitor.metrics.resources.totalSize).toBe(65000);
        done();
      }, 50);
    });

    test('should identify slow resources', (done) => {
      setTimeout(() => {
        expect(performanceMonitor.metrics.resources.slowResources).toBeDefined();
        expect(performanceMonitor.metrics.resources.slowResources.length).toBe(1);
        expect(performanceMonitor.metrics.resources.slowResources[0].name).toBe('https://example.com/script.js');
        expect(performanceMonitor.metrics.resources.slowResources[0].duration).toBe(1500);
        done();
      }, 50);
    });

    test('should categorize resource types correctly', () => {
      const cssEntry = { name: 'style.css', initiatorType: 'css' };
      expect(performanceMonitor.getResourceType(cssEntry)).toBe('css');
      
      const jsEntry = { name: 'script.js' };
      expect(performanceMonitor.getResourceType(jsEntry)).toBe('script');
      
      const imgEntry = { name: 'image.jpg' };
      expect(performanceMonitor.getResourceType(imgEntry)).toBe('img');
      
      const fontEntry = { name: 'font.woff' };
      expect(performanceMonitor.getResourceType(fontEntry)).toBe('font');
      
      const unknownEntry = { name: 'unknown.xyz' };
      expect(performanceMonitor.getResourceType(unknownEntry)).toBe('other');
    });
  });

  describe('User Interaction Monitoring', () => {
    test('should track interaction delays', () => {
      const clickEvent = createMockEvent('click');
      document.dispatchEvent(clickEvent);

      // Wait for requestAnimationFrame
      setTimeout(() => {
        expect(performanceMonitor.metrics.interactions).toBeDefined();
        expect(performanceMonitor.metrics.interactions.count).toBe(1);
        expect(performanceMonitor.metrics.interactions.averageDelay).toBeGreaterThan(0);
        expect(performanceMonitor.metrics.interactions.lastInteraction.type).toBe('click');
      }, 50);
    });

    test('should track multiple interaction types', () => {
      const clickEvent = createMockEvent('click');
      const keyEvent = createMockEvent('keydown');
      const touchEvent = createMockEvent('touchstart');

      document.dispatchEvent(clickEvent);
      document.dispatchEvent(keyEvent);
      document.dispatchEvent(touchEvent);

      setTimeout(() => {
        expect(performanceMonitor.metrics.interactions.count).toBe(3);
      }, 50);
    });
  });

  describe('Memory Monitoring', () => {
    test('should track memory usage', () => {
      // Memory monitoring should be initialized
      expect(performanceMonitor.metrics.memory).toBeDefined();
      expect(performanceMonitor.metrics.memory.usedJSHeapSize).toBe(1000000);
      expect(performanceMonitor.metrics.memory.totalJSHeapSize).toBe(2000000);
      expect(performanceMonitor.metrics.memory.jsHeapSizeLimit).toBe(4000000);
      expect(performanceMonitor.metrics.memory.usagePercentage).toBe('25.00');
    });

    test('should warn about high memory usage', () => {
      // Mock high memory usage
      global.performance.memory = {
        usedJSHeapSize: 3800000,
        totalJSHeapSize: 4000000,
        jsHeapSizeLimit: 4000000
      };

      const reportSpy = jest.spyOn(performanceMonitor, 'reportPerformanceIssue');
      
      // Trigger memory update
      performanceMonitor.setupMemoryMonitoring();

      setTimeout(() => {
        expect(reportSpy).toHaveBeenCalledWith('high-memory-usage', expect.any(Object));
      }, 100);
    });
  });

  describe('Network Monitoring', () => {
    test('should track network conditions', () => {
      expect(performanceMonitor.metrics.network).toBeDefined();
      expect(performanceMonitor.metrics.network.effectiveType).toBe('4g');
      expect(performanceMonitor.metrics.network.downlink).toBe(10);
      expect(performanceMonitor.metrics.network.rtt).toBe(50);
      expect(performanceMonitor.metrics.network.saveData).toBe(false);
    });

    test('should update network metrics on connection change', () => {
      // Mock connection change
      navigator.connection.effectiveType = '3g';
      navigator.connection.downlink = 5;

      const changeEvent = createMockEvent('change');
      navigator.connection.dispatchEvent(changeEvent);

      expect(performanceMonitor.metrics.network.effectiveType).toBe('3g');
      expect(performanceMonitor.metrics.network.downlink).toBe(5);
    });
  });

  describe('Performance Issue Detection', () => {
    test('should identify poor Core Web Vitals', () => {
      // Set poor metrics
      performanceMonitor.metrics.lcp = { value: 5000, rating: 'poor' };
      performanceMonitor.metrics.fid = { value: 400, rating: 'poor' };

      const issues = performanceMonitor.identifyPerformanceIssues();
      
      expect(issues.length).toBe(2);
      expect(issues[0].type).toBe('poor-core-web-vital');
      expect(issues[0].metric).toBe('lcp');
      expect(issues[1].type).toBe('poor-core-web-vital');
      expect(issues[1].metric).toBe('fid');
    });

    test('should identify slow resources', () => {
      performanceMonitor.metrics.resources = {
        slowResources: [
          { name: 'slow-script.js', duration: 2000 },
          { name: 'slow-image.jpg', duration: 1500 }
        ]
      };

      const issues = performanceMonitor.identifyPerformanceIssues();
      
      expect(issues.some(issue => issue.type === 'slow-resources')).toBe(true);
      const slowResourceIssue = issues.find(issue => issue.type === 'slow-resources');
      expect(slowResourceIssue.count).toBe(2);
    });

    test('should identify high memory usage', () => {
      performanceMonitor.metrics.memory = { usagePercentage: 85 };

      const issues = performanceMonitor.identifyPerformanceIssues();
      
      expect(issues.some(issue => issue.type === 'high-memory-usage')).toBe(true);
    });

    test('should identify slow interactions', () => {
      performanceMonitor.metrics.interactions = { averageDelay: 75 };

      const issues = performanceMonitor.identifyPerformanceIssues();
      
      expect(issues.some(issue => issue.type === 'slow-interactions')).toBe(true);
    });
  });

  describe('Performance Reporting', () => {
    test('should generate performance report', () => {
      const report = performanceMonitor.generatePerformanceReport();
      
      expect(report.timestamp).toBeDefined();
      expect(report.sessionDuration).toBeGreaterThan(0);
      expect(report.url).toBe(window.location.href);
      expect(report.userAgent).toBe(navigator.userAgent);
      expect(report.metrics).toBeDefined();
      expect(report.issues).toBeDefined();
    });

    test('should send report to analytics', () => {
      performanceMonitor.generatePerformanceReport();
      
      expect(global.gtag).toHaveBeenCalledWith('event', 'performance_report', {
        custom_parameter: expect.any(String)
      });
    });

    test('should generate final report on page unload', () => {
      const sendBeaconSpy = jest.spyOn(navigator, 'sendBeacon');
      
      performanceMonitor.generateFinalReport();
      
      expect(sendBeaconSpy).toHaveBeenCalledWith('/api/performance', expect.any(Blob));
    });
  });

  describe('Performance Status', () => {
    test('should get current performance status', () => {
      const status = performanceMonitor.getPerformanceStatus();
      
      expect(status.metrics).toBeDefined();
      expect(status.issues).toBeDefined();
      expect(status.sessionDuration).toBeGreaterThan(0);
      expect(status.timestamp).toBeDefined();
    });
  });

  describe('Data Export', () => {
    test('should export performance data', () => {
      // Mock URL.createObjectURL and revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();
      
      // Mock createElement and click
      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      
      performanceMonitor.exportPerformanceData();
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    test('should cleanup observers', () => {
      const disconnectSpy = jest.fn();
      performanceMonitor.observers = [
        { disconnect: disconnectSpy },
        { disconnect: disconnectSpy }
      ];
      
      performanceMonitor.cleanup();
      
      expect(disconnectSpy).toHaveBeenCalledTimes(2);
      expect(performanceMonitor.observers.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle PerformanceObserver not supported', () => {
      global.PerformanceObserver = undefined;
      
      expect(() => {
        new PerformanceMonitor();
      }).not.toThrow();
    });

    test('should handle memory API not supported', () => {
      delete global.performance.memory;
      
      expect(() => {
        performanceMonitor.setupMemoryMonitoring();
      }).not.toThrow();
    });

    test('should handle connection API not supported', () => {
      delete navigator.connection;
      
      expect(() => {
        performanceMonitor.setupNetworkMonitoring();
      }).not.toThrow();
    });
  });
});