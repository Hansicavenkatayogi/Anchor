-- Phase 5 DB Enhancements

-- 1. Push Tokens
CREATE TABLE public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL,
  anonymous_id text NOT NULL,
  platform text,
  timezone text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Notification Log
CREATE TABLE public.notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id text NOT NULL,
  type text,
  title text,
  body text,
  data jsonb,
  sent_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- 3. Moderation Flags
CREATE TABLE public.moderation_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text REFERENCES public.cases(id),
  ai_flags text[],
  ai_reason text,
  client_flags text[],
  reviewed_by uuid REFERENCES public.ngo_users(id),
  review_action text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add moderation_status to cases
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS moderation_status text DEFAULT 'pending';

-- 4. NGO Verifications
CREATE TABLE public.ngo_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text,
  org_type text,
  registration_no text,
  city text,
  state text,
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  description text,
  doc_paths text[],
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES public.ngo_users(id),
  reviewed_at timestamptz,
  rejection_reason text
);

-- 5. Crisis Flags
CREATE TABLE public.crisis_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id text NOT NULL,
  flag_type text,
  crisis_category text,
  session_id text,
  triggered_at timestamptz DEFAULT now()
);

-- Relax RLS for MVP APIs (Next.js server securely connects using Service Key)
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all push" ON public.push_tokens USING (true) WITH CHECK (true);
CREATE POLICY "Allow all notif" ON public.notification_log USING (true) WITH CHECK (true);
CREATE POLICY "Allow all mod" ON public.moderation_flags USING (true) WITH CHECK (true);
CREATE POLICY "Allow all ngo_verif" ON public.ngo_verifications USING (true) WITH CHECK (true);
CREATE POLICY "Allow all crisis" ON public.crisis_flags USING (true) WITH CHECK (true);
