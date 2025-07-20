
-- Create table for custom service names in different languages
CREATE TABLE public.service_custom_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_service_name TEXT NOT NULL,
  language_code TEXT NOT NULL CHECK (language_code IN ('az', 'tr')),
  custom_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(api_service_name, language_code)
);

-- Enable RLS for security
ALTER TABLE public.service_custom_names ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view custom names
CREATE POLICY "Allow authenticated users to view custom service names"
ON public.service_custom_names
FOR SELECT
TO authenticated
USING (true);

-- Allow admin users to manage custom names
CREATE POLICY "Allow admin users to manage custom service names"
ON public.service_custom_names
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER set_service_custom_names_updated_at
  BEFORE UPDATE ON public.service_custom_names
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
