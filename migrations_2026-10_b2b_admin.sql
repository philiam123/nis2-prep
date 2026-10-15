-- Additive migration for security/B2B/admin work (also applied automatically by api/index.ts on cold start)
CREATE TABLE IF NOT EXISTS companies (
  id serial PRIMARY KEY, name text NOT NULL, org_number text, contact_name text, contact_email text,
  seats integer NOT NULL DEFAULT 0, valid_until date, invoice_status text NOT NULL DEFAULT 'pending',
  notes text, created_at timestamp NOT NULL DEFAULT now()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamp;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id integer REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_disabled boolean NOT NULL DEFAULT false;
ALTER TABLE company_codes ADD COLUMN IF NOT EXISTS company_id integer REFERENCES companies(id) ON DELETE SET NULL;
CREATE TABLE IF NOT EXISTS exam_sessions (
  id text PRIMARY KEY, user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE, track integer NOT NULL,
  questions jsonb NOT NULL, started_at timestamp NOT NULL DEFAULT now(), expires_at timestamp NOT NULL, submitted_at timestamp
);
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, count integer NOT NULL DEFAULT 0, reset_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user ON exam_sessions(user_id);
