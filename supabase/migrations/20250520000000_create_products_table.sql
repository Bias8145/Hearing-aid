/*
  # Create Products Table for Hearing Aid Catalog
  
  ## Query Description:
  This migration creates the 'products' table to store premium hearing aid details, 
  including price comparisons, features, and marketplace links.
  
  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Low (New Table)
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - Table: products
  - Columns: id, name, brand, description, features, market_price, our_price, image_urls, shopee_url, tokopedia_url, created_at
  
  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Public Read Access
*/

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    market_price NUMERIC NOT NULL,
    our_price NUMERIC NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    shopee_url TEXT,
    tokopedia_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (Corrected Syntax)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policy for Public Read Access
CREATE POLICY "Allow public read access" 
ON public.products 
FOR SELECT 
TO public 
USING (true);

-- Insert Sample Data
INSERT INTO public.products (name, brand, description, features, market_price, our_price, image_urls, shopee_url, tokopedia_url)
VALUES 
(
    'Phonak Lumity L90-R', 
    'Phonak', 
    'The latest premium hearing technology with SmartSpeech Technology for better speech understanding in noise.', 
    ARRAY['Rechargeable', 'Bluetooth Streaming', 'Waterproof', 'AutoSense OS 5.0'],
    55000000,
    18500000,
    ARRAY['https://images.unsplash.com/photo-1590611380053-da6447021fbb?q=80&w=800'],
    'https://shopee.co.id',
    'https://tokopedia.com'
),
(
    'Oticon Real 1 MiniRITE', 
    'Oticon', 
    'Experience the real sounds of life with BrainHearing technology and sudden sound stabilizer.', 
    ARRAY['Tinnitus SoundSupport', 'Direct Streaming', 'Fast Charging', 'Wind Noise Management'],
    48000000,
    15000000,
    ARRAY['https://images.unsplash.com/photo-1590611380053-da6447021fbb?q=80&w=800'],
    'https://shopee.co.id',
    'https://tokopedia.com'
);
