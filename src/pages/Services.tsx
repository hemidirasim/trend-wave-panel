import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Clock, Zap, Instagram, Youtube, Facebook, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Play, ArrowRight, CheckCircle } from 'lucide-react';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOrderClick = () => {
    if (user) {
      navigate('/order');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-rose-500',
      gradient: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      services: [
        { name: 'Auditoriya Artırma', icon: Users, description: 'Organik təsir edən marketinq strategiyaları', startPrice: '₼5' },
        { name: 'Məzmun Təşviqi', icon: Heart, description: 'Məzmunun yayılması və təbliği', startPrice: '₼2' },
        { name: 'Baxış Artırma', icon: Eye, description: 'Video və story məzmununun təbliği', startPrice: '₼1' },
        { name: 'Münasibət Yaratma', icon: MessageCircle, description: 'Auditoriya ilə əlaqə qurma', startPrice: '₼3' }
      ]
    },
    {
      name: 'TikTok',
      icon: Play,
      color: 'from-purple-500 to-indigo-500',
      gradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      services: [
        { name: 'Auditoriya Genişləndirilməsi', icon: Users, description: 'TikTok kanalının təbliği və inkişafı', startPrice: '₼4' },
        { name: 'Video Təşviqi', icon: Heart, description: 'Video məzmununun təşviqi və yayılması', startPrice: '₼1.5' },
        { name: 'İzləmə Artırma', icon: Eye, description: 'Video məzmununun görünürlüyünün artırılması', startPrice: '₼0.5' },
        { name: 'Paylaşım Strategiyası', icon: Share2, description: 'Məzmun paylaşımı və viral strategiyalar', startPrice: '₼3' }
      ]
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'from-red-500 to-orange-500',
      gradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      services: [
        { name: 'Kanal İnkişafı', icon: Users, description: 'YouTube kanalının organik böyüməsi', startPrice: '₼8' },
        { name: 'Video Təbliği', icon: Eye, description: 'Video məzmununun təşviqi və yayılması', startPrice: '₼2' },
        { name: 'Məzmun Dəstəyi', icon: Heart, description: 'Video məzmununun dəstəklənməsi', startPrice: '₼3' },
        { name: 'Auditoriya Əlaqəsi', icon: MessageCircle, description: 'İzləyicilərlə əlaqə strategiyaları', startPrice: '₼5' }
      ]
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      services: [
        { name: 'Səhifə Marketinqi', icon: Heart, description: 'Facebook biznes səhifələrinin təbliği', startPrice: '₼6' },
        { name: 'Məzmun Dəstəyi', icon: Heart, description: 'Post məzmununun təşviqi', startPrice: '₼2' },
        { name: 'Viral Strategiya', icon: Share2, description: 'Məzmunun yayılması strategiyası', startPrice: '₼4' },
        { name: 'Auditoriya Böyütmə', icon: Users, description: 'Səhifə auditoriyasının artırılması', startPrice: '₼7' }
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Platform Uyğunluğu',
      description: 'Bütün marketinq strategiyalarımız sosial media platformalarının Terms of Service qaydalarına tam uyğundur.',
      color: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Sürətli Çatdırılma',
      description: 'Sifarişləriniz 24 saat ərzində başlayır və sürətlə tamamlanır.',
      color: 'from-yellow-50 to-amber-50'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: '24/7 Dəstək',
      description: 'Peşəkar müştəri dəstəyi komandamız həftənin 7 günü xidmətinizdədir.',
      color: 'from-blue-50 to-sky-50'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: 'Real Nəticələr',
      description: 'Yalnız real və aktiv istifadəçilərlə işləyirik. Heç bir bot və ya saxta hesab yoxdur.',
      color: 'from-purple-50 to-violet-50'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-primary/20">
                <Star className="h-4 w-4 mr-2" />
                Peşəkar SMM Xidmətləri
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Peşəkar SMM <span className="block">Marketinq Xidmətləri</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                İşinizi böyütmək üçün peşəkar sosial media marketinq strategiyaları. Organik inkişaf və real auditoriya cəlbi ilə brendinizi gücləndirik.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br ${feature.color} border-0`}>
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/80 flex items-center justify-center shadow-md">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Platformlar və Xidmətlər
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hər bir platforma üçün xüsusi dizayn edilmiş xidmətlər
              </p>
            </div>

            <div className="space-y-12">
              {platforms.map((platform, platformIndex) => (
                <Card key={platformIndex} className={`overflow-hidden bg-gradient-to-br ${platform.gradient} ${platform.borderColor} border-2 hover:shadow-2xl transition-all duration-500`}>
                  <CardHeader className="text-center pb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                        <platform.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-foreground">{platform.name}</h3>
                        <p className="text-muted-foreground">Peşəkar SMM Xidmətləri</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {platform.services.map((service, serviceIndex) => (
                        <Card key={serviceIndex} className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105 border border-white/50">
                          <CardHeader className="text-center pb-4">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <service.icon className="h-6 w-6 text-gray-600" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-primary">{service.startPrice}</span>
                              <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                            </div>
                            <Button 
                              onClick={handleOrderClick}
                              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                            >
                              Sifariş Ver
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Niyə HitLoyal?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Bizim üstünlüklərimiz və sizə təqdim etdiyimiz dəyər
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Etik Marketinq Yanaşması',
                  description: 'Bütün strategiyalarımız etik marketinq prinsiplərinə əsaslanır və organik böyümə təmin edir.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  title: 'Sürətli Çatdırılma',
                  description: 'Sifarişləriniz maksimum 24 saat ərzində başlayır və qısa müddətdə tamamlanır.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  title: 'Gizlilik və Təhlükəsizlik',
                  description: 'Şifrənizi və ya giriş məlumatlarınızı heç vaxt tələb etmirik. Tam təhlükəsizlik zəmanəti.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  title: '24/7 Müştəri Dəstəyi',
                  description: 'Peşəkar müştəri dəstəyi komandamız həftənin 7 günü sizin xidmətinizdədir.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  title: 'Geri Qaytarma Zəmanəti',
                  description: 'Xidmət təqdim edilməyibsə və ya keyfiyyət aşağıdırsa, 30 gün ərzində tam geri qaytarma.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                },
                {
                  title: 'Münasib Qiymətlər',
                  description: 'Bazardakı ən münasib qiymətlərlə yüksək keyfiyyətli xidmətlər təqdim edirik.',
                  icon: <CheckCircle className="h-6 w-6 text-green-500" />
                }
              ].map((benefit, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sosial Media Uğurunuza İndi Başlayın
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Minlərlə məmnun müştərimizə qoşulun və sosial media hesablarınızı növbəti səviyyəyə çıxarın
              </p>
              <Button 
                onClick={handleOrderClick}
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                İndi Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
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

export default Services;