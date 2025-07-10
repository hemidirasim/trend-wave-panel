
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, BarChart3, BookOpen, Award } from 'lucide-react';

export const FeaturesSection = () => {
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

  return (
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
  );
};
