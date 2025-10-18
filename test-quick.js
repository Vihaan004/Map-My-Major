/**
 * Quick API Test Script
 * Tests basic functionality of the MapMyMajor API
 * Run with: node test-quick.js
 */

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`✅ PASS: ${name}`);
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${name}`);
    if (details) console.log(`   ${details}`);
  }
  results.tests.push({ name, passed, details });
}

async function runTests() {
  console.log('\n🧪 MapMyMajor API Quick Test Suite\n');
  console.log('=' .repeat(50));
  
  // Test 1: Server is running
  console.log('\n📡 Testing server connectivity...');
  const serverTest = await makeRequest('GET', '/');
  logTest('Server is running', serverTest.status > 0, 
    serverTest.status === 0 ? 'Server not reachable' : '');

  if (serverTest.status === 0) {
    console.log('\n❌ Cannot proceed - server is not running!');
    console.log('Please start the server with: npm run dev\n');
    return;
  }

  // Test 2: Unauthorized request returns 401
  console.log('\n🔒 Testing authentication...');
  const unauthorizedTest = await makeRequest('GET', '/api/maps');
  logTest('Unauthorized access blocked', 
    unauthorizedTest.status === 401,
    `Expected 401, got ${unauthorizedTest.status}`);

  console.log('\n⚠️  Note: Authenticated endpoint tests require login via browser');
  console.log('To test authenticated endpoints:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Sign in with Google');
  console.log('3. Use browser developer tools or Postman to test API\n');

  // Test 3: Create requirement without auth (should fail)
  console.log('\n📝 Testing validation...');
  const createTest = await makeRequest('POST', '/api/requirements', {
    tag: 'TEST',
    name: 'Test Requirement',
    type: 'CREDIT_HOURS'
  });
  logTest('Create without auth returns 401', 
    createTest.status === 401,
    `Expected 401, got ${createTest.status}`);

  // Test 4: Invalid data validation
  console.log('\n🔍 Testing data validation...');
  const invalidTest = await makeRequest('POST', '/api/requirements', {
    tag: 'TEST'
    // Missing required fields
  });
  logTest('Invalid data returns 400 or 401', 
    invalidTest.status === 400 || invalidTest.status === 401,
    `Expected 400/401, got ${invalidTest.status}`);

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`   Total Tests:  ${results.total}`);
  console.log(`   ✅ Passed:     ${results.passed}`);
  console.log(`   ❌ Failed:     ${results.failed}`);
  console.log(`   Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  if (results.failed === 0) {
    console.log('🎉 All basic tests passed!\n');
    console.log('Next steps:');
    console.log('1. Login via browser to get session');
    console.log('2. Run full test suite: ./test-api.sh');
    console.log('3. Or use the manual testing guide in dev/API_TESTING.md\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
});
