-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Create a simple keepalive job that runs every 2 days
-- This will prevent the free tier from pausing due to inactivity
SELECT cron.schedule(
  'supabase-keepalive',
  '0 0 */2 * *', -- At midnight every 2 days
  $$
  SELECT COUNT(*) FROM public.students LIMIT 1;
  $$
);

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'supabase-keepalive';