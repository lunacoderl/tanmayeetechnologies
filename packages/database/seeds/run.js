// ============================================================================
// @tanmayee/database — Seed Runner
// ============================================================================

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

async function runSeeds() {
  console.log('----------------------------------------------------');
  console.log('Tanmayee Technologies — Running Database Seed Data');
  console.log('----------------------------------------------------');

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('your-project')) {
    console.log('⚠️  SUPABASE_URL not configured yet.');
    console.log('💡  All 130+ products are preloaded in @tanmayee/database seed structures for development.');
    return;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    const seedPath = path.resolve(__dirname, '001_seed_data.sql');
    const sql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing 001_seed_data.sql (130+ products)...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.warn('RPC exec_sql not available, please run 001_seed_data.sql via Supabase SQL Editor.');
      console.warn(error.message);
    } else {
      console.log('✅ Seed data inserted successfully!');
    }
  } catch (err) {
    console.error('Seed execution error:', err.message);
  }
}

runSeeds();
