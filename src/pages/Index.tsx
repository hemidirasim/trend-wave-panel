
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { ArrowRight, Star, Zap, Shield, Clock, Users, TrendingUp, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // Əgər auth=required parametri varsa, AuthDialog-u aç
    if (searchParams.get('auth') === 'required') {
      setIsAuthDialogOpen(true);
      // URL-dən parametri təmizlə
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const platforms = [
    { name: 'Instagram', color: 'bg-pink-500', services: ['Followers', 'Likes', 'Views'] },
    { name: 'TikTok', color: 'bg-purple-500', services: ['Followers', 'Likes', 'Views'] },
    { name: 'YouTube', color: 'bg-red-500', services: ['Subscribers', 'Views', 'Likes'] },
    { name: 'Facebook', color: 'bg-blue-500', services: ['Likes', 'Followers', 'Shares'] },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Sürətli Çatdırılma",
      description: "Sifarişlər 24 saat ərzində başlayır və tez bir zamanda tamamlanır"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Təhlükəsiz Xidmət",
      description: "100% təhlükəsiz və etibarlı xidmətlər, hesabınız üçün heç bir risk yoxdur"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "24/7 Dəstək",
      description: "Hər zaman əlçatan müştəri dəstəyi və peşəkar kömək"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Keyfiyyətli Takipçilər",
      description: "Real və aktiv istifadəçilərdən ibarət keyfiyyətli takipçilər"
    }
  ];

  const stats = [
    { number: "50K+", label: "Məmnun Müştəri" },
    { number: "1M+", label: "Tamamlanmış Sifariş" },
    { number: "99.9%", label: "Müştəri Məmnuniyyəti" },
    { number: "24/7", label: "Dəstək Xidməti" }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                Ən Yaxşı SMM Paneli
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sosial Media{' '}
                <span className="text-primary">Artımınız</span>{' '}
                Burada Başlayır
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Instagram, TikTok, YouTube və Facebook üçün ən keyfiyyətli və uygun qiymətli 
                SMM xidmətləri. Takipçi, bəyənmə və baxış sayınızı artırın!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/services">
                    İndi Başlayın
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsAuthDialogOpen(true)}>
                  Hesab Yaradın
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Dəstəklənən <span className="text-primary">Platformlar</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ən populyar sosial media platformları üçün geniş xidmət çeşidi
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${platform.color} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform`}>
                      {platform.name.charAt(0)}
                    </div>
                    <CardTitle className="text-xl">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {platform.services.map((service, idx) => (
                        <div key={idx} className="flex items-center text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {service}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link to={`/services?platform=${platform.name.toLowerCase()}`}>
                        Xidmətlərə Bax
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Niyə <span className="text-primary">SocialBoost</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bizim üstünlüklərimiz və sizə təqdim etdiyimiz keyfiyyətli xidmətlər
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <CardContent className="text-center py-16">
                <TrendingUp className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Sosial Media Artımınızı İndi Başladın!
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Minlərlə məmnun müştərimizə qoşulun və sosial media hesablarınızı 
                  yeni səviyyəyə çıxarın. İlk sifarişinizdə 10% endirim!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="text-lg">
                    <Link to="/services">
                      İndi Sifariş Verin
                      <Zap className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg border-white text-white hover:bg-white hover:text-primary"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    Qeydiyyatdan Keçin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};

export default Index;
