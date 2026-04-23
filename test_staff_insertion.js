// Test script for staff insertion
// Run with: node test_staff_insertion.js

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

// Mock camelToSnake function (matching the app's logic)
function camelToSnake(obj) {
  // Special mapping for staff fields that are lowercase in DB
  const fieldMapping = {
    baseSalary: 'basesalary',
    serviceComm: 'servicecomm',
    consultComm: 'consultcomm'
  };
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (fieldMapping[key]) {
      // Use the mapped lowercase field name
      result[fieldMapping[key]] = value;
    } else {
      // Convert other fields to snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = value;
    }
  }
  return result;
}

// Mock snakeToCamel function
function snakeToCamel(obj) {
  // Special mapping for staff fields that are lowercase in DB
  const reverseMapping = {
    basesalary: 'baseSalary',
    servicecomm: 'serviceComm',
    consultcomm: 'consultComm'
  };
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (reverseMapping[key]) {
      // Use the mapped camelCase field name
      result[reverseMapping[key]] = value;
    } else {
      // Convert other snake_case fields to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = value;
    }
  }
  return result;
}

async function testStaffInsertion() {
  console.log('🧪 Testing Staff Insertion...\n');

  // Test data - camelCase like in the app
  const testStaff = {
    name: 'Test Staff',
    phone: '0905123456',
    baseSalary: 5000000,
    serviceComm: 18,
    consultComm: 10,
    stocks: 0
  };

  console.log('📤 Original data (camelCase):', testStaff);

  try {
    // Convert to snake_case like the app does
    const snakeStaff = camelToSnake(testStaff);
    console.log('🐍 Converted to snake_case:', snakeStaff);

    // Insert to Supabase
    console.log('\n📤 Inserting to Supabase...');
    const { data, error } = await supabase
      .from('staffs')
      .insert([snakeStaff])
      .select();

    if (error) {
      console.error('❌ Supabase insert failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return;
    }

    console.log('✅ Staff inserted successfully:', data[0]);

    // Convert back to camelCase like the app does
    const camelData = snakeToCamel(data[0]);
    console.log('🐪 Converted back to camelCase:', camelData);

    // Test fetch all staffs
    console.log('\n📥 Fetching all staffs...');
    const { data: allStaffs, error: fetchError } = await supabase
      .from('staffs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError);
      return;
    }

    console.log('✅ Recent staffs:');
    allStaffs.forEach((staff, index) => {
      console.log(`   ${index + 1}. ${staff.name} (${staff.phone}) - ${staff.base_salary}đ`);
    });

    // Cleanup - delete test staff
    console.log('\n🗑️  Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('staffs')
      .delete()
      .eq('id', data[0].id);

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError);
      return;
    }

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All staff insertion tests passed!');

  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run test
testStaffInsertion();
