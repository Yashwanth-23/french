-- ==============================================================================
-- FRENCH MASTERY PORTAL: SUPABASE POSTGRES SCHEMA
-- Multi-device sync for French TEF/TCF Canada preparation
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,                       -- Unique user slug (e.g. "vasir", "rahul-tef")
  name TEXT NOT NULL,
  target_exam TEXT NOT NULL DEFAULT 'TEF_Canada', -- 'TEF_Canada' | 'TCF_Canada' | 'Universal_B2'
  daily_time_minutes INTEGER NOT NULL DEFAULT 120,
  preferred_formats JSONB NOT NULL DEFAULT '["podcast", "youtube"]'::jsonb,
  starting_level TEXT NOT NULL DEFAULT 'A0',
  current_milestone_id TEXT NOT NULL DEFAULT 'milestone-a0',
  completed_milestone_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_task_queue JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_minutes_logged INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
  bookmarked_resource_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by slug ID
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read & write for link-based multi-device synchronization
CREATE POLICY "Public profiles read and write"
  ON public.profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
