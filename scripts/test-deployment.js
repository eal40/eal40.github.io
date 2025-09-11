#!/usr/bin/env node

/**
 * Deployment Testing Script
 * Tests the deployed portfolio website for functionality and performance
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class DeploymentTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log(`🚀 Testing deployment at: ${this.baseUrl}\n`);

    await this.testBasicConnectivity();
    await this.testHTTPS();
    await this.testMainPage();
    await this.testAssets();
    await this.testNavigation();
    await this.testDownloads();
    await this.testResponsiveness();
    await this.testSEO();

    this.printResults();
    return this.results.failed === 0;
  }

  async testBasicConnectivity() {
    console.log('📡 Testing basic connectivity...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      if (response.statusCode === 200) {
        this.pass('Site is accessible');
      } else {
        this.fail(`Site returned status code: ${response.statusCode}`);
      }
    } catch (error) {
      this.fail(`Site is not accessible: ${error.message}`);
    }
  }

  async testHTTPS() {
    console.log('🔒 Testing HTTPS configuration...');
    
    if (this.baseUrl.startsWith('https://')) {
      try {
        const response = await this.makeRequest(this.baseUrl);
        this.pass('HTTPS is working');
        
        // Test HTTP redirect
        const httpUrl = this.baseUrl.replace('https://', 'http://');
        try {
          const httpResponse = await this.makeRequest(httpUrl);
          if (httpResponse.statusCode >= 300 && httpResponse.statusCode < 400) {
            this.pass('HTTP redirects to HTTPS');
          } else {
            this.warn('HTTP does not redirect to HTTPS');
          }
        } catch (error) {
          this.warn('Could not test HTTP redirect');
        }
      } catch (error) {
        this.fail(`HTTPS connection failed: ${error.message}`);
      }
    } else {
      this.warn('Site is not using HTTPS');
    }
  }

  async testMainPage() {
    console.log('📄 Testing main page content...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;
      
      // Test for essential elements
      if (html.includes('<h1')) {
        this.pass('Main heading (H1) found');
      } else {
        this.fail('Main heading (H1) not found');
      }
      
      if (html.includes('nav') || html.includes('navigation')) {
        this.pass('Navigation found');
      } else {
        this.fail('Navigation not found');
      }
      
      if (html.includes('viewport')) {
        this.pass('Viewport meta tag found');
      } else {
        this.fail('Viewport meta tag missing');
      }
      
      if (html.includes('description')) {
        this.pass('Meta description found');
      } else {
        this.warn('Meta description missing');
      }
      
    } catch (error) {
      this.fail(`Could not test main page: ${error.message}`);
    }
  }

  async testAssets() {
    console.log('🎨 Testing static assets...');
    
    const assets = [
      '/assets/styles/main.css',
      '/assets/scripts/main.js',
      '/favicon.ico'
    ];
    
    for (const asset of assets) {
      try {
        const url = new URL(asset, this.baseUrl).toString();
        const response = await this.makeRequest(url);
        
        if (response.statusCode === 200) {
          this.pass(`Asset loaded: ${asset}`);
        } else {
          this.warn(`Asset not found: ${asset} (${response.statusCode})`);
        }
      } catch (error) {
        this.warn(`Could not load asset: ${asset}`);
      }
    }
  }

  async testNavigation() {
    console.log('🧭 Testing navigation...');
    
    const sections = ['#about', '#projects', '#skills', '#contact'];
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;
      
      for (const section of sections) {
        const sectionId = section.substring(1);
        if (html.includes(`id="${sectionId}"`) || html.includes(`id='${sectionId}'`)) {
          this.pass(`Section found: ${section}`);
        } else {
          this.warn(`Section not found: ${section}`);
        }
      }
    } catch (error) {
      this.fail(`Could not test navigation: ${error.message}`);
    }
  }

  async testDownloads() {
    console.log('📥 Testing download links...');
    
    const downloads = [
      '/assets/documents/resume.pdf',
      '/assets/installers/'
    ];
    
    for (const download of downloads) {
      try {
        const url = new URL(download, this.baseUrl).toString();
        const response = await this.makeRequest(url, 'HEAD');
        
        if (response.statusCode === 200) {
          this.pass(`Download available: ${download}`);
        } else {
          this.warn(`Download not found: ${download}`);
        }
      } catch (error) {
        this.warn(`Could not test download: ${download}`);
      }
    }
  }

  async testResponsiveness() {
    console.log('📱 Testing responsive design...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;
      
      if (html.includes('viewport') && html.includes('width=device-width')) {
        this.pass('Responsive viewport configured');
      } else {
        this.fail('Responsive viewport not configured');
      }
      
      if (html.includes('@media') || html.includes('responsive')) {
        this.pass('Responsive CSS detected');
      } else {
        this.warn('Responsive CSS not detected in HTML');
      }
      
    } catch (error) {
      this.warn(`Could not test responsiveness: ${error.message}`);
    }
  }

  async testSEO() {
    console.log('🔍 Testing SEO elements...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;
      
      // Test for SEO elements
      const seoElements = [
        { name: 'Title tag', pattern: /<title[^>]*>.*<\/title>/i },
        { name: 'Meta description', pattern: /<meta[^>]*name=["']description["'][^>]*>/i },
        { name: 'Open Graph title', pattern: /<meta[^>]*property=["']og:title["'][^>]*>/i },
        { name: 'Canonical URL', pattern: /<link[^>]*rel=["']canonical["'][^>]*>/i }
      ];
      
      for (const element of seoElements) {
        if (element.pattern.test(html)) {
          this.pass(`${element.name} found`);
        } else {
          this.warn(`${element.name} missing`);
        }
      }
      
    } catch (error) {
      this.warn(`Could not test SEO elements: ${error.message}`);
    }
  }

  async makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: method,
        timeout: 10000,
        headers: {
          'User-Agent': 'Portfolio-Deployment-Tester/1.0'
        }
      };
      
      const req = client.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  pass(message) {
    console.log(`  ✅ ${message}`);
    this.results.passed++;
    this.results.tests.push({ status: 'PASS', message });
  }

  fail(message) {
    console.log(`  ❌ ${message}`);
    this.results.failed++;
    this.results.tests.push({ status: 'FAIL', message });
  }

  warn(message) {
    console.log(`  ⚠️  ${message}`);
    this.results.warnings++;
    this.results.tests.push({ status: 'WARN', message });
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📝 Total Tests: ${this.results.tests.length}`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All critical tests passed! Deployment looks good.');
    } else {
      console.log('\n🚨 Some tests failed. Please review the issues above.');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'https://eal40.github.io';
  
  console.log('Portfolio Deployment Tester');
  console.log('===========================\n');
  
  const tester = new DeploymentTester(baseUrl);
  const success = await tester.runAllTests();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DeploymentTester;