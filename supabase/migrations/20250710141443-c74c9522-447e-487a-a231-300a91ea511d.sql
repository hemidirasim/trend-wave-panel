-- Delete all standard services from the database
DELETE FROM public.services WHERE category = 'standard';

-- Update the check constraint to only allow social_media category
ALTER TABLE public.services DROP CONSTRAINT services_category_check;
ALTER TABLE public.services ADD CONSTRAINT services_category_check CHECK (category = 'social_media');