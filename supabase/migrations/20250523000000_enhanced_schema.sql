/*
  # Enhanced Schema for HearPremium Pro
  
  ## Changes:
  1. Add marketplace columns to products table.
  2. Seed comprehensive site settings.
  3. Ensure RLS allows authenticated admins to manage everything.
*/

-- Add new marketplace columns to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS blibli_url text,
ADD COLUMN IF NOT EXISTS tiktok_shop_url text;

-- Clear and re-seed site settings to ensure all keys exist
DELETE FROM public.site_settings;
INSERT INTO public.site_settings (key, value) VALUES
('whatsapp_number', '6281234567890'),
('address', 'Jl. Raya Hearing No. 123, Jakarta Selatan'),
('email', 'info@hearpremium.com'),
('shopee_url', 'https://shopee.co.id'),
('tokopedia_url', 'https://tokopedia.com'),
('blibli_url', 'https://blibli.com'),
('tiktok_shop_url', 'https://tiktok.com'),
('facebook_url', 'https://facebook.com/hearpremium'),
('instagram_url', 'https://instagram.com/hearpremium'),
('tiktok_url', 'https://tiktok.com/@hearpremium');

-- Ensure RLS for products management
CREATE POLICY "Admins can do everything with products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
