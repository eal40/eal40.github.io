// Simple script to run e2e tests
const { spawn } = require('child_process');
const path = require('path');

console.log('E2E Test Runner');
console.log('===============');
console.log('');
console.log('To run end-to-end tests:');
console.log('1. Start the development server: npm start');
console.log('2. In another terminal, run: npx cypress run');
console.log('   Or for interactive mode: npx cypress open');
console.log('');
console.log('The tests will run against http://localhost:3000');
console.log('');
console.log('Available test files:');
console.log('- cypress/e2e/basic-functionality.cy.js (Basic functionality tests)');
console.log('- cypress/e2e/portfolio.cy.js (Comprehensive portfolio tests)');
console.log('');

// Check if server is running
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 1000
};

const req = http.request(options, (res) => {
  console.log('✓ Development server is running on http://localhost:3000');
  console.log('You can now run: npx cypress run');
});

req.on('error', (err) => {
  console.log('✗ Development server is not running');
  console.log('Please start it first with: npm start');
});

req.on('timeout', () => {
  console.log('✗ Development server is not responding');
  console.log('Please start it first with: npm start');
});

req.end();