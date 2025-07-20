import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock blog posts data - in a real app, this would come from your database
  const blogPosts = [
    {
      id: 1,
      slug: "instagram-takipci-artirma-yollari",
      title: {
        az: "Instagram Takipçi Artırmanın 10 Effektiv Yolu",
        tr: "Instagram Takipçi Artırmanın 10 Etkili Yolu"
      },
      content: {
        az: `<p>Instagram hesabınızda organik takipçi artırmaq üçün ən effektiv strategiyalar və məsləhətlər haqqında ətraflı məlumat.</p>

<h2>1. Keyfiyyətli Məzmun Paylaşın</h2>
<p>Instagram-da uğurlu olmaq üçün ən vacib faktor keyfiyyətli məzmun paylaşmaqdır. Hər bir paylaşımınız auditoriyamızın marağını çəkməli və dəyərli məlumat verməlidir.</p>

<h2>2. Hashtag Strategiyasından İstifadə Edin</h2>
<p>Düzgün hashtag strategiyası sizin məzmununuzun daha çox insana çatmasına kömək edir. Populyar və nişinizə aid hashtag-ları araşdırın və istifadə edin.</p>

<h2>3. Müntəzəm Paylaşım Edin</h2>
<p>Auditoriya sizin aktiv olduğunuzu görmək istəyir. Hər gün və ya həftədə müəyyən saatlarda paylaşım etmək sizin görünürlüyünüzü artırır.</p>

<h2>4. Stories-dən İstifadə Edin</h2>
<p>Instagram Stories funksiyası sizin auditoriyanızla daha yaxın əlaqə qurmanıza imkan verir. Düzenli olaraq stories paylaşın.</p>

<h2>5. Digər Hesablarla Əməkdaşlıq Edin</h2>
<p>Sahənizdəki digər hesablarla əməkdaşlıq etmək yeni auditoriya qazanmaq üçün əla üsuldur.</p>`,
        tr: `<p>Instagram hesabınızda organik takipçi artırmak için en etkili stratejiler ve öneriler hakkında detaylı bilgi.</p>

<h2>1. Kaliteli İçerik Paylaşın</h2>
<p>Instagram'da başarılı olmak için en önemli faktör kaliteli içerik paylaşmaktır. Her paylaşımınız kitlenizin ilgisini çekmeli ve değerli bilgi vermelidir.</p>

<h2>2. Hashtag Stratejisinden Yararlanın</h2>
<p>Doğru hashtag stratejisi içeriğinizin daha fazla kişiye ulaşmasına yardımcı olur. Popüler ve nişinize ait hashtag-ları araştırın ve kullanın.</p>

<h2>3. Düzenli Paylaşım Yapın</h2>
<p>Kitle sizin aktif olduğunuzu görmek ister. Her gün veya haftada belirli saatlerde paylaşım yapmak görünürlüğünüzü artırır.</p>

<h2>4. Stories Kullanın</h2>
<p>Instagram Stories özelliği kitlenizle daha yakın ilişki kurmanıza olanak verir. Düzenli olarak stories paylaşın.</p>

<h2>5. Diğer Hesaplarla İşbirliği Yapın</h2>
<p>Alanınızdaki diğer hesaplarla işbirliği yapmak yeni kitle kazanmak için harika bir yoldur.</p>`
      },
      excerpt: {
        az: "Instagram hesabınızda organik takipçi artırmaq üçün ən effektiv strategiyalar və məsləhətlər...",
        tr: "Instagram hesabınızda organik takipçi artırmak için en etkili stratejiler ve öneriler..."
      },
      author: "SocialBoost Team",
      date: {
        az: "5 Yanvar 2024",
        tr: "5 Ocak 2024"
      },
      category: "Instagram",
      readTime: {
        az: "8 dəq",
        tr: "8 dk"
      },
      image: "/placeholder.svg"
    },
    {
      id: 2,
      slug: "tiktok-algoritmi-viral-olmaq",
      title: "TikTok Algoritmi: Viral Olmaq üçün Gizli Formullar",
      content: `<p>TikTok alqoritminin necə işlədiyi və virallaşmaq üçün lazım olan əsas faktorlar haqqında ətraflı təhlil.</p>

<h2>TikTok Alqoritmi Necə İşləyir?</h2>
<p>TikTok alqoritmi istifadəçilərin davranışlarını, videoların performansını və məzmun keyfiyyətini nəzərə alaraq For You səhifəsində göstəriləcək videoları seçir.</p>

<h2>Viral Olmaq üçün Əsas Faktorlar</h2>
<p>Viral olmaq üçün aşağıdakı faktorlara diqqət etmək lazımdır:</p>
<ul>
<li>İlk 3 saniyədə diqqəti çəkmək</li>
<li>Trend musiqi və effektlər istifadə etmək</li>
<li>Qısa və dinamik məzmun yaratmaq</li>
<li>Hashtag strategiyası tətbiq etmək</li>
</ul>

<h2>Məzmun Strategiyası</h2>
<p>Uğurlu TikTok məzmunu yaratmaq üçün auditoriyanızın maraqlarını öyrənin və trend mövzulara uyğun məzmun hazırlayın.</p>`,
      excerpt: "TikTok alqoritminin necə işlədiyi və virallaşmaq üçün lazım olan əsas faktorlar...",
      author: "Digital Ekspert",
      date: "3 Yanvar 2024",
      category: "TikTok",
      readTime: "6 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      slug: "youtube-seo-strategiyalari",
      title: "YouTube SEO: Videoları Axtarışda Üstə Çıxarmaq",
      content: `<p>YouTube videolarınızı axtarış nəticələrində üst sıralarda göstərmək üçün SEO strategiyaları.</p>

<h2>YouTube SEO-nun Əhəmiyyəti</h2>
<p>YouTube dünyanın ikinci ən böyük axtarış mühərrikidir. Düzgün SEO strategiyası ilə videolarınız daha çox izləyiciyə çata bilər.</p>

<h2>Başlıq Optimizasiyası</h2>
<p>Video başlığınız açar sözləri ehtiva etməli və izləyicilərin marağını çəkməlidir. Başlığın uzunluğu 60 simvoldan çox olmamalıdır.</p>

<h2>Təsvir və Tag-lar</h2>
<p>Video təsvirində ətraflı məlumat verin və müvafiq tag-lar əlavə edin. Bu, YouTube alqoritminin sizin məzmununuzu başa düşməsinə kömək edir.</p>

<h2>Thumbnail Optimallaşdırması</h2>
<p>Cəlbedici thumbnail hazırlayın. Bu, klick dərəcənizi əhəmiyyətli dərəcədə artıra bilər.</p>`,
      excerpt: "YouTube videolarınızı axtarış nəticələrində üst sıralarda göstərmək üçün SEO strategiyaları...",
      author: "SEO Mütəxəssis",
      date: "1 Yanvar 2024",
      category: "YouTube",
      readTime: "10 dəq",
      image: "/placeholder.svg"
    }
  ];

  useEffect(() => {
    // Find the post by slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    setPost(foundPost);
    setLoading(false);
  }, [slug]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Instagram: 'bg-pink-500',
      TikTok: 'bg-purple-500',
      YouTube: 'bg-red-500',
      Facebook: 'bg-blue-500',
      Marketing: 'bg-green-500',
      Analytics: 'bg-orange-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <>
        <SEO title={t('blog.loading')} noindex />
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>{t('blog.loading')}</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <SEO 
          title={t('blog.articleNotFound')} 
          description={t('blog.articleNotFoundDesc')}
          noindex 
        />
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">{t('blog.articleNotFound')}</h1>
              <p className="text-muted-foreground mb-8">{t('blog.articleNotFoundDesc')}</p>
              <Link to={`/${language}/blog`}>
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('blog.backToBlog')}
                </Button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={post.title[language as keyof typeof post.title]}
        description={post.excerpt[language as keyof typeof post.excerpt]}
        type="article"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to={`/${language}/blog`}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('blog.backToBlog')}
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge className={`${getCategoryColor(post.category)} text-white mb-4`}>
                {post.category}
              </Badge>
              
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {post.title[language as keyof typeof post.title]}
              </h1>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.date[language as keyof typeof post.date]}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime[language as keyof typeof post.readTime]}
                </div>
              </div>

              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                <img 
                  src={post.image} 
                  alt={post.title[language as keyof typeof post.title]}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Article Content */}
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.content[language as keyof typeof post.content] }}
                />
              </CardContent>
            </Card>

            {/* Related Articles or CTA can be added here */}
            <div className="mt-8 text-center">
              <Link to={`/${language}/blog`}>
                <Button size="lg">
                  {t('blog.readOtherArticles')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
