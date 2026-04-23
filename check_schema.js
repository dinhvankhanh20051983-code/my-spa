// Schema check script
// Run with: node check_schema.js

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

async function checkStaffsSchema() {
  console.log('🔍 Checking staffs table schema...\n');

  try {
    // Try to fetch existing data to see current schema
    const { data, error } = await supabase
      .from('staffs')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Failed to query staffs table:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Schema check successful. Current row structure:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('\n📋 Available columns:', Object.keys(data[0]));
    } else {
      console.log('📋 Table exists but is empty. Trying to get column info...');

      // Test different field combinations
      const testCases = [
        { name: 'Test 1', phone: '111' },
        { name: 'Test 2', phone: '222', baseSalary: 1000000 },
        { name: 'Test 3', phone: '333', baseSalary: 1000000, serviceComm: 10 },
        { name: 'Test 4', phone: '444', baseSalary: 1000000, serviceComm: 10, consultComm: 5 },
        { name: 'Test 5', phone: '555', base_salary: 1000000, service_comm: 10, consult_comm: 5 }
      ];

      for (const testData of testCases) {
        console.log(`\n🧪 Testing insert with: ${JSON.stringify(testData)}`);
        const { error: insertError } = await supabase
          .from('staffs')
          .insert([testData]);

        if (insertError) {
          console.error(`❌ Failed: ${insertError.message}`);
        } else {
          console.log('✅ Success!');
        }
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkStaffsSchema();