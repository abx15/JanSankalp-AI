// Force create session and test
console.log('🔧 Testing admin login manually...');

// Test in browser console:
// 1. Go to http://localhost:3000/auth/signin
// 2. Enter: admin@jansankalp.ai / admin123
// 3. Check Network tab for POST /api/auth/callback/credentials
// 4. Should return 302 redirect to dashboard

// If login fails, try these steps:
console.log('🔧 Debug Steps:');
console.log('1. Clear browser cookies and cache');
console.log('2. Restart dev server: npm run dev');
console.log('3. Check .env file for AUTH_SECRET');
console.log('4. Try incognito window');

// Quick test command:
console.log('Run: node scripts/debug-session.js');
