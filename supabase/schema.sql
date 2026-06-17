-- ============================================================
-- Art Smart Academy — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration      TEXT NOT NULL DEFAULT '',
  seats         INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name    TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
  payment_method  TEXT NOT NULL DEFAULT 'fawry',  -- fawry | vodafone_cash | instapay
  payment_status  TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  amount          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  method          TEXT NOT NULL DEFAULT 'fawry',  -- fawry | vodafone_cash | instapay
  reference       TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | rejected
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email     TEXT UNIQUE NOT NULL,
  role      TEXT NOT NULL DEFAULT 'admin',  -- admin | super_admin | marketing
  auth_id   UUID,                           -- Supabase Auth user ID (set when created via dashboard)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠️ If admins table already exists, run this migration in Supabase SQL Editor:
-- ALTER TABLE admins ADD COLUMN IF NOT EXISTS auth_id UUID;
-- ALTER TABLE admins ALTER COLUMN role SET DEFAULT 'admin';
-- COMMENT ON COLUMN admins.role IS 'admin | super_admin | marketing';

-- ============================================================
-- TABLE: settings (key-value store for academy settings)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('academy_name',      'Art Smart Academy | أرت سمارت اكاديمي'),
  ('phone',             '+20 100 000 0000'),
  ('email',             'info@artsmartacademy.com'),
  ('whatsapp',          '+20 100 000 0000'),
  ('cert_id_format',    'ASA-[COURSE]-[YEAR]-[NUMBER]')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins         ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read/write
-- (In production, you'd check the admins table too)

CREATE POLICY "Authenticated read courses"
  ON courses FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write courses"
  ON courses FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated read registrations"
  ON registrations FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write registrations"
  ON registrations FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated read payments"
  ON payments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write payments"
  ON payments FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated read admins"
  ON admins FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write admins"
  ON admins FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated read settings"
  ON settings FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write settings"
  ON settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA (optional examples)
-- ============================================================
INSERT INTO courses (name_ar, name_en, price, duration, seats, is_active) VALUES
  ('التفكير الإبداعي',   'Creative Thinking',      2500, '8 أسابيع',  20, TRUE),
  ('الذكاء الاصطناعي',  'Artificial Intelligence', 3000, '10 أسابيع', 15, TRUE),
  ('اللغة الصينية',      'Chinese Language',        2200, '12 أسبوعًا', 12, TRUE)
ON CONFLICT DO NOTHING;
