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
              Professional social media marketing services to boost your online presence across all major platforms.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="h-4 w-4 text-purple-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services?platform=youtube" className="hover:text-foreground transition-colors">YouTube Services</Link></li>
              <li><Link to="/services?platform=instagram" className="hover:text-foreground transition-colors">Instagram Services</Link></li>
              <li><Link to="/services?platform=tiktok" className="hover:text-foreground transition-colors">TikTok Services</Link></li>
              <li><Link to="/services?platform=facebook" className="hover:text-foreground transition-colors">Facebook Services</Link></li>
              <li><Link to="/services?platform=twitter" className="hover:text-foreground transition-colors">Twitter/X Services</Link></li>
              <li><Link to="/services?platform=telegram" className="hover:text-foreground transition-colors">Telegram Services</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/track" className="hover:text-foreground transition-colors">Track Order</Link></li>
              <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SocialBoost. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Trusted by 50,000+ customers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};