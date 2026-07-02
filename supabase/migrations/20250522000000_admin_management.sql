/*
# Admin Management & Seed Data
This migration sets up initial settings and ensures admin can manage products.

## Query Description:
1. Seeds the site_settings table with default contact info.
2. Adds RLS policies for authenticated users to manage products.

## Metadata:
- Schema-Category: Structural/Data
- Impact-Level: Medium
- Requires-Backup: false
- Reversible: true
*/

-- Seed site settings if empty
INSERT INTO public.site_settings (key, value)
VALUES 
  ('whatsapp_number', '6281234567890'),
  ('address', 'Jl. Premium No. 123, Jakarta Selatan'),
  ('email', 'info@hearpremium.com'),
  ('shopee_url', 'https://shopee.co.id/hearpremium'),
  ('tokopedia_url', 'https://tokopedia.com/hearpremium'),
  ('instagram_url', 'https://instagram.com/hearpremium')
ON CONFLICT (key) DO NOTHING;

-- Ensure RLS policies for products management by admin
CREATE POLICY "Allow authenticated users to manage products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
