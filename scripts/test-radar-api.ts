import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { resolveLocation, TRUSTED_CITIES, COUNTRY_CENTROIDS } from '../src/lib/geo/cities';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testRadarAgg() {
  const t0 = Date.now();
  console.log('Fetching active jobs count...');
  const { count: totalActive } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('status', 'active');

  console.log('Total active jobs:', totalActive);
  const chunkSize = 1000;
  const chunkCount = Math.ceil((totalActive || 0) / chunkSize);
  const promises = [];

  for (let i = 0; i < chunkCount; i++) {
    const from = i * chunkSize;
    const to = from + chunkSize - 1;
    promises.push(
      supabase
        .from('jobs')
        .select('id, company, title, location, country_code, remote_scope, remote_eligibility, verified')
        .eq('is_active', true)
        .eq('status', 'active')
        .range(from, to)
    );
  }

  const results = await Promise.all(promises);
  const allJobs: any[] = [];
  for (const r of results) {
    if (r.data) allJobs.push(...r.data);
  }

  console.log(`Fetched ${allJobs.length} jobs in ${Date.now() - t0}ms. Running Geo aggregation...`);

  const distinctJobIds = new Set<string>();
  const distinctVerifiedIds = new Set<string>();

  interface CityAggregate {
    id: string;
    name: string;
    countryCode: string;
    region: string;
    coordinates: [number, number];
    totalCount: number;
    verifiedCount: number;
    companies: Set<string>;
  }

  const cityMap = new Map<string, CityAggregate>();

  for (const c of TRUSTED_CITIES) {
    cityMap.set(c.id, {
      id: c.id,
      name: c.name,
      countryCode: c.countryCode,
      region: c.region,
      coordinates: c.coordinates,
      totalCount: 0,
      verifiedCount: 0,
      companies: new Set(),
    });
  }

  const countryMap = new Map<string, { total: number; verified: number; name: string; coordinates: [number, number] }>();
  for (const [code, meta] of Object.entries(COUNTRY_CENTROIDS)) {
    countryMap.set(code, {
      total: 0,
      verified: 0,
      name: meta.name,
      coordinates: meta.coordinates,
    });
  }

  const worldwideRemote = {
    id: 'worldwide-remote',
    name: 'Worldwide Remote',
    totalCount: 0,
    verifiedCount: 0,
    companies: new Set<string>(),
  };

  const unlocated = {
    id: 'unlocated',
    name: 'Unlocated',
    totalCount: 0,
    verifiedCount: 0,
  };

  for (const j of allJobs) {
    distinctJobIds.add(j.id);
    const isVerified = Boolean(j.verified);
    if (isVerified) distinctVerifiedIds.add(j.id);

    const resolved = resolveLocation(j.location, j.country_code, j.remote_scope, j.remote_eligibility);

    if (resolved.type === 'worldwide_remote') {
      worldwideRemote.totalCount++;
      if (isVerified) worldwideRemote.verifiedCount++;
      if (j.company) worldwideRemote.companies.add(j.company);
    } else if (resolved.type === 'city') {
      let city = cityMap.get(resolved.id);
      if (!city && resolved.coordinates) {
        city = {
          id: resolved.id,
          name: resolved.name,
          countryCode: resolved.countryCode || 'US',
          region: resolved.region,
          coordinates: resolved.coordinates,
          totalCount: 0,
          verifiedCount: 0,
          companies: new Set(),
        };
        cityMap.set(resolved.id, city);
      }
      if (city) {
        city.totalCount++;
        if (isVerified) city.verifiedCount++;
        if (j.company) city.companies.add(j.company);
      }
      if (resolved.countryCode && countryMap.has(resolved.countryCode)) {
        const c = countryMap.get(resolved.countryCode)!;
        c.total++;
        if (isVerified) c.verified++;
      }
    } else if (resolved.type === 'country') {
      if (resolved.countryCode && countryMap.has(resolved.countryCode)) {
        const c = countryMap.get(resolved.countryCode)!;
        c.total++;
        if (isVerified) c.verified++;
      }
    } else {
      unlocated.totalCount++;
      if (isVerified) unlocated.verifiedCount++;
    }
  }

  const activeCities = Array.from(cityMap.values())
    .filter((c) => c.totalCount > 0)
    .sort((a, b) => b.totalCount - a.totalCount);

  console.log('\n--- RADAR TELEMETRY SUMMARY ---');
  console.log({
    totalActiveDistinct: distinctJobIds.size,
    totalVerifiedDistinct: distinctVerifiedIds.size,
    activeCitiesWithJobs: activeCities.length,
    worldwideRemoteJobs: worldwideRemote.totalCount,
    unlocatedJobs: unlocated.totalCount,
    totalTime: `${Date.now() - t0}ms`,
  });

  console.log('\nTop 10 Cities by Job Count:');
  console.table(
    activeCities.slice(0, 10).map((c) => ({
      City: c.name,
      Country: c.countryCode,
      'Total Jobs': c.totalCount,
      'Verified Jobs': c.verifiedCount,
      'Sample Companies': Array.from(c.companies).slice(0, 3).join(', '),
    }))
  );
}

testRadarAgg().catch(console.error);
