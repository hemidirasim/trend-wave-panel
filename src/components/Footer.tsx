
import { Link } from 'react-router-dom';
import { Globe, Shield, Zap, Clock, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
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
                SocialBoost
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-sm">
              Instagram, TikTok, YouTube və Facebook üçün peşəkar SMM xidmətləri. Sosial media hesablarınızı real və keyfiyyətli şəkildə inkişaf etdirin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">SMM Xidmətləri</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-slate-300 hover:text-primary transition-colors duration-300 flex items-center">
                  Instagram Xidmətləri
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-primary transition-colors duration-300 flex items-center">
                  TikTok Xidmətləri
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-primary transition-colors duration-300 flex items-center">
                  YouTube Xidmətləri
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-primary transition-colors duration-300 flex items-center">
                  Facebook Xidmətləri
                </Link>
              </li>
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
              © 2024 SocialBoost. Bütün hüquqlar qorunur.
            </div>
            <div className="text-slate-400 text-sm">
              15,000+ müştərimizin etibar etdiyi platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
