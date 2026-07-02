/*
  # Fix Migration and Enhance Schema
  
  ## Query Description:
  1. Fixes the "policy already exists" error by dropping existing policies first.
  2. Adds missing marketplace columns to the products table.
  3. Seeds all required site settings (Socials, Marketplace, Contact).
  
  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Medium
  - Requires-Backup: true
  - Reversible: true
*/

-- 1. Enhance Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS blibli_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tiktok_shop_url text;

-- 2. Fix RLS Policies for Products
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Admins can do everything with products" ON public.products;

CREATE POLICY "Allow public read access" 
ON public.products FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can do everything with products" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 3. Seed Site Settings
INSERT INTO public.site_settings (key, value)
VALUES 
  ('whatsapp_number', '6281234567890'),
  ('address', 'Jl. Premium No. 123, Jakarta Selatan'),
  ('email', 'info@hearpremium.com'),
  ('shopee_url', 'https://shopee.co.id'),
  ('tokopedia_url', 'https://tokopedia.com'),
  ('blibli_url', 'https://blibli.com'),
  ('tiktok_shop_url', 'https://tiktok.com'),
  ('instagram_url', 'https://instagram.com/hearpremium'),
  ('facebook_url', 'https://facebook.com/hearpremium'),
  ('tiktok_url', 'https://tiktok.com/@hearpremium')
ON CONFLICT (key) DO NOTHING;
