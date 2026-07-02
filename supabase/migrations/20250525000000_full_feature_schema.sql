/*
# Full Feature Schema & Security
1. Add marketplace columns to products
2. Seed comprehensive site settings
3. Fix RLS policies with DROP IF EXISTS to avoid migration errors

## Security:
- RLS Enabled on all tables
- Public read access for products and settings
- Authenticated-only write access
*/

-- 1. Enhance Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS blibli_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tiktok_shop_url text;

-- 2. Seed Site Settings
INSERT INTO public.site_settings (key, value)
VALUES 
  ('whatsapp_number', '6281234567890'),
  ('email', 'halo@hearpremium.com'),
  ('address', 'Jl. Premium No. 88, Jakarta Selatan'),
  ('shopee_url', ''),
  ('tokopedia_url', ''),
  ('blibli_url', ''),
  ('tiktok_shop_url', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', '')
ON CONFLICT (key) DO NOTHING;

-- 3. Fix Policies (Drop first to avoid "already exists" errors)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Admins can do everything with products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access for settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON public.site_settings;

-- Products Policies
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can do everything with products" ON public.products
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings Policies
CREATE POLICY "Allow public read access for settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
