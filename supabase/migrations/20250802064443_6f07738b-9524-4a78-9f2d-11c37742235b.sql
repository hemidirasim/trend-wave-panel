
-- orders cədvəlində user_id sahəsini məcburi olmayacaq şəkildə dəyişmək
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;

-- orders cədvəlinə email sahəsi əlavə etmək
ALTER TABLE public.orders 
ADD COLUMN email text;

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
