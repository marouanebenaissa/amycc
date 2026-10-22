-- ============================================================
-- AMYCC Development Seed Data
-- Fictional examples for development testing only
-- ============================================================

-- 1. Initial Site Settings
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"name_ar": "جمعية روح الفنون والثقافة", "name_en": "Spirit of Arts & Culture Association", "name_fr": "Association Esprit des Arts et de la Culture", "email": "contact@amycc.org", "foundation_year": 2026}'::jsonb),
  ('social_links', '{"facebook": "#", "instagram": "#", "youtube": "#", "linkedin": "#"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Sample Programs (Arts, Music, Youth in Action)
DO $$
DECLARE
  prog1_id UUID := gen_random_uuid();
  prog2_id UUID := gen_random_uuid();
BEGIN
  -- Program 1: Youth in Action (Volunteering)
  INSERT INTO public.programs (id, slug, status, category, city)
  VALUES (prog1_id, 'youth-in-action', 'published', 'youth', 'Morocco')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.program_translations (program_id, locale, title, description, objectives)
  VALUES
    (prog1_id, 'ar', 'مبادرة شباب في العمل', 'مبادرة تطوعية تهدف إلى إشراك الشباب في الأنشطة الثقافية والمجتمعية.', 'تعزيز روح المبادرة والعمل التطوعي لدى الشباب.'),
    (prog1_id, 'fr', 'Initiative Jeunesse en Action', 'Une initiative bénévole visant à engager les jeunes dans des activités culturelles et communautaires.', 'Promouvoir l''esprit d''initiative et le bénévolat.'),
    (prog1_id, 'en', 'Youth in Action Initiative', 'A volunteering initiative aiming to engage youth in cultural and community activities.', 'Promoting civic initiative and volunteering among youth.')
  ON CONFLICT (program_id, locale) DO NOTHING;

  -- Program 2: Arts & Heritage Discovery
  INSERT INTO public.programs (id, slug, status, category, city)
  VALUES (prog2_id, 'arts-heritage-workshops', 'published', 'arts', 'Morocco')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.program_translations (program_id, locale, title, description, objectives)
  VALUES
    (prog2_id, 'ar', 'ورشات الفنون والتراث', 'ورشات تفاعلية لاستكشاف الفنون التشكيلية والمسرحية والموسيقية المغربية.', 'تنمية المواهب الفنية وصون التراث الثقافي.'),
    (prog2_id, 'fr', 'Ateliers des Arts et du Patrimoine', 'Des ateliers interactifs pour explorer les arts plastiques, le théâtre et la musique marocaine.', 'Développer les talents artistiques et préserver le patrimoine.'),
    (prog2_id, 'en', 'Arts & Heritage Workshops', 'Interactive workshops exploring plastic arts, theatre, and Moroccan music.', 'Nurturing artistic talents and preserving cultural heritage.')
  ON CONFLICT (program_id, locale) DO NOTHING;
END $$;
