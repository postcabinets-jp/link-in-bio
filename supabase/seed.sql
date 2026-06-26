-- =========================================================
-- Seed data for local development
-- Uses Supabase local auth with pre-created test users
-- Run: supabase db seed
-- =========================================================

-- NOTE: In local dev, create users via `supabase auth` or the local Studio UI first.
-- Then insert profiles referencing those user IDs.
-- The seed below inserts profile/link data assuming auth users already exist.

-- Sample data for demo user "yuki_creative"
-- (Replace user_id with actual UUID after creating the user)

DO $$
DECLARE
  user1_id UUID := '00000000-0000-0000-0000-000000000001';
  user2_id UUID := '00000000-0000-0000-0000-000000000002';
  link1_id UUID := gen_random_uuid();
  link2_id UUID := gen_random_uuid();
  link3_id UUID := gen_random_uuid();
  link4_id UUID := gen_random_uuid();
  link5_id UUID := gen_random_uuid();
BEGIN

-- Profile 1: フォトグラファー
INSERT INTO profiles (id, username, display_name, bio, avatar_url, theme, seo)
VALUES (
  user1_id,
  'yuki_photo',
  '田中 雪',
  '東京在住のフォトグラファー。風景・ポートレート専門。旅と珈琲とカメラが好き☕',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  '{"template":"minimal","bgColor":"#fafaf8","textColor":"#2d2d2d","buttonStyle":"pill","buttonBg":"#2d2d2d","buttonText":"#fafaf8","fontFamily":"Georgia, serif"}',
  '{"title":"田中雪 - フォトグラファー","description":"東京在住のフォトグラファー。風景・ポートレートを中心に活動中。"}'
)
ON CONFLICT (id) DO NOTHING;

-- Links for user1
INSERT INTO links (id, user_id, title, url, icon, sort_order, is_active) VALUES
  (link1_id, user1_id, '📷 最新作品集 - 2024冬', 'https://example.com/portfolio', NULL, 0, true),
  (link2_id, user1_id, '🛒 プリント販売中', 'https://example.com/shop', NULL, 1, true),
  (link3_id, user1_id, '📅 撮影予約受付中', 'https://example.com/booking', NULL, 2, true)
ON CONFLICT (id) DO NOTHING;

-- Social links for user1
INSERT INTO social_links (user_id, platform, url, sort_order) VALUES
  (user1_id, 'instagram', 'https://instagram.com/yuki_photo', 0),
  (user1_id, 'x', 'https://x.com/yuki_photo', 1),
  (user1_id, 'youtube', 'https://youtube.com/@yuki_photo', 2)
ON CONFLICT DO NOTHING;

-- Click events for analytics demo
INSERT INTO click_events (link_id, referrer, country, clicked_at) VALUES
  (link1_id, 'https://instagram.com', 'JP', now() - interval '1 day'),
  (link1_id, 'https://instagram.com', 'JP', now() - interval '2 days'),
  (link1_id, 'https://x.com',         'JP', now() - interval '2 days'),
  (link1_id, NULL,                     'US', now() - interval '3 days'),
  (link2_id, 'https://instagram.com', 'JP', now() - interval '1 day'),
  (link2_id, 'https://instagram.com', 'JP', now() - interval '4 days'),
  (link3_id, NULL,                    'JP', now() - interval '5 days'),
  (link3_id, 'https://x.com',         'KR', now() - interval '6 days')
ON CONFLICT DO NOTHING;

-- Profile 2: マーケター
INSERT INTO profiles (id, username, display_name, bio, avatar_url, theme, seo)
VALUES (
  user2_id,
  'kenta_mkt',
  '佐藤 健太',
  'スタートアップのマーケター。SNSグロースとコンテンツマーケが専門。週一でニュースレター配信中。',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  '{"template":"bold","bgColor":"#0f172a","textColor":"#f8fafc","buttonStyle":"sharp","buttonBg":"#3b82f6","buttonText":"#ffffff","fontFamily":"Inter, sans-serif"}',
  '{"title":"佐藤健太 - Growth Marketer","description":"スタートアップのマーケター。SNSグロース・コンテンツマーケ専門。"}'
)
ON CONFLICT (id) DO NOTHING;

-- Links for user2
INSERT INTO links (id, user_id, title, url, icon, sort_order, is_active) VALUES
  (link4_id, user2_id, '📰 週刊マーケレター（無料購読）', 'https://example.com/newsletter', NULL, 0, true),
  (link5_id, user2_id, '📚 Notionテンプレ集 — 累計2,400DL', 'https://example.com/templates', NULL, 1, true)
ON CONFLICT (id) DO NOTHING;

-- Social links for user2
INSERT INTO social_links (user_id, platform, url, sort_order) VALUES
  (user2_id, 'x', 'https://x.com/kenta_mkt', 0),
  (user2_id, 'linkedin', 'https://linkedin.com/in/kenta-sato', 1)
ON CONFLICT DO NOTHING;

END $$;
