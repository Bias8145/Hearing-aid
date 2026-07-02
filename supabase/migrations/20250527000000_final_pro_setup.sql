/*
  # Final Pro Setup
  Ensures all settings keys exist and storage bucket is configured correctly.

  ## Query Description:
  1. Seeds all required site settings keys for social and marketplace links.
  2. Ensures RLS policies for storage are robust.
*/

-- Seed initial settings if they don't exist
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

-- Ensure storage bucket exists (handled by app, but policy here)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'product-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
    END IF;
END $$;

-- Storage Policies
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
