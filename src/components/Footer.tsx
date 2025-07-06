
import { Link } from 'react-router-dom';
import { Zap, Shield, Headphones, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">SocialBoost</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Sosial media hesablarınızı gücləndirecək peşəkar SMM xidmətləri. Bütün əsas platformlar üçün keyfiyyətli həllər.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Təhlükəsiz</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Sürətli</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="h-4 w-4 text-purple-500" />
                <span>24/7 Dəstək</span>
              </div>
            </div>
          </div>

          {/* Xidmətlər */}
          <div className="space-y-4">
            <h3 className="font-semibold">Xidmətlər</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services?platform=instagram" className="hover:text-foreground transition-colors">Instagram Xidmətləri</Link></li>
              <li><Link to="/services?platform=tiktok" className="hover:text-foreground transition-colors">TikTok Xidmətləri</Link></li>
              <li><Link to="/services?platform=youtube" className="hover:text-foreground transition-colors">YouTube Xidmətləri</Link></li>
              <li><Link to="/services?platform=facebook" className="hover:text-foreground transition-colors">Facebook Xidmətləri</Link></li>
            </ul>
          </div>

          {/* Şirkət */}
          <div className="space-y-4">
            <h3 className="font-semibold">Şirkət</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Bloq</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">Haqqımızda</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Əlaqə</Link></li>
            </ul>
          </div>

          {/* Dəstək */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dəstək</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">Yardım Mərkəzi</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">İstifadə Şərtləri</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Məxfilik Siyasəti</Link></li>
              <li><Link to="/refund" className="hover:text-foreground transition-colors">Geri Qaytarma</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SocialBoost. Bütün hüquqlar qorunur.
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              50,000+ məmnun müştəri tərəfindən güvənilir
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
