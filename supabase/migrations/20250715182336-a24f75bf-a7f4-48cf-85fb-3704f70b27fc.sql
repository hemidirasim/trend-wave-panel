
-- Admin settings cədvəlində hər kəs üçün SELECT icazəsi yaradırıq
CREATE POLICY "Anyone can read admin settings" 
ON admin_settings 
FOR SELECT 
TO public 
USING (true);
