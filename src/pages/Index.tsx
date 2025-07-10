
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { ArrowRight, Star, Zap, Shield, Clock, Users, TrendingUp, Check, Sparkles, Rocket, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Əgər auth=required parametri varsa, AuthDialog-u aç
    if (searchParams.get('auth') === 'required') {
      setIsAuthDialogOpen(true);
      // URL-dən parametri təmizlə
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const platforms = [
    { 
      name: 'Instagram', 
      color: 'from-pink-500 to-rose-500', 
      services: ['Followers', 'Likes', 'Views'],
      icon: '📸'
    },
    { 
      name: 'TikTok', 
      color: 'from-purple-500 to-indigo-500', 
      services: ['Followers', 'Likes', 'Views'],
      icon: '🎵'
    },
    { 
      name: 'YouTube', 
      color: 'from-red-500 to-orange-500', 
      services: ['Subscribers', 'Views', 'Likes'],
      icon: '📺'
    },
    { 
      name: 'Facebook', 
      color: 'from-blue-500 to-cyan-500', 
      services: ['Likes', 'Followers', 'Shares'],
      icon: '👥'
    },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: t('features.fast'),
      description: t('features.fastDesc'),
      gradient: 'from-yellow-100 to-amber-100'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: t('features.secure'),
      description: t('features.secureDesc'),
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: t('features.support'),
      description: t('features.supportDesc'),
      gradient: 'from-blue-100 to-sky-100'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: t('features.quality'),
      description: t('features.qualityDesc'),
      gradient: 'from-purple-100 to-violet-100'
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "1M+", label: "Orders Completed", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "99.9%", label: "Customer Satisfaction", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="h-6 w-6" /> }
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
                  #1 Social Media Growth Service
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  Grow Your Social Media with HitLoyal
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                  Professional social media marketing services for Instagram, TikTok, YouTube, and Facebook. Get real followers, likes, and engagement to boost your online presence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link to="/services">
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Growing Now
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
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('platforms.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('platforms.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platforms.map((platform, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 bg-gradient-to-r ${platform.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      {platform.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {platform.services.map((service, idx) => (
                        <div key={idx} className="flex items-center text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="font-medium">{service}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full bg-gradient-to-r from-primary/90 to-purple-600/90 hover:from-primary hover:to-purple-600 transition-all duration-300" variant="default">
                      <Link to={`/services?platform=${platform.name.toLowerCase()}`}>
                        {t('platforms.viewServices')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-muted/20 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('features.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('features.subtitle')}
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

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="text-center py-20">
                <div className="mb-8">
                  <TrendingUp className="h-20 w-20 mx-auto text-white mb-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Go Viral?
                </h2>
                <p className="text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
                  Join thousands of creators and businesses who trust HitLoyal to grow their social media presence. Start your journey to social media success today!
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <Link to="/services">
                      <Zap className="mr-2 h-5 w-5" />
                      Order Now
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Create Account
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
