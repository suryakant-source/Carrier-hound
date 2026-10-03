import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  console.log('Connecting to Supabase...');
  const { count, error } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Error fetching jobs count:', error.message);
  } else {
    console.log('Total jobs count:', count);
  }

  const { data: comp, error: compErr } = await supabase.from('companies').select('*').limit(1);
  console.log('companies table:', { exists: !compErr, error: compErr?.message });

  const { data: desc, error: descErr } = await supabase.from('job_descriptions').select('*').limit(1);
  console.log('job_descriptions table:', { exists: !descErr, error: descErr?.message });

  const { data: runs, error: runsErr } = await supabase.from('ingest_runs').select('*').limit(1);
  console.log('ingest_runs table:', { exists: !runsErr, error: runsErr?.message });

  const { data: jobsCols, error: jobsErr } = await supabase
    .from('jobs')
    .select('id, verified, country_code, seniority, company_id')
    .limit(1);
  console.log('jobs new columns:', { exists: !jobsErr, error: jobsErr?.message });
}

run().catch(console.error);
