
-- Enable replica identity for profiles table to capture full row data during updates
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add profiles table to the supabase_realtime publication to enable real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Add converted_amount column to payment_transactions table (webhook logs show this column is missing)
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS converted_amount numeric;

-- Add converted_currency column to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS converted_currency text DEFAULT 'AZN';
