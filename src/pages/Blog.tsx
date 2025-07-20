
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookText, Calendar, User, ArrowRight, TrendingUp, Target, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { t, language } = useLanguage();
  
  const blogPosts = [
    {
      id: 1,
      slug: "instagram-takipci-artirma-yollari",
      title: {
        az: "Instagram Takipçi Artırmanın 10 Effektiv Yolu",
        tr: "Instagram Takipçi Artırmanın 10 Etkili Yolu"
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
      title: {
        az: "TikTok Algoritmi: Viral Olmaq üçün Gizli Formullar",
        tr: "TikTok Algoritması: Viral Olmak için Gizli Formüller"
      },
      excerpt: {
        az: "TikTok alqoritminin necə işlədiyi və virallaşmaq üçün lazım olan əsas faktorlar...",
        tr: "TikTok algoritmasının nasıl çalıştığı ve viral olmak için gerekli olan temel faktörler..."
      },
      author: "Digital Ekspert",
      date: {
        az: "3 Yanvar 2024",
        tr: "3 Ocak 2024"
      },
      category: "TikTok",
      readTime: {
        az: "6 dəq",
        tr: "6 dk"
      },
      image: "/placeholder.svg"
    },
    {
      id: 3,
      slug: "youtube-seo-strategiyalari",
      title: {
        az: "YouTube SEO: Videoları Axtarışda Üstə Çıxarmaq",
        tr: "YouTube SEO: Videoları Aramada Üste Çıkarmak"
      },
      excerpt: {
        az: "YouTube videolarınızı axtarış nəticələrində üst sıralarda göstərmək üçün SEO strategiyaları...",
        tr: "YouTube videolarınızı arama sonuçlarında üst sıralarda göstermek için SEO stratejileri..."
      },
      author: "SEO Mütəxəssis",
      date: {
        az: "1 Yanvar 2024",
        tr: "1 Ocak 2024"
      },
      category: "YouTube",
      readTime: {
        az: "10 dəq",
        tr: "10 dk"
      },
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: {
        az: "Facebook Marketinq: Biznes üçün Effektiv Strategiyalar",
        tr: "Facebook Pazarlama: İş için Etkili Stratejiler"
      },
      slug: "facebook-marketing-strategiyalari",
      excerpt: {
        az: "Facebook platformasında biznesinizi genişləndirmək və müştəri cəlb etmək üçün praktik məsləhətlər...",
        tr: "Facebook platformunda işinizi genişletmek ve müşteri çekmek için pratik öneriler..."
      },
      author: "Marketing Guru",
      date: {
        az: "30 Dekabr 2023",
        tr: "30 Aralık 2023"
      },
      category: "Facebook",
      readTime: {
        az: "7 dəq",
        tr: "7 dk"
      },
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: {
        az: "Sosial Media Analitikası: KPI-ları Necə İzləmək Lazımdır",
        tr: "Sosyal Medya Analitiği: KPI'ları Nasıl Takip Etmeli"
      },
      slug: "sosial-media-analitikasi",
      excerpt: {
        az: "Sosial media kampaniyalarınızın effektivliyini ölçmək üçün vacib olan göstəricilər və analiz metodları...",
        tr: "Sosyal medya kampanyalarınızın etkinliğini ölçmek için önemli olan göstergeler ve analiz yöntemleri..."
      },
      author: "Data Analisti",
      date: {
        az: "28 Dekabr 2023",
        tr: "28 Aralık 2023"
      },
      category: "Analytics",
      readTime: {
        az: "12 dəq",
        tr: "12 dk"
      },
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: {
        az: "İnfluencer Marketinq: Uğurlu Əməkdaşlıq Qurmanın Yolları",
        tr: "Influencer Pazarlama: Başarılı İşbirliği Kurmanın Yolları"
      },
      slug: "influencer-marketing-strategiyalari",
      excerpt: {
        az: "İnfluencerlərlə effektiv əməkdaşlıq qurmaq və kampaniya ROI-sini artırmaq üçün strategiyalar...",
        tr: "Influencer'larla etkili işbirliği kurmak ve kampanya ROI'sini artırmak için stratejiler..."
      },
      author: "Brend Meneceri",
      date: {
        az: "25 Dekabr 2023",
        tr: "25 Aralık 2023"
      },
      category: "Marketing",
      readTime: {
        az: "9 dəq",
        tr: "9 dk"
      },
      image: "/placeholder.svg"
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookText className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>{t('blog.latestTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('blog.latestTrendsDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>{t('blog.practicalTips')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('blog.practicalTipsDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>{t('blog.analytics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('blog.analyticsDesc')}
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link to={`/${language}/blog/${post.slug}`}>
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title[language as keyof typeof post.title]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(post.category)} text-white`}>
                    {post.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date[language as keyof typeof post.date]}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <Badge variant="secondary">{post.readTime[language as keyof typeof post.readTime]}</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title[language as keyof typeof post.title]}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.excerpt[language as keyof typeof post.excerpt]}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t('blog.readArticle')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
