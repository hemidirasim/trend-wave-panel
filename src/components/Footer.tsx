
import { Link } from 'react-router-dom';
import { Zap, Shield, Headphones, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold gradient-text">SocialBoost</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">{t('footer.secure')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">{t('footer.fast')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">{t('footer.support247')}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.services')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services?platform=instagram" className="text-muted-foreground hover:text-primary transition-colors duration-200">Instagram</Link></li>
              <li><Link to="/services?platform=tiktok" className="text-muted-foreground hover:text-primary transition-colors duration-200">TikTok</Link></li>
              <li><Link to="/services?platform=youtube" className="text-muted-foreground hover:text-primary transition-colors duration-200">YouTube</Link></li>
              <li><Link to="/services?platform=facebook" className="text-muted-foreground hover:text-primary transition-colors duration-200">Facebook</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.company')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('header.blog')}</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('header.faq')}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.supportSection')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors duration-200">Help Center</Link></li>
              <li><Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors duration-200">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SSL Secured</span>
              </span>
              <span>{t('footer.trustedBy')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
