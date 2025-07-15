import { Check, Clock, Shield, RefreshCw } from 'lucide-react';

const GuaranteesSection = () => {
  const guarantees = [
    {
      icon: Check,
      title: "Nəticə Zəmanəti",
      description: "Hər sifarişdə keyfiyyətli və təsirli nəticələr zəmanət edirik"
    },
    {
      icon: Shield,
      title: "Məmnuniyyət Zəmanəti", 
      description: "Xidmətimizdən tam məmnun qalacağınıza zəmanət veririk"
    },
    {
      icon: Clock,
      title: "24/7 Müştəri Dəstəyi",
      description: "Hər zaman yanınızdayıq, istənilən sualınıza cavab veririk"
    },
    {
      icon: RefreshCw,
      title: "Pul Geri Qaytarma Zəmanəti",
      description: "Xidmətdən razı qalmadığınız halda, pulunuzu geri qaytarırıq"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Zəmanətlərimiz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Xidmətlərimizdə tam etibarlılıq və keyfiyyət üçün güclü zəmanətlər təqdim edirik
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((guarantee, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <guarantee.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {guarantee.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSection;