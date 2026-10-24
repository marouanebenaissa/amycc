-- ============================================================
-- AMYCC Migration 003: Public Read Policy for Site Settings
-- Allows public anonymous visitors to read non-sensitive platform settings
-- (such as top bar announcement, contact info, social links)
-- ============================================================

DO $$ BEGIN
  CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    TO anon, authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
