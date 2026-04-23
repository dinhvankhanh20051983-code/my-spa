// Test script for PaymentModal conditional rendering
// Run with: node test_payment_modal.js

console.log('🧪 Testing PaymentModal Conditional Rendering...\n');

try {
  const fs = await import('fs');

  const modalPath = './src/components/PaymentModal.jsx';
  const modalContent = fs.readFileSync(modalPath, 'utf8');

  console.log('🔍 Checking PaymentModal conditional rendering...');

  // Check if conditional rendering is added
  if (modalContent.includes('if (!product) return null;')) {
    console.log('✅ Conditional rendering found - modal only renders when product exists');
  } else {
    console.error('❌ Conditional rendering not found');
  }

  // Check if the return statement is in the right place
  const returnIndex = modalContent.indexOf('return (');
  const conditionalIndex = modalContent.indexOf('if (!product) return null;');

  if (conditionalIndex < returnIndex && conditionalIndex > 0) {
    console.log('✅ Conditional check is before main return statement');
  } else {
    console.error('❌ Conditional check position incorrect');
  }

  // Check Store component usage
  const storePath = './src/pages/Customer/Store.jsx';
  const storeContent = fs.readFileSync(storePath, 'utf8');

  if (storeContent.includes('<PaymentModal')) {
    console.log('✅ PaymentModal is used in Store component');
  } else {
    console.error('❌ PaymentModal not found in Store component');
  }

  // Check if showPaymentModal state is used properly
  if (storeContent.includes('showPaymentModal') && storeContent.includes('setShowPaymentModal')) {
    console.log('✅ showPaymentModal state management found');
  } else {
    console.error('❌ showPaymentModal state management missing');
  }

  console.log('\n🎉 PaymentModal conditional rendering test completed!');

} catch (error) {
  console.error('❌ Error during testing:', error);
}