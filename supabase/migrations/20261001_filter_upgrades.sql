-- ============================================================
-- Migration: Upgrade jobs schema for CareerMonke filters
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Enable required extensions for search performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Add new columns safely (preserving status and remote_scope)
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS discovered_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS salary_min NUMERIC,
  ADD COLUMN IF NOT EXISTS salary_max NUMERIC,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS period TEXT DEFAULT 'year',
  ADD COLUMN IF NOT EXISTS seniority TEXT DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS remote_eligibility TEXT DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS eligible_countries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS country_code VARCHAR(2),
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS source_job_id TEXT;

-- 3. Add CHECK constraints
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_period_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_period_check
  CHECK (period IN ('year', 'month', 'hour'));

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_seniority_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_seniority_check
  CHECK (seniority IN ('entry', 'mid', 'senior', 'staff', 'lead', 'director', 'unknown'));

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_remote_eligibility_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_remote_eligibility_check
  CHECK (remote_eligibility IN ('worldwide', 'country-restricted', 'unknown'));

-- 4. Backfill discovered_at from first_seen_at (set once, never reset)
UPDATE public.jobs
SET discovered_at = COALESCE(discovered_at, first_seen_at, NOW())
WHERE discovered_at IS NULL;

-- 5. Backfill categories array from existing category
UPDATE public.jobs
SET categories = ARRAY[category]
WHERE (categories IS NULL OR cardinality(categories) = 0) AND category IS NOT NULL;

-- 6. Backfill country_code from existing country
UPDATE public.jobs
SET country_code = CASE
  WHEN country ILIKE '%united states%' OR country = 'US' OR location ILIKE '%san francisco%' OR location ILIKE '%ny%' OR location ILIKE '%ca%' THEN 'US'
  WHEN country ILIKE '%india%' OR location ILIKE '%bengaluru%' OR location ILIKE '%bangalore%' THEN 'IN'
  WHEN country ILIKE '%united kingdom%' OR country = 'UK' OR location ILIKE '%london%' THEN 'GB'
  WHEN country ILIKE '%canada%' THEN 'CA'
  WHEN country ILIKE '%germany%' OR location ILIKE '%berlin%' THEN 'DE'
  WHEN country ILIKE '%france%' OR location ILIKE '%paris%' THEN 'FR'
  ELSE country_code
END
WHERE country_code IS NULL;

-- 7. Backfill remote_eligibility & eligible_countries
UPDATE public.jobs
SET
  remote_eligibility = CASE
    WHEN remote_scope = 'remote' AND (country = 'Remote' OR location ILIKE '%worldwide%') THEN 'worldwide'
    WHEN remote_scope = 'remote' AND (country = 'United States' OR country_code = 'US') THEN 'country-restricted'
    WHEN remote_scope = 'remote' THEN 'country-restricted'
    ELSE 'unknown'
  END,
  eligible_countries = CASE
    WHEN remote_scope = 'remote' AND (country = 'United States' OR country_code = 'US') THEN ARRAY['US']
    WHEN remote_scope = 'remote' AND (country = 'India' OR country_code = 'IN') THEN ARRAY['IN']
    WHEN remote_scope = 'remote' AND (country = 'Remote' OR location ILIKE '%worldwide%') THEN ARRAY['*']
    ELSE '{}'
  END
WHERE remote_eligibility = 'unknown' OR remote_eligibility IS NULL;

-- 8. Backfill salary_min, salary_max, currency from salary_text
-- e.g. '$165,000 - $240,000' -> min 165000, max 240000, USD, year
UPDATE public.jobs
SET
  currency = 'USD',
  period = 'year',
  salary_min = NULLIF(REGEXP_REPLACE(SPLIT_PART(salary_text, '-', 1), '[^0-9]', '', 'g'), '')::NUMERIC,
  salary_max = NULLIF(REGEXP_REPLACE(SPLIT_PART(salary_text, '-', 2), '[^0-9]', '', 'g'), '')::NUMERIC
