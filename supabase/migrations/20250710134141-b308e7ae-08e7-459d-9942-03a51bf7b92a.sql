
-- Admin istifadəçisi üçün profile yaradırıq
INSERT INTO public.profiles (id, email, full_name, balance)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@hitloyal.com',
  'Admin',
  0.00
) ON CONFLICT (id) DO NOTHING;

-- Admin rolunu təyin edirik
INSERT INTO public.user_roles (user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;
