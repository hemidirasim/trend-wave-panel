
CREATE OR REPLACE FUNCTION check_email_exists(email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
