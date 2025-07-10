-- Create services table for dynamic service management
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  category TEXT NOT NULL CHECK (category IN ('standard', 'social_media')),
  platform TEXT,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies - services should be publicly readable but only admins can modify
CREATE POLICY "Services are publicly readable" 
ON public.services 
FOR SELECT 
USING (true);

-- For now, only authenticated users can modify (we'll add admin role checks later)
CREATE POLICY "Authenticated users can insert services" 
ON public.services 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update services" 
ON public.services 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete services" 
ON public.services 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default standard services
INSERT INTO public.services (name, description, category, icon, order_index) VALUES
('SMM (Sosial Media Marketinq)', 'Sosial mediada brendinizi inkişaf etdirin', 'standard', 'Users', 1),
('Google/YouTube Reklamı', 'Hədəfli reklam kampaniyaları', 'standard', 'Search', 2),
('SEO', 'Axtarış motorlarında yüksək sıralama', 'standard', 'TrendingUp', 3),
('Loqo Dizaynı', 'Peşəkar loqo dizaynı xidmətləri', 'standard', 'Palette', 4),
('Sayt Hazırlanması', 'Müasir və responsiv veb saytlar', 'standard', 'Globe', 5),
('TV/Radio Reklamı', 'Ənənəvi media reklamları', 'standard', 'Tv', 6),
('Facebook Reklamı', 'Facebook və Instagram reklamları', 'standard', 'Facebook', 7);

-- Insert social media services
INSERT INTO public.services (name, description, category, platform, icon, order_index) VALUES
('Instagram Bəyənmə', 'Organik Instagram bəyənmələri', 'social_media', 'Instagram', 'Heart', 1),
('Instagram İzləyici', 'Keyfiyyətli Instagram izləyiciləri', 'social_media', 'Instagram', 'UserPlus', 2),
('TikTok Bəyənmə', 'TikTok videoları üçün bəyənmələr', 'social_media', 'TikTok', 'Heart', 3),
('TikTok İzləyici', 'TikTok hesabı üçün izləyicilər', 'social_media', 'TikTok', 'UserPlus', 4),
('YouTube Baxış', 'YouTube video baxışları', 'social_media', 'YouTube', 'Eye', 5),
('YouTube Abunəçi', 'YouTube kanalı abunəçiləri', 'social_media', 'YouTube', 'UserPlus', 6);