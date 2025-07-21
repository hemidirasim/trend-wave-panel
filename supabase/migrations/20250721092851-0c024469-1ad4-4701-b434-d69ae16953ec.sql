-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.check_email_exists(text);

-- Create the email check function with correct parameter name
CREATE OR REPLACE FUNCTION public.check_email_exists(email_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = email_param
  );
END;
$$;