// Test script for store purchase functionality
// Run with: node test_store_purchase.js

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
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testStorePurchase() {
  console.log('🧪 Testing Store Purchase Functionality...\n');

  try {
    // Test data - simulate a product purchase
    const testOrder = {
      customer_name: 'Khách hàng văng lai',
      customer_phone: '',
      order_type: 'product',
      item_id: 1,
      item_name: 'Serum Vitamin C',
      quantity: 1,
      total_price: 550000,
      reward_points: 5000,
      payment_method: 'bank_transfer',
      payment_proof: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // dummy base64
      status: 'pending_payment',
      order_date: new Date().toISOString().split('T')[0],
      notes: 'Đơn hàng từ cửa hàng - Chờ xác nhận thanh toán',
      created_at: new Date().toISOString()
    };

    console.log('📦 Creating test order...');
    const { data, error } = await supabase
      .from('online_orders')
      .insert([testOrder])
      .select();

    if (error) {
      console.error('❌ Failed to create order:', error);
      return;
    }

    const orderId = data[0].id;
    console.log('✅ Order created successfully with ID:', orderId);
    console.log('📋 Order details:', {
      item_name: data[0].item_name,
      total_price: data[0].total_price,
      status: data[0].status,
      payment_method: data[0].payment_method
    });

    // Test fetching orders
    console.log('\n📥 Fetching orders...');
    const { data: orders, error: fetchError } = await supabase
      .from('online_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (fetchError) {
      console.error('❌ Failed to fetch orders:', fetchError);
      return;
    }

    console.log('✅ Recent orders:');
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.item_name} - ${order.total_price}đ - ${order.status}`);
    });

    // Clean up test data
    console.log('\n🗑️  Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('online_orders')
      .delete()
      .eq('id', orderId);

    if (deleteError) {
      console.error('❌ Failed to clean up:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }

    console.log('\n🎉 Store purchase functionality works correctly!');

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run test
testStorePurchase();