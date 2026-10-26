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

-- 3. Initial Scheduled Events & Masterclasses
DO $$
DECLARE
  ev1_id UUID := gen_random_uuid();
  ev2_id UUID := gen_random_uuid();
  ev3_id UUID := gen_random_uuid();
BEGIN
  -- Event 1: Performing Arts Masterclass
  INSERT INTO public.events (id, slug, status, start_date, end_date, venue, city, capacity, registration_open, cover_image)
  VALUES (ev1_id, 'performing-arts-masterclass', 'published', '2026-11-15T16:00:00Z', '2026-11-15T19:00:00Z', 'المركز الثقافي', 'الرباط', 40, true, 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.event_translations (event_id, locale, title, description)
  VALUES
    (ev1_id, 'ar', 'ورشة المسرح والأداء التعبيري للشباب', 'تدريب عملي تفاعلي على تقنيات الارتجال المسرحي، الإلقاء، والتحكم في الفضاء الركحي تحت إشراف أطر فنية معتمدة.'),
    (ev1_id, 'fr', 'Atelier Théâtre & Expression Scénique', 'Formation pratique et interactive aux techniques d''improvisation théâtrale et d''expression corporelle.'),
    (ev1_id, 'en', 'Theatre & Performing Arts Youth Masterclass', 'Interactive hands-on masterclass focusing on dramatic improvisation, vocal delivery, and stage presence.')
  ON CONFLICT (event_id, locale) DO NOTHING;

  -- Event 2: Moroccan Heritage Music Evening
  INSERT INTO public.events (id, slug, status, start_date, end_date, venue, city, capacity, registration_open, cover_image)
  VALUES (ev2_id, 'heritage-music-evening', 'published', '2026-12-05T18:30:00Z', '2026-12-05T21:30:00Z', 'فضاء الفنون والعروض', 'الدار البيضاء', 80, true, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.event_translations (event_id, locale, title, description)
  VALUES
    (ev2_id, 'ar', 'أمسية التراث الموسيقي المغربي الأصيل', 'حفل موسيقي شبابي يحتفي بالروافد الموسيقية المغربية الأصيلة، بمشاركة مواهب صاعدة في العزف والغناء التراثي.'),
    (ev2_id, 'fr', 'Soirée du Patrimoine Musical Marocain', 'Concert acoustique célébrant la richesse des mélodies marocaines traditionnelles avec de jeunes talents.'),
    (ev2_id, 'en', 'Moroccan Heritage Music Evening', 'An acoustic celebration of authentic Moroccan musical roots featuring promising emerging young musicians.')
  ON CONFLICT (event_id, locale) DO NOTHING;

  -- Event 3: Youth in Action Forum
  INSERT INTO public.events (id, slug, status, start_date, end_date, venue, city, capacity, registration_open, cover_image)
  VALUES (ev3_id, 'youth-creative-forum', 'published', '2026-12-20T10:00:00Z', '2026-12-20T17:00:00Z', 'دار الشباب والأنشطة الثقافية', 'مراكش', 60, true, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.event_translations (event_id, locale, title, description)
  VALUES
    (ev3_id, 'ar', 'ملتقى مبادرة شباب في العمل للتطوع الثقافي', 'يوم دراسي وورشات تدريبية تجمع متطوعي مبادرة شباب في العمل لتقييم المبادرات وتخطيط الأنشطة الثقافية المقبلة.'),
    (ev3_id, 'fr', 'Forum Jeunesse en Action & Volontariat Culturel', 'Journée d''échange et de formation réunissant les bénévoles de Jeunesse en Action pour planifier les projets.'),
    (ev3_id, 'en', 'Youth in Action Forum & Cultural Volunteering', 'A full-day strategy and workshop gathering bringing Youth in Action volunteers together to co-design upcoming initiatives.')
  ON CONFLICT (event_id, locale) DO NOTHING;
END $$;

-- 4. Sample News Articles & Official Announcements
DO $$
DECLARE
  news1_id UUID := gen_random_uuid();
  news2_id UUID := gen_random_uuid();
  news3_id UUID := gen_random_uuid();
BEGIN
  -- Article 1: Official Launch
  INSERT INTO public.news_articles (id, slug, status, category, cover_image, published_at)
  VALUES (news1_id, 'official-launch', 'published', 'press', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', '2026-10-15T10:00:00Z')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.news_translations (article_id, locale, title, excerpt, content)
  VALUES
    (news1_id, 'ar', 'الإطلاق الرسمي للمنصة الرقمية لجمعية روح الفنون والثقافة (AMYCC)', 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات رسمية لتعزيز التواصل المجتمعي، وتيسير طلبات الانخراط والتطوع، ومتابعة أجندة الفعاليات الثقافية.', '<p>تدشين المنصة الرقمية الرسمية التفاعلية لجمعية روح الفنون والثقافة بـ 3 لغات.</p>'),
    (news1_id, 'fr', 'Lancement officiel de la plateforme numérique de l''Association AMYCC', 'L''association inaugure sa plateforme web trilingue facilitant les démarches d''adhésion, l''engagement bénévole et le suivi des manifestations culturelles.', '<p>Lancement officiel du portail interactif trilingue de l''AMYCC.</p>'),
    (news1_id, 'en', 'Official Launch of the AMYCC Digital Platform', 'AMYCC officially launches its trilingual digital portal to foster community participation, streamline membership applications, and publish its cultural agenda.', '<p>Official launch of AMYCC trilingual portal.</p>')
  ON CONFLICT (article_id, locale) DO NOTHING;

  -- Article 2: Youth in Action Call
  INSERT INTO public.news_articles (id, slug, status, category, cover_image, published_at)
  VALUES (news2_id, 'youth-in-action-call', 'published', 'youth', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', '2026-10-20T14:30:00Z')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.news_translations (article_id, locale, title, excerpt, content)
  VALUES
    (news2_id, 'ar', 'فتح باب الترشيح للتطوع ضمن مبادرة "شباب في العمل" لموسم 2026', 'تدعو جمعية روح الفنون والثقافة كافة الطاقات الشابة والطلبة الراغبين في خوض تجربة جمعوية مميزة للتسجيل في الفوج الأول من متطوعي التنشيط الثقافي.', '<p>فتح باب الترشيح للالتحاق بالفوج الأول من مبادرة شباب في العمل.</p>'),
    (news2_id, 'fr', 'Appel à candidatures pour l''initiative "Jeunesse en Action" 2026', 'L''AMYCC invite les jeunes et étudiants souhaitant s''engager dans une aventure associative enrichissante à rejoindre la première promotion de bénévoles.', '<p>Appel à candidatures pour la cohorte Jeunesse en Action 2026.</p>'),
    (news2_id, 'en', 'Call for Applications: Youth in Action Volunteering Program 2026', 'AMYCC invites passionate young people and students to apply for the inaugural cohort of cultural event volunteers and leaders.', '<p>Applications open for the Youth in Action 2026 cohort.</p>')
  ON CONFLICT (article_id, locale) DO NOTHING;

  -- Article 3: Theatre Workshops Launch
  INSERT INTO public.news_articles (id, slug, status, category, cover_image, published_at)
  VALUES (news3_id, 'theatre-workshops-launch', 'published', 'culture', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80', '2026-10-22T16:00:00Z')
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.news_translations (article_id, locale, title, excerpt, content)
  VALUES
    (news3_id, 'ar', 'انطلاق سلسلة الورشات المسرحية والتعبير الركحي لفائدة شباب دور الشباب', 'في إطار برنامج التكوين المسرحي والتراثي، تعلن الجمعية عن انطلاق الورشات التكوينية الركحية المؤطرة من طرف أساتذة وممارسين محترفين لتمكين الشباب من تقنيات الأداء المسرحي.', '<p>انطلاق ورشات التكوين المسرحي والتعبير الركحي للشباب.</p>'),
    (news3_id, 'fr', 'Coup d’envoi du cycle d’ateliers de théâtre et d’expression scénique pour les jeunes', 'Dans le cadre de son programme d’expression théâtrale, l’AMYCC déploie une série de masterclasses animées par des professionnels des arts vivants.', '<p>Lancement des ateliers de théâtre et d’expression scénique.</p>'),
    (news3_id, 'en', 'Kickoff of Scenic Theatre & Youth Expressive Performance Workshops', 'AMYCC launches its flagship theatre coaching workshops guided by seasoned theatrical directors to cultivate emerging talent across cultural venues.', '<p>Kickoff of scenic theatre workshops.</p>')
  ON CONFLICT (article_id, locale) DO NOTHING;
END $$;
