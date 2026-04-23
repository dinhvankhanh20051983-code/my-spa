// Test script for navigation to store
// Run with: node test_navigation.js

console.log('🧪 Testing Navigation to Store...\n');

try {
  // Check if routes are properly configured
  const fs = await import('fs');

  const appPath = './src/App.jsx';
  const appContent = fs.readFileSync(appPath, 'utf8');

  console.log('🔍 Checking App.jsx routing configuration...');

  // Check if all roles have Routes wrapper
  if (appContent.includes('<Routes>') && appContent.includes('<Route path="/customer/store"')) {
    console.log('✅ Routes configuration found');
  } else {
    console.error('❌ Routes configuration incomplete');
  }

  // Check if Store component is imported
  if (appContent.includes("import Store from './pages/Customer/Store'")) {
    console.log('✅ Store component import found');
  } else {
    console.error('❌ Store component import not found');
  }

  // Check if navigation path matches route
  const customerDashboardPath = './src/pages/Customer/CustomerDashboard.jsx';
  const dashboardContent = fs.readFileSync(customerDashboardPath, 'utf8');

  if (dashboardContent.includes("navigate('/customer/store')")) {
    console.log('✅ Navigation path matches route');
  } else {
    console.error('❌ Navigation path mismatch');
  }

  // Check for common navigation issues
  console.log('\n🔍 Checking for common navigation issues...');

  // Check if useNavigate is imported
  if (dashboardContent.includes("import { useNavigate } from 'react-router-dom'")) {
    console.log('✅ useNavigate hook imported');
  } else {
    console.error('❌ useNavigate hook not imported');
  }

  // Check if Store component uses useNavigate
  const storeContent = fs.readFileSync('./src/pages/Customer/Store.jsx', 'utf8');
  if (storeContent.includes("import { useNavigate } from 'react-router-dom'")) {
    console.log('✅ Store component imports useNavigate');
  } else {
    console.log('ℹ️  Store component does not use navigation (expected)');
  }

  console.log('\n🎉 Navigation test completed!');

} catch (error) {
  console.error('❌ Error during navigation testing:', error);
}