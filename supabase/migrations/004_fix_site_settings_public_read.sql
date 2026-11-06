-- =========================================================================
-- AMYCC Migration 004: Ensure Public Anonymous Read for Site Settings
-- =========================================================================
-- Fixes issue where anonymous visitors and new devices see empty/fallback
-- data because site_settings only permitted authenticated users.

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;

-- Create public read policy for both anon and authenticated users
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ensure authenticated staff/admin can manage settings
DROP POLICY IF EXISTS "Super admin can manage settings" ON public.site_settings;
CREATE POLICY "Super admin can manage settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
