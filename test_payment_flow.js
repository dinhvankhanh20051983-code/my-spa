// Test script for payment functionality
// Run with: node test_payment_flow.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envFile = readFileSync(join(__dirname, '.env'), 'utf8');
const env = {};
envFile.split(/\r?\n/).forEach(line => {
  const [key, ...rest] = line.split('=');
  if (!key) return;
  env[key.trim()] = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
});

// Initialize Supabase client
const supabaseUrl = env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Flow...\n');

  // Test data
  const testOrder = {
    customer_name: 'Test Customer',
    customer_phone: '0905123456',
    order_type: 'product',
    item_id: 1,
    item_name: 'Serum Vitamin C',
    quantity: 1,
    total_price: 550000,
    reward_points: 5000,
    payment_method: 'bank_transfer',
    payment_proof: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Fake base64 image
    status: 'pending_payment',
    order_date: new Date().toISOString().split('T')[0],
    notes: 'Test payment order',
    created_at: new Date().toISOString()
  };

  try {
    console.log('📤 Inserting test order...');
    const { data, error } = await supabase
      .from('online_orders')
      .insert([testOrder])
      .select();

    if (error) {
      console.error('❌ Supabase insert failed:', error);
      return;
    }

    console.log('✅ Order inserted successfully:', data[0]);

    // Test fetch
    console.log('\n📥 Fetching order...');
    const { data: fetchedOrder, error: fetchError } = await supabase
      .from('online_orders')
      .select('*')
      .eq('id', data[0].id)
      .single();

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError);
      return;
    }

    console.log('✅ Order fetched successfully:');
    console.log('   - ID:', fetchedOrder.id);
    console.log('   - Customer:', fetchedOrder.customer_name);
    console.log('   - Product:', fetchedOrder.item_name);
    console.log('   - Payment Method:', fetchedOrder.payment_method);
    console.log('   - Status:', fetchedOrder.status);
    console.log('   - Has Payment Proof:', !!fetchedOrder.payment_proof);

    // Test update status
    console.log('\n📝 Updating status to confirmed...');
    const { error: updateError } = await supabase
      .from('online_orders')
      .update({ status: 'confirmed' })
      .eq('id', data[0].id);

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return;
    }

    console.log('✅ Status updated to confirmed');

    // Cleanup - delete test order
    console.log('\n🗑️  Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('online_orders')
      .delete()
      .eq('id', data[0].id);

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError);
      return;
    }

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All payment flow tests passed!');

  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run test
testPaymentFlow();
