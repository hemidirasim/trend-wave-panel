import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { ArrowRight, Star, Zap, Shield, Clock, Users, TrendingUp, Check, Sparkles, Rocket, Globe, Target, BarChart3, BookOpen, Award, Megaphone, Search, Youtube, Lightbulb, PenTool, Code, Radio, Video, Facebook, Instagram, Monitor, Briefcase, Tv, Heart, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  platform: string | null;
  icon: string | null;
  active: boolean;
  order_index: number;
}

const iconMap: Record<string, any> = {
  Users, Search, TrendingUp, PenTool, Code, Tv, Facebook, Heart, UserPlus, Eye
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .eq('category', 'standard')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setDynamicServices((data || []) as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    // Əgər auth=required parametri varsa, AuthDialog-u aç
    if (searchParams.get('auth') === 'required') {
      setIsAuthDialogOpen(true);
      // URL-dən parametri təmizlə
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const features = [
    {
      icon: <Target className="h-8 w-8 text-yellow-500" />,
      title: 'Sürətli və Keyfiyyətli',
      description: 'Real istifadəçilərlə işləyərək sosial media hesablarınızı sürətli və təhlükəsiz şəkildə inkişaf etdiririk.',
      gradient: 'from-yellow-100 to-amber-100'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: '24/7 Dəstək Xidməti',
      description: 'Peşəkar müştəri dəstəyi komandamız həftənin 7 günü sizin xidmətinizdədir.',
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: 'Təhlükəsiz Ödəniş',
      description: 'Bütün ödənişləriniz SSL şifrələməsi ilə qorunur və müxtəlif ödəniş üsullarını dəstəkləyirik.',
      gradient: 'from-blue-100 to-sky-100'
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: 'Zəmanət və Keyfiyyət',
      description: 'Bütün xidmətlərimiz 100% zəmanətlidir və keyfiyyət standartlarımıza uyğundur.',
      gradient: 'from-purple-100 to-violet-100'
    }
  ];

  const stats = [
    { number: "50K+", label: "Tamamlanmış Sifarişlər", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "15K+", label: "Məmnun Müştərilər", icon: <Target className="h-6 w-6" /> },
    { number: "98%", label: "Müştəri Məmnuniyyəti", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Dəstək Xidməti", icon: <Clock className="h-6 w-6" /> }
  ];

  return (
    <>
      <div className="min-h-screen bg-background overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="animate-fade-in">
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  #1 SMM Xidmətləri Platforması
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  HitLoyal ilə Brendinizi Güclündirin
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                  İşlərinizi böyütmək üçün peşəkar sosial media marketinq strategiyaları. Organik böyümə və etik yanaşma ilə brendinizi müasir rəqabət mühitində güclündirin.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link to="/services">
                      <Rocket className="mr-2 h-5 w-5" />
                      İndi Başla
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10">
                    <div className="flex justify-center mb-3 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-2xl"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-primary/20">
                <Target className="h-4 w-4 mr-2" />
                Platform Mütəxəssisliyi
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Əsas Xidmətlərimiz
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Biznesinizi böyütmək üçün tam spektrli reklam və marketinq həlləri
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {dynamicServices.map((service, index) => {
                const IconComponent = iconMap[service.icon || 'Users'];
                const colors = [
                  'from-pink-500 to-rose-500',
                  'from-green-500 to-blue-500', 
                  'from-red-500 to-orange-500',
                  'from-blue-500 to-purple-500',
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-teal-500',
                  'from-orange-500 to-red-500',
                  'from-blue-600 to-blue-800'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <Card key={service.id} className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-primary/10 hover:border-primary/20 hover:scale-105">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        {IconComponent && <IconComponent className="h-8 w-8" />}
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6 text-center">
                        {service.description}
                      </p>
                      <Button asChild className="w-full transition-all duration-300" variant="default">
                        <Link to={`/service/${service.id}`}>
                          Ətraflı Məlumat
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Niyə HitLoyal?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Sübut olunmuş strategiyalar və peşəkar yanaşma ilə sosial media hesablarınızı güclü şəkildə inkişaf etdirin
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
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

export default Index;
