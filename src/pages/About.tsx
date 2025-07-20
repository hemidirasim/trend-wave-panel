
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Users, Target, Award, Zap, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Shield,
      title: t('about.security'),
      description: t('about.securityDesc')
    },
    {
      icon: Zap,
      title: t('about.fastService'),
      description: t('about.fastServiceDesc')
    },
    {
      icon: Users,
      title: t('about.professionalTeam'),
      description: t('about.professionalTeamDesc')
    },
    {
      icon: Target,
      title: t('about.targeted'),
      description: t('about.targetedDesc')
    },
    {
      icon: Award,
      title: t('about.quality'),
      description: t('about.qualityDesc')
    },
    {
      icon: Globe,
      title: t('about.globalReach'),
      description: t('about.globalReachDesc')
    }
  ];

  const stats = [
    { number: '1,500+', label: t('about.happyCustomers') },
    { number: '10,000+', label: t('about.completedOrders') },
    { number: '99.9%', label: t('about.successRate') },
    { number: '24/7', label: t('about.supportService') }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('about.ourMission')}</h2>
            <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
              {t('about.missionText')}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.whyChooseUs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('about.companyInfo')}</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t('about.companyDescription')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.companyServices')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
