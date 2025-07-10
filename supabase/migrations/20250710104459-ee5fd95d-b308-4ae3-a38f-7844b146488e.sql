
-- Blog posts cədvəli
CREATE TABLE public.blog_posts (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  featured_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- FAQ cədvəli
CREATE TABLE public.faq_items (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS siyasətləri - yalnız autentifikasiya olunmuş istifadəçilər bloq və FAQ-ı idarə edə bilər
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Blog posts üçün siyasətlər
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts" 
  ON public.blog_posts 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- FAQ items üçün siyasətlər  
CREATE POLICY "Anyone can view active FAQ items" 
  ON public.faq_items 
  FOR SELECT 
  USING (active = true);

CREATE POLICY "Authenticated users can manage FAQ items" 
  ON public.faq_items 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger-lərini əlavə et
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
