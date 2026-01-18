// Quick verification script to check all imports are valid
// This doesn't start the server, just verifies imports work

const path = require('path');

console.log('Verifying backend imports...\n');

try {
  // Set up environment
  process.env.NODE_ENV = 'development';
  process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.JWT_SECRET = 'test-secret';
  
  // Try importing main server file (this will fail if imports are broken)
  require('ts-node/register');
  require('./src/server.ts');
  
  console.log('✅ All imports verified successfully!');
  console.log('✅ TypeScript compilation passed');
  console.log('✅ No import errors detected');
  console.log('\nNote: Server will not actually start (this is just import verification)');
  console.log('To start the server, use: npm run dev or docker compose up');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Import verification failed:');
  console.error(error.message);
  process.exit(1);
}