WHERE salary_text IS NOT NULL AND salary_min IS NULL AND salary_text ~ '\$[0-9]';

-- 9. Backfill seniority from job title keywords
UPDATE public.jobs
SET seniority = CASE
  WHEN title ~* '\b(intern|internship|fresher|graduate|trainee|apprentice)\b' THEN 'entry'
  WHEN title ~* '\b(junior|entry|associate|jr\.?|level 1|l1|sde 1|sde i)\b' THEN 'entry'
  WHEN title ~* '\b(director|vp|vice president|head of|chief)\b' THEN 'director'
  WHEN title ~* '\b(lead|team lead|tech lead)\b' THEN 'lead'
  WHEN title ~* '\b(staff|principal|distinguished)\b' THEN 'staff'
  WHEN title ~* '\b(senior|sr\.?|level 3|l3|sde 3|sde iii)\b' THEN 'senior'
  WHEN title ~* '\b(mid|intermediate|level 2|l2|sde 2|sde ii)\b' THEN 'mid'
  ELSE 'unknown'
END
WHERE seniority = 'unknown' OR seniority IS NULL;

-- 10. Search column & Weighted tsvector
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

-- 11. Performance Indexes
-- Active status + expiration partial index ordered newest first
DROP INDEX IF EXISTS public.jobs_active_discovered_idx;
CREATE INDEX jobs_active_discovered_idx
  ON public.jobs (discovered_at DESC, id DESC)
  WHERE status = 'active' AND (expires_at IS NULL OR expires_at > NOW());

-- Search GIN index
DROP INDEX IF EXISTS public.jobs_search_vector_idx;
CREATE INDEX jobs_search_vector_idx
  ON public.jobs USING GIN (search_vector);

-- Trigram index on title and company for typo-tolerant fallback
DROP INDEX IF EXISTS public.jobs_title_trgm_idx;
CREATE INDEX jobs_title_trgm_idx
  ON public.jobs USING GIN (title gin_trgm_ops);

DROP INDEX IF EXISTS public.jobs_company_trgm_idx;
CREATE INDEX jobs_company_trgm_idx
  ON public.jobs USING GIN (company gin_trgm_ops);

-- Category GIN index for fast array membership
DROP INDEX IF EXISTS public.jobs_categories_gin_idx;
CREATE INDEX jobs_categories_gin_idx
  ON public.jobs USING GIN (categories);

-- Filter column indexes
CREATE INDEX IF NOT EXISTS jobs_salary_min_idx ON public.jobs (salary_min) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS jobs_seniority_idx ON public.jobs (seniority) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS jobs_country_code_idx ON public.jobs (country_code) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS jobs_remote_scope_idx ON public.jobs (remote_scope) WHERE status = 'active';

-- Unique source index
CREATE UNIQUE INDEX IF NOT EXISTS jobs_source_source_job_id_unique
  ON public.jobs (source, source_job_id)
  WHERE source IS NOT NULL AND source_job_id IS NOT NULL;

