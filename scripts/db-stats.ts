import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function stats() {
  console.log('--- Database Health & Size Report ---');

  const { count: totalJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
  const { count: activeJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true);
  const { count: verifiedJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('verified', true);
  const { count: companiesCount } = await supabase.from('companies').select('*', { count: 'exact', head: true });
  const { count: descriptionsCount } = await supabase.from('job_descriptions').select('*', { count: 'exact', head: true });
  const { count: runsCount } = await supabase.from('ingest_runs').select('*', { count: 'exact', head: true });

  console.log({
    totalJobs,
    activeJobs,
    verifiedJobs,
    companiesCount,
    descriptionsCount,
    runsCount,
  });

  const { data: latestRun } = await supabase
    .from('ingest_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1);

  if (latestRun && latestRun.length > 0) {
    console.log('\nLatest Ingest Run:', latestRun[0]);
  }

  const { data: sampleVerified } = await supabase
    .from('jobs')
    .select('id, title, company, location, verified, source, source_type, seniority, country_code')
    .eq('verified', true)
    .limit(3);

  console.log('\nSample Verified Jobs:', sampleVerified);
}

stats().catch(console.error);
