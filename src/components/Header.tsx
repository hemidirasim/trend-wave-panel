import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Star, Zap, User, LogOut, ChevronDown, Users, Search, TrendingUp, Palette, Globe, Tv, Facebook, Heart, UserPlus, Eye, Instagram, Youtube } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from './AuthDialog';
import { LanguageSelector } from './LanguageSelector';
import { apiService } from '@/components/ApiService';

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

interface ApiService {
  id_service: string;
  public_name: string;
  platform: string;
  type_name: string;
}

const iconMap: Record<string, any> = {
  Users, Search, TrendingUp, Palette, Globe, Tv, Facebook, Heart, UserPlus, Eye, Instagram, Youtube
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [standardServices, setStandardServices] = useState<Service[]>([]);
  const [socialMediaServices, setSocialMediaServices] = useState<ApiService[]>([]);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchSocialMediaServices();
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
      setStandardServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchSocialMediaServices = async () => {
    try {
      const services = await apiService.getServices();
      // Yalnız icazə verilən platformları göstər
      const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];
      const filteredServices = services.filter(service => 
        allowedPlatforms.includes(service.platform.toLowerCase())
      );
      
      // Hər platform üçün unikal xidmətlər al
      const uniquePlatforms = [...new Set(filteredServices.map(s => s.platform.toLowerCase()))];
      const platformServices = uniquePlatforms.map(platform => {
        const service = filteredServices.find(s => s.platform.toLowerCase() === platform);
        return service;
      }).filter(Boolean) as ApiService[];
      
      setSocialMediaServices(platformServices);
    } catch (error) {
      console.error('Error fetching social media services:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      tiktok: () => <div className="w-4 h-4 bg-current rounded-sm" />,
    };
    return icons[platform.toLowerCase()] || Heart;
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold gradient-text">HitLoyal</span>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20">
                Pro
              </Badge>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative group"
              >
                {t('header.home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              {/* Əsas Xidmətlər */}
              <div className="relative group">
                <button className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative flex items-center">
                  Əsas Xidmətlər
                  <ChevronDown className="ml-1 h-4 w-4" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3">
                    {standardServices.map((service) => {
                      const IconComponent = iconMap[service.icon || 'Users'];
                      return (
                        <Link 
                          key={service.id}
                          to={`/service/${service.id}`} 
                          className="flex items-center px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                          {IconComponent && <IconComponent className="h-4 w-4 mr-3 text-primary" />}
                          <span>{service.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sosial Media Xidmətləri */}
              <div className="relative group">
                <button className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative flex items-center">
                  Sosial Media
                  <ChevronDown className="ml-1 h-4 w-4" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3">
                    {socialMediaServices.map((service) => {
                      const IconComponent = getPlatformIcon(service.platform);
                      return (
                        <Link 
                          key={service.id_service}
                          to={`/order?platform=${service.platform.toLowerCase()}`}
                          className="flex items-center px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                          <IconComponent className="h-4 w-4 mr-3 text-primary" />
                          <span className="capitalize">{service.platform}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Link 
                to="/blog" 
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative group"
              >
                {t('header.blog')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/faq" 
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative group"
              >
                {t('header.faq')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{t('header.rating')}</span>
              </div>
              <LanguageSelector />
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/dashboard')}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t('header.dashboard')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/admin')}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {t('header.login')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Əsas Xidmətlər</h4>
                  {standardServices.map((service) => (
                    <Link 
                      key={service.id}
                      to={`/service/${service.id}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 pl-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Sosial Media</h4>
                  {socialMediaServices.map((service) => (
                    <Link 
                      key={service.id_service}
                      to={`/order?platform=${service.platform.toLowerCase()}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 pl-4 capitalize"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {service.platform}
                    </Link>
                  ))}
                </div>

                <Link 
                  to="/blog" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.blog')}
                </Link>
                <Link 
                  to="/faq" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.faq')}
                </Link>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{t('header.rating')}</span>
                    </div>
                    <LanguageSelector />
                  </div>
                  {user ? (
                    <div className="space-y-2">
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          {t('header.dashboard')}
                        </Link>
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('header.logout')}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-purple-600"
                      onClick={() => {
                        setIsAuthDialogOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      {t('header.login')}
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};
