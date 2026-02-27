-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  status text DEFAULT 'active',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy for service role
CREATE POLICY "service_role_all" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for anon to insert
CREATE POLICY "anon_insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
