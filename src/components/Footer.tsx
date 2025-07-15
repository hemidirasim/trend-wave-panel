
import { Link } from 'react-router-dom';
import { Shield, Zap, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HitLoyal
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-sm">
              Peşəkar reklam və marketinq agentliyi. Biznesinizi rəqəmsal dünyada gücləndirir, brendinizi növbəti səviyyəyə çıxarırıq. Google reklamları, SMM, SEO və digər xidmətlərlə uğurunuzu təmin edirik.
            </p>
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
