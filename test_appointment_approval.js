// Test script for appointment approval functionality
// Run with: node test_appointment_approval.js

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

async function testAppointmentApproval() {
  console.log('🧪 Testing Appointment Approval Functionality...\n');

  try {
    // First, create a test appointment
    const testAppointment = {
      customer_name: 'Test Customer',
      customer_phone: '0905123456',
      service: 'Massage Test',
      ktv: 'KTV Test',
      date: '2026-04-25',
      time: '14:00',
      price: 300000,
      status: 'Chờ phục vụ',
      is_reminded: false,
      is_approved: false,
      shared_update: false
    };

    console.log('📝 Creating test appointment...');
    const { data: created, error: createError } = await supabase
      .from('appointments')
      .insert([testAppointment])
      .select();

    if (createError) {
      console.error('❌ Failed to create test appointment:', createError);
      return;
    }

    const appointmentId = created[0].id;
    console.log('✅ Test appointment created with ID:', appointmentId);
    console.log('📋 Initial state:', {
      is_approved: created[0].is_approved,
      status: created[0].status
    });

    // Now test the approval functionality
    console.log('\n⏳ Testing appointment approval...');
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({ is_approved: true })
      .eq('id', appointmentId)
      .select();

    if (updateError) {
      console.error('❌ Failed to approve appointment:', updateError);
      return;
    }

    console.log('✅ Appointment approved successfully!');
    console.log('📋 Updated state:', {
      is_approved: updated[0].is_approved,
      status: updated[0].status
    });

    // Verify the change
    const { data: verified, error: verifyError } = await supabase
      .from('appointments')
      .select('is_approved, status')
      .eq('id', appointmentId)
      .single();

    if (verifyError) {
      console.error('❌ Failed to verify appointment:', verifyError);
      return;
    }

    console.log('🔍 Verification result:', verified);

    if (verified.is_approved === true) {
      console.log('🎉 Appointment approval functionality works correctly!');
    } else {
      console.log('❌ Appointment approval did not work as expected.');
    }

    // Clean up
    console.log('\n🗑️  Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (deleteError) {
      console.error('❌ Failed to clean up:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run test
testAppointmentApproval();