module.exports = {
  ci: {
    collect: {
      // Test local development server
      url: [
        'http://localhost:3000'
      ],
      numberOfRuns: 1,
      settings: {
        // Disable certain audits that don't apply to local development
        skipAudits: [
          'is-on-https',
          'uses-http2',
          'canonical'
        ]
      }
    },
    assert: {
      // More lenient thresholds for local development
      assertions: {
        'categories:performance': ['warn', {minScore: 0.7}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.7}],
        
        // Core Web Vitals - more lenient for local
        'first-contentful-paint': ['warn', {maxNumericValue: 3000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 4000}],
        'cumulative-layout-shift': ['warn', {maxNumericValue: 0.15}],
        
        // Accessibility - strict
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'valid-lang': 'error'
      }
    },
    server: {
      port: 9002,
      storage: './lhci-data-local'
    }
  }
};