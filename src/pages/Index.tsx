
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import { ArrowRight, Star, Zap, Shield, Clock, Users, TrendingUp, Check, Sparkles, Rocket, Globe, Target, BarChart3, BookOpen, Award } from 'lucide-react';
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
      services: ['Growth Strategy', 'Analytics', 'Content Planning'],
      icon: '📸'
    },
    { 
      name: 'TikTok', 
      color: 'from-purple-500 to-indigo-500', 
      services: ['Trend Analysis', 'Audience Insights', 'Performance Tracking'],
      icon: '🎵'
    },
    { 
      name: 'YouTube', 
      color: 'from-red-500 to-orange-500', 
      services: ['Channel Growth', 'SEO Optimization', 'Analytics Dashboard'],
      icon: '📺'
    },
    { 
      name: 'Facebook', 
      color: 'from-blue-500 to-cyan-500', 
      services: ['Page Management', 'Audience Building', 'Engagement Strategy'],
      icon: '👥'
    },
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8 text-yellow-500" />,
      title: 'Strategic Growth Planning',
      description: 'Develop comprehensive social media strategies tailored to your brand and audience for sustainable growth.',
      gradient: 'from-yellow-100 to-amber-100'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your performance with comprehensive analytics and reporting tools.',
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: 'Educational Resources',
      description: 'Access expert guides, tutorials, and best practices to master social media marketing.',
      gradient: 'from-blue-100 to-sky-100'
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: 'Expert Consultation',
      description: 'Get personalized advice from social media experts to optimize your growth strategy.',
      gradient: 'from-purple-100 to-violet-100'
    }
  ];

  const stats = [
    { number: "10K+", label: "Successful Projects", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "500+", label: "Growth Strategies", icon: <Target className="h-6 w-6" /> },
    { number: "95%", label: "Client Success Rate", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Expert Support", icon: <Clock className="h-6 w-6" /> }
  ];

  return (
    <>
      <div className="min-h-screen bg-background overflow-hidden">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-variant/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="animate-fade-in">
                <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm font-semibold glass-effect">
                  <Sparkles className="h-4 w-4 mr-2" />
                  #1 Social Media Growth Platform
                </Badge>
                <h1 className="text-6xl md:text-8xl font-bold mb-10 gradient-text leading-tight animate-scale-in">
                  Master Your Social Media Growth with HitLoyal
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
                  Professional social media growth platform offering strategic guidance, analytics, and expert consultation for Instagram, TikTok, YouTube, and Facebook. Build your authentic online presence with proven strategies.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                  <Button asChild size="lg" className="text-lg px-10 py-5 gradient-bg hover-lift modern-shadow text-white font-semibold rounded-2xl">
                    <Link to="/services">
                      <Rocket className="mr-3 h-5 w-5" />
                      Start Your Journey
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="glass-effect rounded-3xl p-8 modern-shadow hover-lift">
                    <div className="flex justify-center mb-4 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
                Platform Expertise
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
                Specialized growth strategies and tools for each major social media platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {platforms.map((platform, index) => (
                <Card key={index} className="glass-effect modern-shadow hover-lift cursor-pointer group rounded-3xl border-0">
                  <CardHeader className="text-center pb-6">
                    <div className={`w-24 h-24 bg-gradient-to-r ${platform.color} rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-4xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 modern-shadow`}>
                      {platform.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {platform.services.map((service, idx) => (
                        <div key={idx} className="flex items-center text-muted-foreground">
                          <Check className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                          <span className="font-semibold">{service}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full gradient-bg hover-lift text-white font-semibold rounded-2xl py-3" variant="default">
                      <Link to={`/services?platform=${platform.name.toLowerCase()}`}>
                        Explore Tools
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
        <section className="py-28 bg-gradient-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
                Why Choose HitLoyal?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
                Comprehensive social media growth platform with expert guidance and proven strategies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, index) => (
                <Card key={index} className="text-center glass-effect modern-shadow hover-lift group rounded-3xl border-0">
                  <CardHeader className="pb-6">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 modern-shadow`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed font-medium">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero"></div>
          <div className="absolute inset-0 bg-background/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Card className="glass-effect modern-shadow-xl rounded-3xl border-white/20">
              <CardContent className="text-center py-24">
                <div className="mb-10">
                  <Globe className="h-24 w-24 mx-auto text-white mb-8 animate-scale-in" />
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
                  Ready to Transform Your Social Media Presence?
                </h2>
                <p className="text-xl mb-14 max-w-4xl mx-auto text-white/90 leading-relaxed font-medium">
                  Join thousands of creators and businesses who trust HitLoyal to guide their social media growth journey. Start building your authentic online presence today!
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-5 bg-white text-primary hover:bg-white/90 modern-shadow hover-lift font-semibold rounded-2xl">
                    <Link to="/services">
                      <Target className="mr-3 h-5 w-5" />
                      Explore Services
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-5 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm hover-lift font-semibold rounded-2xl"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Get Started
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
