-- Add user_id column to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;