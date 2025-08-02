
-- orders cədvəlində user_id sahəsini məcburi olmayacaq şəkildə dəyişmək
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;

-- orders cədvəlinə email sahəsi əlavə etmək (əgər yoxdursa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='email') THEN
        ALTER TABLE public.orders ADD COLUMN email text;
    END IF;
END $$;

-- Köhnə policy-ləri silmək
DROP POLICY IF EXISTS "Anonymous users can create orders with email" ON public.orders;
DROP POLICY IF EXISTS "Anonymous users can view orders by email" ON public.orders;

-- Qeydiyyatsız istifadəçilər üçün yeni RLS policy əlavə etmək
CREATE POLICY "Anonymous users can create orders with email"
ON public.orders
FOR INSERT
WITH CHECK (
  (user_id IS NULL AND email IS NOT NULL) OR 
  (user_id IS NOT NULL AND auth.uid() = user_id)
);

-- Qeydiyyatsız istifadəçilər üçün sifarişləri görə bilmək (email əsasında)
CREATE POLICY "Anonymous users can view orders by email"
ON public.orders
FOR SELECT
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) OR
  (user_id IS NULL AND email IS NOT NULL)
);
