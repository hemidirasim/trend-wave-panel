
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookText, Calendar, User, ArrowRight, TrendingUp, Target, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Instagram Takipçi Artırmanın 10 Effektiv Yolu",
      excerpt: "Instagram hesabınızda organik takipçi artırmaq üçün ən effektiv strategiyalar və məsləhətlər...",
      author: "SocialBoost Team",
      date: "5 Yanvar 2024",
      category: "Instagram",
      readTime: "8 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "TikTok Algoritmi: Viral Olmaq üçün Gizli Formullar",
      excerpt: "TikTok alqoritminin necə işlədiyi və virallaşmaq üçün lazım olan əsas faktorlar...",
      author: "Digital Ekspert",
      date: "3 Yanvar 2024",
      category: "TikTok",
      readTime: "6 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "YouTube SEO: Videoları Axtarışda Üstə Çıxarmaq",
      excerpt: "YouTube videolarınızı axtarış nəticələrində üst sıralarda göstərmək üçün SEO strategiyaları...",
      author: "SEO Mütəxəssis",
      date: "1 Yanvar 2024",
      category: "YouTube",
      readTime: "10 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Facebook Marketinq: Biznes üçün Effektiv Strategiyalar",
      excerpt: "Facebook platformasında biznesinizi genişləndirmək və müştəri cəlb etmək üçün praktik məsləhətlər...",
      author: "Marketing Guru",
      date: "30 Dekabr 2023",
      category: "Facebook",
      readTime: "7 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Sosial Media Analitikası: KPI-ları Necə İzləmək Lazımdır",
      excerpt: "Sosial media kampaniyalarınızın effektivliyini ölçmək üçün vacib olan göstəricilər və analiz metodları...",
      author: "Data Analisti",
      date: "28 Dekabr 2023",
      category: "Analytics",
      readTime: "12 dəq",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "İnfluencer Marketinq: Uğurlu Əməkdaşlıq Qurmanın Yolları",
      excerpt: "İnfluencerlərlə effektiv əməkdaşlıq qurmaq və kampaniya ROI-sini artırmaq üçün strategiyalar...",
      author: "Brend Meneceri",
      date: "25 Dekabr 2023",
      category: "Marketing",
      readTime: "9 dəq",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["Hamısı", "Instagram", "TikTok", "YouTube", "Facebook", "Marketing", "Analytics"];
  const [selectedCategory, setSelectedCategory] = useState("Hamısı");

  const filteredPosts = selectedCategory === "Hamısı" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
            SMM <span className="text-primary">Bloqu</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sosial media marketinqi, strategiya və trendlər haqqında ən son məqalələr
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Ən Son Trendlər</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sosial media dünyasındakı ən yeni trendlər və yeniliklər
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Praktik Məsləhətlər</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dərhal tətbiq edə biləcəyiniz effektiv strategiyalar
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Analiz və İstatistika</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Rəqəmlərlə dəstəklənən dərin analiz və tövsiyələr
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
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
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <Badge variant="secondary">{post.readTime}</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Məqaləni Oxu
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                SocialBoost ilə Uğura Başlayın!
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Bloqdakı strategiyaları öyrəndin? İndi onları tətbiq etmək vaxtıdır!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg">
                  <Link to="/services">
                    Xidmətlərə Bax
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg border-white text-white hover:bg-white hover:text-primary"
                >
                  Newsletter-ə Qoşul
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
