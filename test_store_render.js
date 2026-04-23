// Test script to check Store component imports and basic functionality
// Run with: node test_store_render.js

console.log('🧪 Testing Store Component Imports...\n');

try {
  // Test imports
  console.log('📦 Testing imports...');

  // This would normally be done in a browser environment
  // For now, just check if the files exist and can be read
  const fs = await import('fs');
  const path = await import('path');

  const storePath = './src/pages/Customer/Store.jsx';
  const paymentModalPath = './src/components/PaymentModal.jsx';

  if (fs.existsSync(storePath)) {
    console.log('✅ Store.jsx file exists');
    const storeContent = fs.readFileSync(storePath, 'utf8');
    console.log(`✅ Store.jsx has ${storeContent.length} characters`);
  } else {
    console.error('❌ Store.jsx file not found');
  }

  if (fs.existsSync(paymentModalPath)) {
    console.log('✅ PaymentModal.jsx file exists');
    const modalContent = fs.readFileSync(paymentModalPath, 'utf8');
    console.log(`✅ PaymentModal.jsx has ${modalContent.length} characters`);
  } else {
    console.error('❌ PaymentModal.jsx file not found');
  }

  // Check for common issues
  console.log('\n🔍 Checking for common issues...');

  // Check if Store.jsx imports PaymentModal correctly
  const storeContent = fs.readFileSync(storePath, 'utf8');
  if (storeContent.includes("import PaymentModal from '../../components/PaymentModal'")) {
    console.log('✅ PaymentModal import found in Store.jsx');
  } else {
    console.error('❌ PaymentModal import not found in Store.jsx');
  }

  // Check if Store.jsx has products array
  if (storeContent.includes('const products = [')) {
    console.log('✅ Products array found in Store.jsx');
  } else {
    console.log('⚠️  Products array not found in Store.jsx');
  }

  // Check if PaymentModal has required props
  const modalContent = fs.readFileSync(paymentModalPath, 'utf8');
  if (modalContent.includes('const PaymentModal = ({ product, customerName, customerPhone, onConfirm, onCancel, isLoading })')) {
    console.log('✅ PaymentModal props signature correct');
  } else {
    console.error('❌ PaymentModal props signature incorrect');
  }

  console.log('\n🎉 Store component import test completed!');

} catch (error) {
  console.error('❌ Error during testing:', error);
}