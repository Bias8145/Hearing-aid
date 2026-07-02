/*
  # Storage Policy Fix & Final Seeding
  
  ## Query Description:
  This migration safely handles storage bucket creation and policies by dropping existing ones first. 
  It also seeds all necessary site settings for the admin dashboard.
  
  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Medium
  - Requires-Backup: false
  - Reversible: true
*/

-- 1. Ensure Bucket Exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Safe Policy Handling for Storage
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
END $$;

-- Create New Policies
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admins can update images" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admins can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 3. Seed Site Settings
INSERT INTO public.site_settings (key, value)
VALUES 
  ('whatsapp_number', '6281234567890'),
  ('email', 'info@hearpremium.com'),
  ('address', 'Jl. Premium No. 88, Jakarta Selatan, Indonesia'),
  ('shopee_url', ''),
  ('tokopedia_url', ''),
  ('blibli_url', ''),
  ('tiktok_shop_url', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', '')
ON CONFLICT (key) DO NOTHING;
