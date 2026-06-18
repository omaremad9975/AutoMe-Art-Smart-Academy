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
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar                  TEXT NOT NULL,
  name_en                  TEXT NOT NULL,
  price                    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration                 TEXT NOT NULL DEFAULT '',
  seats                    INTEGER NOT NULL DEFAULT 0,
  is_active                BOOLEAN NOT NULL DEFAULT TRUE,
  certificate_template_url TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠️ If courses table already exists, run this migration:
-- ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_template_url TEXT;

-- ============================================================
-- TABLE: registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name    TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
  whatsapp        TEXT,                            -- optional, if different from phone
  payment_method    TEXT NOT NULL DEFAULT 'fawry',  -- fawry | vodafone_cash | instapay
  payment_status    TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed
  receipt_url       TEXT,                            -- uploaded receipt screenshot (vodafone_cash / instapay)
  payment_reference TEXT,                            -- manual reference entered by admin when confirming
  transaction_id    TEXT,                            -- auto transaction ID (Fawry)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠️ If registrations table already exists, run these migrations:
-- ALTER TABLE registrations ADD COLUMN IF NOT EXISTS whatsapp TEXT;
-- ALTER TABLE registrations ADD COLUMN IF NOT EXISTS receipt_url TEXT;
-- ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_reference TEXT;
-- ALTER TABLE registrations ADD COLUMN IF NOT EXISTS transaction_id TEXT;

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
-- TABLE: gallery_photos (conference / event photo carousel)
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url         TEXT NOT NULL,
  caption_ar  TEXT NOT NULL DEFAULT '',
  caption_en  TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery_photos"
  ON gallery_photos FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Authenticated write gallery_photos"
  ON gallery_photos FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

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

-- Public (anon) can read active courses — needed for the registration modal
CREATE POLICY "Public read active courses"
  ON courses FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "Authenticated read courses"
  ON courses FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write courses"
  ON courses FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Public (anon) can insert registrations — the public form submits without auth
CREATE POLICY "Public insert registrations"
  ON registrations FOR INSERT TO anon WITH CHECK (TRUE);
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

CREATE POLICY "Public read settings"
  ON settings FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Authenticated read settings"
  ON settings FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated write settings"
  ON settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA (optional examples)
-- ============================================================

-- Seed existing conference photos so they appear in the Gallery dashboard
INSERT INTO gallery_photos (url, caption_ar, caption_en, sort_order) VALUES
  ('/conference/conf1.jpg',    'صورة جماعية مع المشاركين والمنظمين',          'Group photo with all conference attendees and organizers', 0),
  ('/conference/IMG_2259.jpg', 'طلاب أرت سمارت في المؤتمر',                   'Students representing Art Smart Academy at the conference', 1),
  ('/conference/IMG_2308.jpg', 'اجتماع رسمي مع كبار المشاركين',               'Official meeting with conference dignitaries', 2),
  ('/conference/conf2.jpg',    'جلسات وعروض المؤتمر',                         'Conference sessions and presentations', 3),
  ('/conference/conf3.jpg',    'أبرز لحظات المؤتمر الدولي للذكاء الاصطناعي', 'Highlights from the International AI Conference', 4)
ON CONFLICT DO NOTHING;
INSERT INTO courses (name_ar, name_en, price, duration, seats, is_active) VALUES
  ('التفكير الإبداعي',   'Creative Thinking',      2500, '8 أسابيع',  20, TRUE),
  ('الذكاء الاصطناعي',  'Artificial Intelligence', 3000, '10 أسابيع', 15, TRUE),
  ('اللغة الصينية',      'Chinese Language',        2200, '12 أسبوعًا', 12, TRUE)
ON CONFLICT DO NOTHING;
