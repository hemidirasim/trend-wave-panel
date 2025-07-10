
import { Link } from 'react-router-dom';
import { Globe, Shield, Zap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
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

export const Footer = () => {
  const [services, setServices] = useState<Service[]>([]);

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
      setServices((data || []) as Service[]);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                HitLoyal
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-sm">
              Peşəkar reklam və marketinq agentliyi. Biznesinizi rəqəmsal dünyada gücləndirir, brendinizi növbəti səviyyəyə çıxarırıq. Google reklamları, SMM, SEO və digər xidmətlərlə uğurunuzu təmin edirik.
            </p>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Xidmətlərimiz</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    to={`/service/${service.id}`} 
                    className="text-slate-300 hover:text-primary transition-colors duration-300 flex items-center"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Şirkət</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-primary transition-colors duration-300">
                  Bloq
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-primary transition-colors duration-300">
                  Suallar
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-primary transition-colors duration-300">
                  Qaydalar və Şərtlər
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-primary transition-colors duration-300">
                  Məxfilik Siyasəti
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Niyə Bizimlə?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Təhlükəsiz və Etibarlı</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Sürətli Xidmət</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">24/7 Dəstək</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 HitLoyal. Bütün hüquqlar qorunur. Bu sayt rəsmi olaraq Midiya Agency MMC-ə aiddir. VOEN: 6402180791
            </div>
            <div className="text-slate-400 text-sm">
              1,500+ müştərimizin etibar etdiyi platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
