
CREATE OR REPLACE FUNCTION check_email_exists(email_param text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.email = email_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
