import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Clock, Zap, Search, Youtube, TrendingUp, PenTool, Code, Tv, Facebook, Instagram, Users, Heart, Eye, MessageCircle, Share2, Play, ArrowRight, CheckCircle, Megaphone, Monitor, Briefcase, Globe, Video, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: 'standard' | 'social_media';
  platform: string | null;
  icon: string | null;
  active: boolean;
  order_index: number;
}

const iconMap: Record<string, any> = {
  Users, Search, TrendingUp, PenTool, Code, Tv, Facebook, Heart, UserPlus, Eye
};

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [standardServices, setStandardServices] = useState<Service[]>([]);
  const [socialMediaServices, setSocialMediaServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      const services = (data || []) as Service[];
      setStandardServices(services.filter(s => s.category === 'standard'));
      setSocialMediaServices(services.filter(s => s.category === 'social_media'));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleOrderClick = () => {
    if (user) {
      navigate('/order');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  // Əsas Xidmətlər
  const mainServices = [
    {
      id: 'smm',
      name: 'SMM Xidməti',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      gradient: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      description: 'Sosial media hesablarınızın peşəkar idarəetməsi və marketinq strategiyaları',
      services: [
        'İçerik strategiyası və planlaması',
        'Sosial media hesab idarəetməsi',
        'Auditoriya analizi və targetinq',
        'Performans hesabatı və analitika'
      ],
      startPrice: '₼150'
    },
    {
      id: 'google-ads',
      name: 'Google-da Reklam',
      icon: Search,
      color: 'from-green-500 to-blue-500',
      gradient: 'from-green-50 to-blue-50',
      borderColor: 'border-green-200',
      description: 'Google Ads kampaniyaları və axtarış nəticələrində reklam yerləşdirilməsi',
      services: [
        'Google Ads kampaniya qurulması',
        'Açar söz tədqiqi və optimallaşdırma',
        'Reklam mətnlərinin hazırlanması',
        'Kampaniya performansının izlənməsi'
      ],
      startPrice: '₼200'
    },
    {
      id: 'youtube-ads',
      name: 'YouTube-da Reklam',
      icon: Youtube,
      color: 'from-red-500 to-orange-500',
      gradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      description: 'YouTube video reklamları və kanal marketinq strategiyaları',
      services: [
        'YouTube reklam kampaniyaları',
        'Video məzmun strategiyası',
        'Kanal optimallaşdırması',
        'Auditoriya targetinqi və analitika'
      ],
      startPrice: '₼180'
    },
    {
      id: 'seo',
      name: 'SEO Xidməti',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      gradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-200',
      description: 'Axtarış motorlarında saytınızın görünürlüyünün artırılması',
      services: [
        'Açar söz tədqiqi və strategiya',
        'Sayt daxili optimallaşdırma',
        'Link building və sayt xarici SEO',
        'Texniki SEO audit və düzəliş'
      ],
      startPrice: '₼120'
    },
    {
      id: 'logo',
      name: 'Loqo Hazırlanması',
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      description: 'Peşəkar loqo dizaynı və brend identikası yaradılması',
      services: [
        'Loqo konsepti və dizayn',
        'Brend identikası paketi',
        'Fərqli format və ölçülərdə çıxarış',
        'Brend rehbəri hazırlanması'
      ],
      startPrice: '₼80'
    },
    {
      id: 'web',
      name: 'Sayt Hazırlanması',
      icon: Code,
      color: 'from-blue-500 to-teal-500',
      gradient: 'from-blue-50 to-teal-50',
      borderColor: 'border-blue-200',
      description: 'Modern, responsive və funksional veb saytların yaradılması',
      services: [
        'Korporativ veb saytlar',
        'E-ticarət platformaları',
        'Mobil tətbiq inkişafı',
        'Sayt təhlükəsizliyi və hosting'
      ],
      startPrice: '₼300'
    },
    {
      id: 'tv-radio',
      name: 'TV/Radio Reklam',
      icon: Tv,
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      description: 'Televiziya və radio reklamlarının hazırlanması və yayımlanması',
      services: [
        'TV reklam çarxlarının hazırlanması',
        'Radio reklam səsləndirilməsi',
        'Media planlaması və alış',
        'Kampaniya effektivliyinin ölçülməsi'
      ],
      startPrice: '₼500'
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Reklam',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      description: 'Facebook və Instagram reklamları və sosial media marketinq',
      services: [
        'Facebook Ads kampaniya qurulması',
        'Instagram reklam strategiyası',
        'Auditoriya segmentasiyası',
        'Kreativ məzmun hazırlanması'
      ],
      startPrice: '₼160'
    }
  ];

  // Əlavə Xidmətlər
  const additionalServices = [
    {
      name: 'Instagram Engagement',
      icon: Instagram,
      services: [
        { name: 'İzləyici Artırma', icon: Users, description: 'Organik izləyici böyütmə strategiyaları', startPrice: '₼5' },
        { name: 'Bəyənmə Kampaniyası', icon: Heart, description: 'Post bəyənmələrinin artırılması', startPrice: '₼2' },
        { name: 'Baxış Artırma', icon: Eye, description: 'Story və video baxışlarının çoxaldılması', startPrice: '₼1' },
        { name: 'Şərh Strategiyası', icon: MessageCircle, description: 'Keyfiyyətli əlaqə qurma', startPrice: '₼3' }
      ]
    },
    {
      name: 'TikTok Marketinq',
      icon: Play,
      services: [
        { name: 'Auditoriya Böyütmə', icon: Users, description: 'TikTok kanalının inkişaf strategiyası', startPrice: '₼4' },
        { name: 'Video Təşviqi', icon: Heart, description: 'Video məzmununun təbliği', startPrice: '₼1.5' },
        { name: 'Görünürlük Artırma', icon: Eye, description: 'Video izləmələrinin artırılması', startPrice: '₼0.5' },
        { name: 'Viral Strategiya', icon: Share2, description: 'Məzmunun viral olma strategiyası', startPrice: '₼3' }
      ]
    },
    {
      name: 'YouTube Böyütmə',
      icon: Youtube,
      services: [
        { name: 'Kanal İnkişafı', icon: Users, description: 'Abunəçi sayının artırılması', startPrice: '₼8' },
        { name: 'Video Təbliği', icon: Eye, description: 'Video baxışlarının çoxaldılması', startPrice: '₼2' },
        { name: 'Əlaqə Artırma', icon: Heart, description: 'Video reaksiyalarının böyütməsi', startPrice: '₼3' },
        { name: 'Auditoriya Əlaqəsi', icon: MessageCircle, description: 'İzləyicilərlə əlaqə strategiyaları', startPrice: '₼5' }
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Platform Uyğunluğu',
      description: 'Bütün xidmətlərimiz sosial media platformalarının qaydalarına tam uyğundur və etik marketinq prinsiplərinə əsaslanır.',
      color: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Sürətli Nəticələr',
      description: 'Peşəkar komandamız tərəfindən həyata keçirilən strategiyalar sürətli və davamlı nəticələr təmin edir.',
      color: 'from-yellow-50 to-amber-50'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: '24/7 Dəstək',
      description: 'Müştəri məmnuniyyəti prioritetimizdir. Həftənin hər günü peşəkar dəstək xidmətindən yararlanın.',
      color: 'from-blue-50 to-sky-50'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: 'Ölçülə Bilən Nəticələr',
      description: 'Bütün kampaniyalarımızın performansını detallı hesabatlarla izləyin və ROI-nizi artırın.',
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
                Tam Spektrli Marketinq Həlləri
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Peşəkar Marketinq <span className="block">Xidmətlərimiz</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Biznesinizi növbəti səviyyəyə çıxarmaq üçün tam spektrli reklam və marketinq həlləri. Peşəkar komandamızla brendinizi güclündirin.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Main Services Section */}
        <section id="main-services" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Əsas Xidmətlərimiz
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Biznesinizi böyütmək üçün peşəkar və hərtərəfli marketinq həlləri
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {standardServices.map((service, index) => {
                const IconComponent = iconMap[service.icon || 'Users'];
                const colors = [
                  { color: 'from-pink-500 to-rose-500', gradient: 'from-pink-50 to-rose-50', border: 'border-pink-200' },
                  { color: 'from-green-500 to-blue-500', gradient: 'from-green-50 to-blue-50', border: 'border-green-200' },
                  { color: 'from-red-500 to-orange-500', gradient: 'from-red-50 to-orange-50', border: 'border-red-200' },
                  { color: 'from-blue-500 to-purple-500', gradient: 'from-blue-50 to-purple-50', border: 'border-blue-200' },
                  { color: 'from-purple-500 to-pink-500', gradient: 'from-purple-50 to-pink-50', border: 'border-purple-200' },
                  { color: 'from-blue-500 to-teal-500', gradient: 'from-blue-50 to-teal-50', border: 'border-blue-200' },
                  { color: 'from-orange-500 to-red-500', gradient: 'from-orange-50 to-red-50', border: 'border-orange-200' },
                  { color: 'from-blue-600 to-blue-800', gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200' }
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <Card key={service.id} id={service.id} className={`overflow-hidden bg-gradient-to-br ${colorScheme.gradient} ${colorScheme.border} border-2 hover:shadow-2xl transition-all duration-500 group`}>
                    <CardHeader className="text-center pb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colorScheme.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {IconComponent && <IconComponent className="h-8 w-8" />}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center mb-4">
                        {service.price ? (
                          <>
                            <span className="text-2xl font-bold text-primary">₼{service.price}</span>
                            <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                          </>
                        ) : (
                          <span className="text-lg text-muted-foreground">Qiymət sorğu ilə</span>
                        )}
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
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section id="additional" className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Əlavə Xidmətlər
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Sosial media hesablarınızın organik böyüməsi üçün tamamlayıcı xidmətlər
              </p>
            </div>

            <div className="space-y-12">
              <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:shadow-2xl transition-all duration-500">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Heart className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-foreground">Sosial Media Engagement</h3>
                      <p className="text-muted-foreground">Organik Böyümə Strategiyaları</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {socialMediaServices.map((service, serviceIndex) => {
                      const IconComponent = iconMap[service.icon || 'Heart'];
                      return (
                        <Card key={service.id} className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105 border border-white/50">
                          <CardHeader className="text-center pb-4">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              {IconComponent && <IconComponent className="h-6 w-6 text-gray-600" />}
                            </div>
                            <h4 className="text-lg font-bold text-foreground">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="mb-4">
                              {service.price ? (
                                <>
                                  <span className="text-2xl font-bold text-primary">₼{service.price}</span>
                                  <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                                </>
                              ) : (
                                <span className="text-lg text-muted-foreground">Qiymət sorğu ilə</span>
                              )}
                            </div>
                            <Button 
                              onClick={handleOrderClick}
                              size="sm"
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              Sifariş Ver
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {additionalServices.map((platform, platformIndex) => (
                <Card key={platformIndex} className="overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="text-center pb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <platform.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-foreground">{platform.name}</h3>
                        <p className="text-muted-foreground">Organik Böyümə Strategiyaları</p>
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
                              size="sm"
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              Sifariş Ver
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Brendinizi Gücləndiməyə İndi Başlayın
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Peşəkar komandamızla birlikdə biznesinizi növbəti səviyyəyə çıxarın və rəqabətdə qabaqlayın
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