import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, serviceKey!);

async function check() {
  const { data: sampleJob } = await supabase.from('jobs').select('apply_url, source, source_job_id').limit(1).single();
  console.log('Sample existing job:', sampleJob);

  if (sampleJob) {
    const { data: upsertData, error: upsertErr } = await supabase.from('jobs').upsert([
      {
        ...sampleJob,
        title: 'Updated Title Test',
      }
    ], { onConflict: 'apply_url' });

    console.log('Upsert on apply_url result:', { error: upsertErr?.message, code: upsertErr?.code });
  }
}

check().catch(console.error);
