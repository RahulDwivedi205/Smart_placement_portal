#!/usr/bin/env node

const https = require('https');

const BACKEND_URL = 'https://backend1-smart-placement-portal.vercel.app';

// Test function
async function testEndpoint(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'backend1-smart-placement-portal.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing CampusConnect Pro Backend Deployment\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await testEndpoint('GET', '/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data)}\n`);

    // Test 2: Root Endpoint
    console.log('2️⃣ Testing Root Endpoint...');
    const root = await testEndpoint('GET', '/');
    console.log(`   Status: ${root.status}`);
    console.log(`   Response: ${JSON.stringify(root.data)}\n`);

    // Test 3: Registration
    console.log('3️⃣ Testing Registration...');
    const register = await testEndpoint('POST', '/auth/register', {
      email: 'testuser@example.com',
      password: '12345678',
      role: 'student'
    });
    console.log(`   Status: ${register.status}`);
    console.log(`   Response: ${JSON.stringify(register.data)}\n`);

    // Test 4: Login
    console.log('4️⃣ Testing Login...');
    const login = await testEndpoint('POST', '/auth/login', {
      email: 'test@test.com',
      password: '12345678'
    });
    console.log(`   Status: ${login.status}`);
    console.log(`   Response: ${JSON.stringify(login.data)}\n`);

    // Summary
    console.log('📊 Test Summary:');
    console.log(`   Health Check: ${health.data.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Root Endpoint: ${root.data.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Registration: ${register.data.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Login: ${login.data.success ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();