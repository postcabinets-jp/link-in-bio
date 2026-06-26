-- =========================================================
-- Link-in-Bio: Initial Schema
-- =========================================================

-- ── profiles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username      TEXT        UNIQUE NOT NULL,
  display_name  TEXT,
  bio           TEXT,
  avatar_url    TEXT,
  theme         JSONB       NOT NULL DEFAULT '{"template":"default","bgColor":"#ffffff","textColor":"#1a1a1a","buttonStyle":"rounded","buttonBg":"#1a1a1a","buttonText":"#ffffff","fontFamily":"Inter"}',
  seo           JSONB       NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own_all"    ON profiles FOR ALL    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);

-- ── links ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS links (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  url         TEXT        NOT NULL,
  icon        TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "links_own_all"      ON links FOR ALL    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "links_public_read"  ON links FOR SELECT USING (is_active = true);

-- ── social_links ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID    NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  platform    TEXT    NOT NULL,
  url         TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_own_all"     ON social_links FOR ALL    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "social_public_read" ON social_links FOR SELECT USING (true);

-- ── click_events ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS click_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id     UUID        NOT NULL REFERENCES links ON DELETE CASCADE,
  referrer    TEXT,
  user_agent  TEXT,
  country     TEXT,
  clicked_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- Owner can read their link's events; inserts happen via service role (Edge Function)
CREATE POLICY "clicks_owner_read" ON click_events FOR SELECT
  USING (link_id IN (SELECT id FROM links WHERE user_id = auth.uid()));

-- Allow anonymous inserts (public page click tracking via Edge Function / service role)
CREATE POLICY "clicks_insert_anon" ON click_events FOR INSERT
  WITH CHECK (true);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX idx_links_user_id         ON links(user_id);
CREATE INDEX idx_links_sort_order      ON links(user_id, sort_order);
CREATE INDEX idx_social_links_user_id  ON social_links(user_id);
CREATE INDEX idx_click_events_link_id  ON click_events(link_id);
CREATE INDEX idx_click_events_time     ON click_events(clicked_at DESC);

-- ── updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
