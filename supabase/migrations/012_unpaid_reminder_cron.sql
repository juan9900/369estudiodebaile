-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily cron job at 12:00 UTC (08:00 Venezuela time)
-- Replace <APP_URL> and <CRON_SECRET> with actual values before applying
SELECT cron.schedule(
  'unpaid-registration-reminder',
  '0 12 * * *',
  $$
  SELECT net.http_get(
    url := 'https://369estudio.com/api/cron/unpaid-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer 70L3dsdfa1xCkby3Cgvfasdf324fsdeokHfIv'
    )
  );
  $$
);
