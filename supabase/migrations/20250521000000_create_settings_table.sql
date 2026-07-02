/*
# Create Site Settings Table
This migration creates a table to store global site configuration like contact info and social links.

## Metadata:
- Schema-Category: Structural
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true
*/

CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access for settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default values
INSERT INTO public.site_settings (key, value) VALUES 
('whatsapp_number', '6281234567890'),
('address', 'Jakarta, Indonesia (Pengiriman Seluruh Indonesia)'),
('email', 'info@hearpremium.com'),
('shopee_url', 'https://shopee.co.id'),
('tokopedia_url', 'https://tokopedia.com'),
('instagram_url', 'https://instagram.com'),
('facebook_url', 'https://facebook.com')
ON CONFLICT (key) DO NOTHING;
