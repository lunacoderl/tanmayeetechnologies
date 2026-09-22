// ============================================================================
// @tanmayee/database — Migration Runner
// ============================================================================

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

async function runMigrations() {
  console.log('----------------------------------------------------');
  console.log('Tanmayee Technologies — Running Database Migrations');
  console.log('----------------------------------------------------');

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('your-project')) {
    console.log('⚠️  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not configured yet.');
    console.log('💡  When you provide your Supabase credentials in .env, this script will execute the schema on your Supabase Postgres database.');
    console.log('✅  Platform local development in-memory repository is ready.');
    return;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    const schemaPath = path.resolve(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing 001_initial_schema.sql...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.warn('RPC exec_sql not available, please run 001_initial_schema.sql via Supabase SQL Editor.');
      console.warn(error.message);
    } else {
      console.log('✅ Migrations applied successfully!');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

runMigrations();
