
import { Link } from 'react-router-dom';
import { Zap, Shield, Headphones, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

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
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>{t('footer.secure')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{t('footer.fast')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="h-4 w-4 text-purple-500" />
                <span>{t('footer.support247')}</span>
              </div>
            </div>
          </div>

          {/* Xidmətlər */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services?platform=instagram" className="hover:text-foreground transition-colors">Instagram</Link></li>
              <li><Link to="/services?platform=tiktok" className="hover:text-foreground transition-colors">TikTok</Link></li>
              <li><Link to="/services?platform=youtube" className="hover:text-foreground transition-colors">YouTube</Link></li>
              <li><Link to="/services?platform=facebook" className="hover:text-foreground transition-colors">Facebook</Link></li>
            </ul>
          </div>

          {/* Şirkət */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-foreground transition-colors">{t('header.blog')}</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">{t('header.faq')}</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Dəstək */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.supportSection')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">Help</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/refund" className="hover:text-foreground transition-colors">Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              {t('footer.trustedBy')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
