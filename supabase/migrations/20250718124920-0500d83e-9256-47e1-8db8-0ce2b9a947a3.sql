
-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs every minute to check order statuses
SELECT cron.schedule(
  'check-order-status',
  '* * * * *', -- every minute
  $$
  SELECT
    net.http_post(
        url:='https://lnsragearbdkxpbhhyez.supabase.co/functions/v1/check-order-status',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxuc3JhZ2VhcmJka3hwYmhoeWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzgyNDEsImV4cCI6MjA2NzE1NDI0MX0.fP2P2ZJursJ6yI44WPVjznOzTJw-yTVFFhCQEVsjEps"}'::jsonb,
        body:='{"scheduled_check": true}'::jsonb
    ) as request_id;
  $$
);

-- Add external_order_id column to orders table to store the API order submission ID
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS external_order_id text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_external_order_id ON public.orders(external_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
