// Script to start development server for Cypress tests
const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting development server...');
    
    const server = spawn('npx', ['live-server', '--port=3000', '--no-browser'], {
      cwd: path.resolve(__dirname, '../..'),
      stdio: 'pipe'
    });

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('Serving') || output.includes('3000')) {
        console.log('Server started successfully on port 3000');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Server startup timeout'));
    }, 30000);
  });
}

if (require.main === module) {
  startServer().catch(console.error);
}

module.exports = { startServer };