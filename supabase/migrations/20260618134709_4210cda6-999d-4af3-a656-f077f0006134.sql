
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'website',
  user_agent TEXT,
  ip_address TEXT,
  marketing_consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  shopify_synced_at TIMESTAMPTZ,
  shopify_customer_id TEXT,
  shopify_sync_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon/authenticated. Only service_role (backend) can read/write.
