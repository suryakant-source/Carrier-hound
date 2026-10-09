-- ============================================================
-- Migration: Add location column to candidate_profiles table
-- ============================================================

ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS location TEXT;