-- 12. Row Level Security: public read active jobs only, write only via service role
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_public_read" ON public.jobs;
CREATE POLICY "jobs_public_read"
  ON public.jobs
  FOR SELECT
  USING (
    status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- 13. RPC: Parameterized and validated job search with facets
CREATE OR REPLACE FUNCTION public.get_jobs_with_facets(
  p_q TEXT DEFAULT NULL,
  p_categories TEXT[] DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_remote_only BOOLEAN DEFAULT FALSE,
  p_salary TEXT DEFAULT NULL,
  p_experience TEXT DEFAULT NULL,
  p_date TEXT DEFAULT NULL,
  p_page INT DEFAULT 1,
  p_page_size INT DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_page INT := GREATEST(1, COALESCE(p_page, 1));
  v_limit INT := LEAST(50, GREATEST(1, COALESCE(p_page_size, 10)));
  v_offset INT := (v_page - 1) * v_limit;
  v_cutoff TIMESTAMPTZ := NULL;
  v_salary_min NUMERIC := NULL;
  v_total INT;
  v_jobs JSONB;
  v_category_facets JSONB;
  v_country_facets JSONB;
  v_available_countries JSONB;
BEGIN
  -- Date cutoff calculation
  IF p_date = '24h' THEN
    v_cutoff := NOW() - INTERVAL '24 hours';
  ELSIF p_date = '7d' THEN
    v_cutoff := NOW() - INTERVAL '7 days';
  ELSIF p_date = '30d' THEN
    v_cutoff := NOW() - INTERVAL '30 days';
  END IF;

  -- Salary minimum calculation
  IF p_salary = '100k' THEN
    v_salary_min := 100000;
  ELSIF p_salary = '150k' THEN
    v_salary_min := 150000;
  ELSIF p_salary = '200k' THEN
    v_salary_min := 200000;
  END IF;

  -- Count total matching jobs
  SELECT COUNT(*) INTO v_total
  FROM public.jobs j
  WHERE j.status = 'active'
    AND (j.expires_at IS NULL OR j.expires_at > NOW())
    AND (p_q IS NULL OR p_q = '' OR j.title ILIKE '%' || p_q || '%' OR j.company ILIKE '%' || p_q || '%')
    AND (p_categories IS NULL OR cardinality(p_categories) = 0 OR j.categories && p_categories OR j.category = ANY(p_categories))
    AND (p_country IS NULL OR p_country = '' OR p_country = 'all' OR j.country = p_country)
    AND (NOT p_remote_only OR j.remote_scope = 'remote')
    AND (v_cutoff IS NULL OR COALESCE(j.discovered_at, j.first_seen_at) >= v_cutoff)
    AND (
      p_experience IS NULL OR p_experience = '' OR p_experience = 'all'
      OR (p_experience = 'fresher' AND (j.seniority = 'entry' OR j.title ~* '\b(junior|entry|associate|graduate|fresher|intern)\b'))
      OR (p_experience = 'senior' AND (j.seniority IN ('senior', 'staff', 'lead', 'director') OR j.title ~* '\b(senior|lead|staff|principal|director)\b'))
      OR (p_experience = 'mid' AND (j.seniority = 'mid' OR j.title ~* '\b(mid|intermediate|level 2|l2|sde 2|sde ii)\b'))
    )
    AND (
      v_salary_min IS NULL 
      OR (j.salary_min IS NOT NULL AND j.salary_min >= v_salary_min)
      OR (j.salary_min IS NULL AND j.salary_text IS NOT NULL AND p_salary IN ('100k', '150k') AND j.salary_text ~ '\$[1-9]')
    );

  -- Fetch page jobs (card fields only)
  SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO v_jobs
  FROM (
    SELECT 
      j.id,
      j.title,
      j.company,
      j.location,
      j.remote_scope,
      j.job_type,
      j.salary_text,
      j.salary_min,
      j.salary_max,
      j.currency,
      COALESCE(j.discovered_at, j.first_seen_at) as discovered_at,
      j.first_seen_at,
      j.category,
      j.categories,
      j.country,
      j.country_code,
      j.seniority,
      j.remote_eligibility,
      j.apply_url
    FROM public.jobs j
    WHERE j.status = 'active'
      AND (j.expires_at IS NULL OR j.expires_at > NOW())
      AND (p_q IS NULL OR p_q = '' OR j.title ILIKE '%' || p_q || '%' OR j.company ILIKE '%' || p_q || '%')
      AND (p_categories IS NULL OR cardinality(p_categories) = 0 OR j.categories && p_categories OR j.category = ANY(p_categories))
      AND (p_country IS NULL OR p_country = '' OR p_country = 'all' OR j.country = p_country)
      AND (NOT p_remote_only OR j.remote_scope = 'remote')
      AND (v_cutoff IS NULL OR COALESCE(j.discovered_at, j.first_seen_at) >= v_cutoff)
      AND (
        p_experience IS NULL OR p_experience = '' OR p_experience = 'all'
        OR (p_experience = 'fresher' AND (j.seniority = 'entry' OR j.title ~* '\b(junior|entry|associate|graduate|fresher|intern)\b'))
        OR (p_experience = 'senior' AND (j.seniority IN ('senior', 'staff', 'lead', 'director') OR j.title ~* '\b(senior|lead|staff|principal|director)\b'))
        OR (p_experience = 'mid' AND (j.seniority = 'mid' OR j.title ~* '\b(mid|intermediate|level 2|l2|sde 2|sde ii)\b'))
      )
      AND (
        v_salary_min IS NULL 
        OR (j.salary_min IS NOT NULL AND j.salary_min >= v_salary_min)
        OR (j.salary_min IS NULL AND j.salary_text IS NOT NULL AND p_salary IN ('100k', '150k') AND j.salary_text ~ '\$[1-9]')
      )
    ORDER BY COALESCE(j.discovered_at, j.first_seen_at) DESC, j.id DESC
    LIMIT v_limit OFFSET v_offset
  ) t;

  -- Category facets (based on other filters)
  SELECT COALESCE(jsonb_object_agg(t.cat, t.cnt), '{}'::jsonb) INTO v_category_facets
  FROM (
    SELECT COALESCE(j.category, 'software') AS cat, COUNT(*) AS cnt
    FROM public.jobs j
    WHERE j.status = 'active'
      AND (j.expires_at IS NULL OR j.expires_at > NOW())
      AND (p_q IS NULL OR p_q = '' OR j.title ILIKE '%' || p_q || '%' OR j.company ILIKE '%' || p_q || '%')
      AND (p_country IS NULL OR p_country = '' OR p_country = 'all' OR j.country = p_country)
      AND (NOT p_remote_only OR j.remote_scope = 'remote')
      AND (v_cutoff IS NULL OR COALESCE(j.discovered_at, j.first_seen_at) >= v_cutoff)
    GROUP BY COALESCE(j.category, 'software')
  ) t;

  -- Country facets
  SELECT COALESCE(jsonb_object_agg(t.c, t.cnt), '{}'::jsonb) INTO v_country_facets
  FROM (
    SELECT j.country AS c, COUNT(*) AS cnt
    FROM public.jobs j
    WHERE j.status = 'active'
      AND (j.expires_at IS NULL OR j.expires_at > NOW())
      AND (p_q IS NULL OR p_q = '' OR j.title ILIKE '%' || p_q || '%' OR j.company ILIKE '%' || p_q || '%')
      AND (p_categories IS NULL OR cardinality(p_categories) = 0 OR j.categories && p_categories OR j.category = ANY(p_categories))
      AND (NOT p_remote_only OR j.remote_scope = 'remote')
      AND (v_cutoff IS NULL OR COALESCE(j.discovered_at, j.first_seen_at) >= v_cutoff)
    GROUP BY j.country
  ) t;

  -- Distinct active countries list
  SELECT COALESCE(jsonb_agg(t.country), '[]'::jsonb) INTO v_available_countries
  FROM (
    SELECT DISTINCT country 
    FROM public.jobs 
    WHERE status = 'active' AND country IS NOT NULL 
    ORDER BY country ASC
  ) t;

  RETURN jsonb_build_object(
    'jobs', v_jobs,
    'total', v_total,
    'total_pages', CEIL(v_total::numeric / v_limit),
    'page', v_page,
    'page_size', v_limit,
    'facets', jsonb_build_object(
      'categories', v_category_facets,
      'countries', v_country_facets
    ),
    'available_countries', v_available_countries
  );
END;
$$;

-- Allow public to execute the search function
GRANT EXECUTE ON FUNCTION public.get_jobs_with_facets TO anon, authenticated;

