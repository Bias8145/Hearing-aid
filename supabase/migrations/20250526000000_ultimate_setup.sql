/*
  # Ultimate HearPremium Pro Setup
  
  ## Query Description:
  1. Creates the `product-images` storage bucket for photo uploads.
  2. Sets up RLS for Storage to allow public viewing and admin management.
  3. Seeds `site_settings` with all requested social and marketplace keys.
  4. Ensures `products` table has all necessary marketplace columns.
*/

-- 1. Storage Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 2. Site Settings Seeding
INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp_number', '6281234567890'),
  ('email', 'halo@hearpremium.com'),
  ('address', 'Jl. Premium No. 88, Jakarta Selatan'),
  ('shopee_url', ''),
  ('tokopedia_url', ''),
  ('blibli_url', ''),
  ('tiktok_shop_url', ''),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('tiktok_url', '')
ON CONFLICT (key) DO NOTHING;

-- 3. Ensure Product Columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS blibli_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tiktok_shop_url text;
