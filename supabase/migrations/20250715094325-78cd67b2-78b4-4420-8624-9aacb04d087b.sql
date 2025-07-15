-- Create admin_settings table to store system-wide settings
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Only admins can manage settings" 
ON public.admin_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service fee setting
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('service_fee', '0');

-- Insert other default settings
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('site_name', '"HitLoyal"');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('site_description', '"Sosial media büyütmə xidmətləri"');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('contact_email', '"info@hitloyal.com"');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('contact_phone', '"+994 XX XXX XX XX"');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('maintenance_mode', 'false');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('allow_registration', 'true');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('default_balance', '0');

INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('notification_email', '"admin@hitloyal.com"');