-- RESET SUPABASE: Drop old schema and recreate with snake_case columns
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.share_transactions CASCADE;
DROP TABLE IF EXISTS public.customer_treatment_logs CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.online_orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.staffs CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP FUNCTION IF EXISTS public.update_timestamp() CASCADE;

-- Now re-run the schema from supabase_schema.sql
