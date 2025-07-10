
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
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
  category: string;
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
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
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
        .order('price', { ascending: true, nullsFirst: false });

      if (error) throw error;
      
      const services = (data || []) as Service[];
      setStandardServices(services.filter(s => s.category === 'standard'));
      
      // Sosial media xidmətlərini qiymətə görə sıralayırıq (ucuzdan bahaya)
      const socialServices = services.filter(s => s.category === 'social_media');
      const sortedSocialServices = [...socialServices].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceA - priceB;
      });
      
      setSocialMediaServices(sortedSocialServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleConsultationClick = (serviceName: string) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    setSelectedService(serviceName);
    setIsConsultationDialogOpen(true);
  };

  // Əsas Xidmətlər - Genişləndirilmiş məlumatlarla
  const mainServicesDetails = {
    'SMM (Sosial Media Marketinq)': {
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      gradient: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200',
      fullDescription: 'Sosial media platformalarında brendinizin peşəkar təqdimatı və auditoriya ilə əlaqənin gücləndirilməsi üçün hərtərəfli xidmətlər.',
      detailedServices: [
        'Instagram hesabının peşəkar idarəetməsi və məzmun strategiyası',
        'Facebook səhifələrinin optimallaşdırılması və auditoriya analizi',
        'TikTok məzmun yaradıcılığı və viral strategiyalar',
        'YouTube kanalının inkişafı və video marketinq',
        'LinkedIn biznes profili idarəetməsi',
        'Twitter/X hesabının aktiv idarəetməsi',
        'Sosial media reklam kampaniyalarının hazırlanması',
        'Influencer marketinq əlaqələrinin qurulması'
      ],
      benefits: [
        'Brendin tanınırlığının artırılması',
        'Müştəri bazasının genişləndirilməsi',
        'Satışların artırılması',
        'Auditoriya ilə güclü əlaqə'
      ],
      startPrice: '₼150'
    },
    'Google/YouTube Reklamı': {
      icon: Search,
      color: 'from-green-500 to-blue-500',
      gradient: 'from-green-50 to-blue-50',
      borderColor: 'border-green-200',
      fullDescription: 'Google axtarış şəbəkəsində və YouTube platformasında hədəfli reklam kampaniyaları ilə maksimum ROI əldə edin.',
      detailedServices: [
        'Google Ads axtarış kampaniyalarının qurulması',
        'YouTube video reklamlarının hazırlanması',
        'Google Shopping reklamlarının idarəetməsi',
        'Display şəbəkəsində banner reklamları',
        'Remarketing kampaniyalarının təşkili',
        'Açar söz tədqiqi və rəqabət analizi',
        'Landing page optimallaşdırması',
        'Konversiya izləməsi və A/B testlər'
      ],
      benefits: [
        'Yüksək keyfiyyətli trafik',
        'Ölçülə bilən nəticələr',
        'Hədəfli auditoriya',
        'Sürətli geri qaytarım'
      ],
      startPrice: '₼200'
    },
    'SEO': {
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      gradient: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-200',
      fullDescription: 'Axtarış motorlarında üst sıralar üçün hərtərəfli SEO strategiyası və uzunmüddətli organik böyümə.',
      detailedServices: [
        'Texniki SEO audit və optimallaşdırma',
        'Açar söz strategiyası və məzmun planlaması',
        'On-page SEO optimallaşdırması',
        'Link building və off-page SEO',
        'Yerli SEO (Local SEO) xidmətləri',
        'E-ticarət SEO strategiyaları',
        'Sayt sürətinin optimallaşdırılması',
        'Mobil SEO və Core Web Vitals'
      ],
      benefits: [
        'Organik trafikin artırılması',
        'Uzunmüddətli nəticələr',
        'Brendin etibarının artırılması',
        'Rəqabətdə üstünlük'
      ],
      startPrice: '₼120'
    },
    'Loqo Dizaynı': {
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      fullDescription: 'Brendinizin unikallığını əks etdirən peşəkar loqo dizaynı və tam brend identikası paketi.',
      detailedServices: [
        'Orijinal loqo konsepti və dizayn',
        'Brend identikası və rəng palitri',
        'Tipoqrafiya və şrift seçimi',
        'Vizit kartı dizaynı',
        'Letterhead və korporativ materiallar',
        'Sosial media profil dizaynları',
        'Brend rehbəri (Brand Guidelines)',
        'Fərqli format və ölçülərdə hazırlıq'
      ],
      benefits: [
        'Peşəkar görünüş',
        'Brendin yadda qalması',
        'Rəqabətdə fərqlənmə',
        'Uzunmüddətli dəyər'
      ],
      startPrice: '₼80'
    },
    'Sayt Hazırlanması': {
      icon: Code,
      color: 'from-blue-500 to-teal-500',
      gradient: 'from-blue-50 to-teal-50',
      borderColor: 'border-blue-200',
      fullDescription: 'Müasir texnologiyalarla hazırlanmış, responsive və SEO-friendly veb saytlar.',
      detailedServices: [
        'Korporativ veb sayt dizaynı',
        'E-ticarət platforması inkişafı',
        'Landing page yaradılması',
        'CMS (Məzmun İdarəetmə Sistemi)',
        'Mobil tətbiq inkişafı',
        'API inteqrasiyaları',
        'SSL sertifikatı və təhlükəsizlik',
        'Hosting və domen xidmətləri'
      ],
      benefits: [
        '24/7 onlayn mövcudluq',
        'Peşəkar imidj',
        'Müştəri çıxışının artırılması',
        'Avtomatlaşdırılmış proseslər'
      ],
      startPrice: '₼300'
    },
    'TV/Radio Reklamı': {
      icon: Tv,
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      fullDescription: 'Televiziya və radio kanallarında geniş auditoriyaya çatmaq üçün peşəkar reklam kampaniyaları.',
      detailedServices: [
        'TV reklam çarxlarının hazırlanması',
        'Radio spot reklamlarının yaradılması',
        'Peşəkar səsləndirmə xidmətləri',
        'Media planlaması və kanal seçimi',
        'Yayım vaxtlarının optimallaşdırılması',
        'Kampaniya effektivliyinin ölçülməsi',
        'Kreatif konsept hazırlanması',
        'Post-produksiya xidmətləri'
      ],
      benefits: [
        'Kütləvi auditoriya',
        'Brendin tanınırlığı',
        'Emosional təsir',
        'Geniş əhatə dairəsi'
      ],
      startPrice: '₼500'
    },
    'Facebook Reklamı': {
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      fullDescription: 'Facebook və Instagram platformalarında hədəfli reklam kampaniyaları ilə maksimum geri qaytarım.',
      detailedServices: [
        'Facebook Ads kampaniya idarəetməsi',
        'Instagram reklam strategiyaları',
        'Auditoriya segmentasiyası və targetinq',
        'Kreativ məzmun hazırlanması',
        'Video reklam produksiyası',
        'Messenger reklamları',
        'Retargeting kampaniyaları',
        'Pixel quraşdırması və izləmə'
      ],
      benefits: [
        'Dəqiq hədəfləmə',
        'Yüksək ROI',
        'Geniş auditoriya',
        'Detallı analitika'
      ],
      startPrice: '₼160'
    }
  };

  // Əlavə Xidmətlər
  const additionalServices = [
    {
      name: 'Instagram Engagement',
      icon: Instagram,
      services: [
        { name: 'İzləyici Artırma', icon: Users, description: 'Organik və keyfiyyətli Instagram izləyiciləri', startPrice: '₼5', details: 'Real və aktiv hesablardan izləyicilər' },
        { name: 'Bəyənmə Kampaniyası', icon: Heart, description: 'Post bəyənmələrinin artırılması', startPrice: '₼2', details: 'Postlarınızın görünürlüyünü artırın' },
        { name: 'Baxış Artırma', icon: Eye, description: 'Story və video baxışlarının çoxaldılması', startPrice: '₼1', details: 'Məzmununuzun əhatə dairəsini genişləndirin' },
        { name: 'Şərh Strategiyası', icon: MessageCircle, description: 'Keyfiyyətli əlaqə qurma', startPrice: '₼3', details: 'Auditoriya ilə aktiv qarşılıqlı əlaqə' }
      ]
    },
    {
      name: 'TikTok Marketinq',
      icon: Play,
      services: [
        { name: 'Auditoriya Böyütmə', icon: Users, description: 'TikTok kanalının inkişaf strategiyası', startPrice: '₼4', details: 'Organik follower artımı' },
        { name: 'Video Təşviqi', icon: Heart, description: 'Video məzmununun təbliği', startPrice: '₼1.5', details: 'Videolarınızın viral olma şansını artırın' },
        { name: 'Görünürlük Artırma', icon: Eye, description: 'Video izləmələrinin artırılması', startPrice: '₼0.5', details: 'Məzmununuzun daha çox insana çatması' },
        { name: 'Viral Strategiya', icon: Share2, description: 'Məzmunun viral olma strategiyası', startPrice: '₼3', details: 'Trend məzmun yaradılması' }
      ]
    },
    {
      name: 'YouTube Böyütmə',
      icon: Youtube,
      services: [
        { name: 'Kanal İnkişafı', icon: Users, description: 'Abunəçi sayının artırılması', startPrice: '₼8', details: 'Keyfiyyətli və aktiv abunəçilər' },
        { name: 'Video Təbliği', icon: Eye, description: 'Video baxışlarının çoxaldılması', startPrice: '₼2', details: 'Videolarınızın əhatə dairəsini artırın' },
        { name: 'Əlaqə Artırma', icon: Heart, description: 'Video reaksiyalarının böyütməsi', startPrice: '₼3', details: 'Like və comment sayının artırılması' },
        { name: 'Auditoriya Əlaqəsi', icon: MessageCircle, description: 'İzləyicilərlə əlaqə strategiyaları', startPrice: '₼5', details: 'Kommentlər və community building' }
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

            <div className="space-y-16">
              {standardServices.map((service, index) => {
                const serviceDetails = mainServicesDetails[service.name as keyof typeof mainServicesDetails];
                if (!serviceDetails) return null;

                const isEven = index % 2 === 0;
                
                return (
                  <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-cols-[1fr,1fr]' : ''}`}>
                    <div className={`${!isEven ? 'order-2 lg:order-1' : 'order-1'}`}>
                      <Card className={`overflow-hidden bg-gradient-to-br ${serviceDetails.gradient} ${serviceDetails.borderColor} border-2 hover:shadow-2xl transition-all duration-500`}>
                        <CardHeader className="text-center pb-6">
                          <div className={`w-20 h-20 bg-gradient-to-br ${serviceDetails.color} rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg`}>
                            <serviceDetails.icon className="h-10 w-10" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                          <p className="text-muted-foreground">{serviceDetails.fullDescription}</p>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="text-center mb-6">
                            {service.price ? (
                              <>
                                <span className="text-3xl font-bold text-primary">₼{service.price}</span>
                                <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                              </>
                            ) : (
                              <>
                                <span className="text-3xl font-bold text-primary">{serviceDetails.startPrice}</span>
                                <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                              </>
                            )}
                          </div>
                          <Button 
                            onClick={() => handleConsultationClick(service.name)}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                            size="lg"
                          >
                            Məsləhət Alın
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className={`${!isEven ? 'order-1 lg:order-2' : 'order-2'} space-y-6`}>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-4 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Xidmət Daxilində
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {serviceDetails.detailedServices.map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-4 flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-2" />
                          Əsas Faydalar
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {serviceDetails.benefits.map((benefit, idx) => (
                            <Badge key={idx} variant="secondary" className="justify-start p-3 bg-primary/10 text-primary border-primary/20">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
                              onClick={() => handleConsultationClick(service.name)}
                              size="sm"
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              Məsləhət Alın
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
                            <p className="text-xs text-muted-foreground mt-2 italic">{service.details}</p>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="mb-4">
                              <span className="text-2xl font-bold text-primary">{service.startPrice}</span>
                              <span className="text-sm text-muted-foreground ml-1">-dan başlayır</span>
                            </div>
                            <Button 
                              onClick={() => handleConsultationClick(service.name)}
                              size="sm"
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              Məsləhət Alın
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
                onClick={() => handleConsultationClick('Ümumi Məsləhət')}
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

      {user && (
        <ConsultationDialog 
          open={isConsultationDialogOpen}
          onOpenChange={setIsConsultationDialogOpen}
          serviceName={selectedService}
        />
      )}
    </>
  );
};

export default Services;
