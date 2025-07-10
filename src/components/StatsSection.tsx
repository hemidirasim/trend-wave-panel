
import { TrendingUp, Target, Star, Clock } from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    { number: "50K+", label: "Tamamlanmış Sifarişlər", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "15K+", label: "Məmnun Müştərilər", icon: <Target className="h-6 w-6" /> },
    { number: "98%", label: "Müştəri Məmnuniyyəti", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Dəstək Xidməti", icon: <Clock className="h-6 w-6" /> }
  ];

  return (
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
  );
};
