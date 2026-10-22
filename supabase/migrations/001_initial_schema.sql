-- ============================================================
-- AMYCC Official Database Schema — Migration 001
-- PostgreSQL on Supabase
-- Fully Normalized, Typed, RLS-Enabled
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role_type AS ENUM (
  'super_admin',
  'content_manager',
  'communications_manager',
  'membership_manager',
  'volunteer_coordinator',
  'programs_events_manager',
  'partnership_manager',
  'finance_manager',
  'reviewer'
);

CREATE TYPE publish_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'archived');
CREATE TYPE registration_status AS ENUM ('confirmed', 'waitlist', 'cancelled', 'attended');

-- 3. PROFILES & RBAC
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name user_role_type UNIQUE NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE public.user_roles (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_id)
);

-- Seed predefined roles
INSERT INTO public.roles (name, description) VALUES
  ('super_admin', 'Full access to all system settings, user roles, logs, and content'),
  ('content_manager', 'Create, edit, and publish pages, articles, and programs'),
  ('communications_manager', 'Manage news, announcements, media assets, and press releases'),
  ('membership_manager', 'Review, approve, and manage membership applications'),
  ('volunteer_coordinator', 'Review and coordinate Youth in Action and volunteer applications'),
  ('programs_events_manager', 'Manage programs, event scheduling, and event registrations'),
  ('partnership_manager', 'Review and process institutional partnership inquiries'),
  ('finance_manager', 'Manage donation notices, financial support records, and audit logs'),
  ('reviewer', 'Read-only audit and review access to approved content and submissions');

-- Helper function to check user role securely
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, check_role user_role_type)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = check_user_id
      AND (r.name = check_role OR r.name = 'super_admin')
  );
$$;

-- Trigger to create profile when auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SITE SETTINGS
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 5. PROGRAMS & TRANSLATIONS
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status publish_status NOT NULL DEFAULT 'draft',
  category TEXT NOT NULL DEFAULT 'arts',
  cover_image TEXT,
  city TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE public.program_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ar', 'fr', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT,
  target_audience TEXT,
  activities TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(program_id, locale)
);

-- 6. EVENTS & EVENT REGISTRATIONS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status publish_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue TEXT,
  city TEXT,
  capacity INT CHECK (capacity >= 0),
  registration_open BOOLEAN NOT NULL DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE public.event_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ar', 'fr', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, locale)
);

CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status registration_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent event overbooking
CREATE OR REPLACE FUNCTION public.check_event_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  max_cap INT;
  current_regs INT;
BEGIN
  SELECT capacity INTO max_cap FROM public.events WHERE id = NEW.event_id;
  
  IF max_cap IS NOT NULL THEN
    SELECT COUNT(*) INTO current_regs
    FROM public.event_registrations
    WHERE event_id = NEW.event_id AND status = 'confirmed';

    IF current_regs >= max_cap THEN
      RAISE EXCEPTION 'This event has reached its maximum registration capacity.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_event_capacity
  BEFORE INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.check_event_capacity();

-- 7. NEWS ARTICLES & TRANSLATIONS
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status publish_status NOT NULL DEFAULT 'draft',
  category TEXT NOT NULL DEFAULT 'association',
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE public.news_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('ar', 'fr', 'en')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(article_id, locale)
);

-- 8. MEMBERSHIP APPLICATIONS
CREATE TABLE public.membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  profession TEXT,
  interests TEXT[],
  motivation TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. VOLUNTEER APPLICATIONS (Youth in Action)
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  skills TEXT,
  availability TEXT,
  areas_of_interest TEXT[],
  experience TEXT,
  initiative TEXT NOT NULL DEFAULT 'Youth in Action',
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. PARTNERSHIP INQUIRIES
CREATE TABLE public.partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Morocco',
  interests TEXT,
  proposal TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. DONATION NOTICES / SUPPORT INQUIRIES
CREATE TABLE public.donation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  support_type TEXT NOT NULL, -- 'financial', 'in_kind', 'sponsorship', 'equipment', 'venue'
  amount NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'MAD',
  notes TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. AUDIT LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile; admins can read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Roles: read-only for authenticated staff
CREATE POLICY "Authenticated users can read roles" ON public.roles
  FOR SELECT TO authenticated USING (true);

-- User roles: only super_admin can read and manage
CREATE POLICY "Super admin can manage user roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- Public content: Anyone can view published content
CREATE POLICY "Public can view published programs" ON public.programs
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Public can view program translations" ON public.program_translations
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.programs p WHERE p.id = program_id AND (p.status = 'published' OR public.has_role(auth.uid(), 'programs_events_manager')))
  );

CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Public can view event translations" ON public.event_translations
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.status = 'published' OR public.has_role(auth.uid(), 'programs_events_manager')))
  );

CREATE POLICY "Public can view published news" ON public.news_articles
  FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'communications_manager'));

CREATE POLICY "Public can view news translations" ON public.news_translations
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.news_articles n WHERE n.id = article_id AND (n.status = 'published' OR public.has_role(auth.uid(), 'communications_manager')))
  );

-- Staff content management policies
CREATE POLICY "Staff can manage programs" ON public.programs
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Staff can manage program translations" ON public.program_translations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Staff can manage events" ON public.events
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Staff can manage event translations" ON public.event_translations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Staff can manage news" ON public.news_articles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'communications_manager'));

CREATE POLICY "Staff can manage news translations" ON public.news_translations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'communications_manager'));

-- Form Submissions (Public can INSERT, only authorized staff can SELECT/UPDATE)
CREATE POLICY "Public can submit event registration" ON public.event_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view and manage event registrations" ON public.event_registrations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'programs_events_manager'));

CREATE POLICY "Public can submit membership application" ON public.membership_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view and manage membership applications" ON public.membership_applications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'membership_manager'));

CREATE POLICY "Public can submit volunteer application" ON public.volunteer_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view and manage volunteer applications" ON public.volunteer_applications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'volunteer_coordinator'));

CREATE POLICY "Public can submit partnership inquiry" ON public.partnership_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view and manage partnership inquiries" ON public.partnership_inquiries
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'partnership_manager'));

CREATE POLICY "Public can submit donation record" ON public.donation_records
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view and manage donation records" ON public.donation_records
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'));

-- Audit logs: append-only for staff, viewable only by super_admin
CREATE POLICY "Super admin can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can create audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Settings: viewable by all authenticated staff, manageable only by super_admin
CREATE POLICY "Authenticated users can view settings" ON public.site_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin can manage settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
