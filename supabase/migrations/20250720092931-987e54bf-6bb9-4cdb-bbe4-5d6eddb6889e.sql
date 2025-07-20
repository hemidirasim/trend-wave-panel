
-- Create exchange rates table for currency conversion
CREATE TABLE public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL DEFAULT 'USD',
  to_currency TEXT NOT NULL DEFAULT 'AZN', 
  rate DECIMAL(10,4) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Insert default USD to AZN rate (current approximate rate)
INSERT INTO public.exchange_rates (from_currency, to_currency, rate, is_active) 
VALUES ('USD', 'AZN', 1.7000, true);

-- Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read exchange rates (public data)
CREATE POLICY "Exchange rates are publicly readable" ON public.exchange_rates
  FOR SELECT USING (true);

-- Only admins can modify exchange rates
CREATE POLICY "Only admins can modify exchange rates" ON public.exchange_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add currency preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferred_currency TEXT DEFAULT 'USD' CHECK (preferred_currency IN ('USD', 'AZN'));

-- Create index for faster lookups
CREATE INDEX idx_exchange_rates_currencies ON public.exchange_rates(from_currency, to_currency, is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_exchange_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER exchange_rates_updated_at
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_exchange_rates_updated_at();
