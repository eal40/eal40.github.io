module.exports = {
  ci: {
    collect: {
      // Collect performance data from the built site
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html'
      ],
      numberOfRuns: 3
    },
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['warn', {minScore: 0.85}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:best-practices': ['warn', {minScore: 0.90}],
        'categories:seo': ['warn', {minScore: 0.85}],
        'categories:pwa': ['warn', {minScore: 0.50}],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['warn', {maxNumericValue: 0.1}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
        
        // Accessibility specific
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'valid-lang': 'error',
        
        // Performance specific
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        
        // Best practices
        'is-on-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error'
      }
    },
    upload: {
      // Upload results to temporary storage for CI
      target: 'temporary-public-storage'
    },
    server: {
      // Configuration for local server during testing
      port: 9001,
      storage: './lhci-data'
    }
  }
};