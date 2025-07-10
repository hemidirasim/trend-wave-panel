
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, CheckCircle, Star, Clock, Shield } from 'lucide-react';
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
  Users: () => <div className="w-6 h-6 bg-current rounded" />,
  Search: () => <div className="w-6 h-6 bg-current rounded" />,
  TrendingUp: () => <div className="w-6 h-6 bg-current rounded" />,
  PenTool: () => <div className="w-6 h-6 bg-current rounded" />,
  Code: () => <div className="w-6 h-6 bg-current rounded" />,
  Tv: () => <div className="w-6 h-6 bg-current rounded" />,
  Facebook: () => <div className="w-6 h-6 bg-current rounded" />,
  Heart: () => <div className="w-6 h-6 bg-current rounded" />,
  UserPlus: () => <div className="w-6 h-6 bg-current rounded" />,
  Eye: () => <div className="w-6 h-6 bg-current rounded" />
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    navigate('/faq');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yüklənir...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Xidmət tapılmadı</h1>
            <Button onClick={() => navigate('/services')}>
              Xidmətlərə qayıt
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[service.icon || 'Users'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
              <IconComponent />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {service.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {service.description}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Star className="h-4 w-4 mr-1" />
                Premium Xidmət
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="h-4 w-4 mr-1" />
                Təhlükəsiz
              </Badge>
            </div>
            <div className="text-center mb-8">
              {service.price ? (
                <>
                  <span className="text-3xl font-bold text-primary">₼{service.price}</span>
                  <span className="text-lg text-muted-foreground ml-2">-dan başlayır</span>
                </>
              ) : (
                <span className="text-2xl text-muted-foreground">Qiymət sorğu ilə</span>
              )}
            </div>
            <Button 
              onClick={handleContactClick}
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Məsləhət Alın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nə üçün Bizim Xidmətimizi Seçməlisiniz?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Keyfiyyətli Xidmət</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Peşəkar komandamız tərəfindən yüksək keyfiyyətli xidmət təminatı
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Sürətli Çatdırılma</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sifarişləriniz ən qısa müddətdə yerinə yetirilir
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Təhlükəsizlik</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    100% təhlükəsiz və etibarlı xidmət təminatı
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              İndi Başlayın
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Peşəkar xidmətimizlə biznesinizi növbəti səviyyəyə çıxarın
            </p>
            <Button 
              onClick={handleContactClick}
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Məsləhət Alın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
