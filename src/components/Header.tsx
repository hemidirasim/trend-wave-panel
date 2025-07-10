
import { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { proxyApiService, Service } from './ProxyApiService';
import AuthDialog from './AuthDialog';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [apiServices, setApiServices] = useState<Service[]>([]);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.faq'), href: '/faq' },
  ];

  useEffect(() => {
    // Fetch services from database
    const fetchDbServices = async () => {
      try {
        const { data: services, error } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .eq('category', 'standard')
          .order('order_index');
        
        if (error) throw error;
        setDbServices(services || []);
      } catch (error) {
        console.error('Error fetching database services:', error);
      }
    };

    // Fetch services from API and group by platform
    const fetchApiServices = async () => {
      try {
        const services = await proxyApiService.getServices();
        // Filter for social media platforms
        const socialServices = services.filter(service => 
          ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter'].some(platform => 
            service.platform?.toLowerCase().includes(platform)
          )
        );
        setApiServices(socialServices);
      } catch (error) {
        console.error('Error fetching API services:', error);
      }
    };

    fetchDbServices();
    fetchApiServices();
  }, []);

  // Get unique platforms from API services
  const socialPlatforms = [...new Set(apiServices.map(service => service.platform).filter(Boolean))]
    .slice(0, 8); // Limit to 8 platforms

  const isActive = (href: string) => location.pathname === href;

  const toggleLanguage = () => {
    const newLang = language === 'az' ? 'en' : 'az';
    setLanguage(newLang);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-primary">hitloyal</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:items-center lg:gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-semibold leading-6 transition-colors hover:text-primary ${
                isActive(item.href) ? 'text-primary' : 'text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-semibold leading-6 text-foreground hover:text-primary bg-transparent border-none shadow-none">
                  {t('nav.services')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4 bg-popover border border-border shadow-lg rounded-md">
                    <h3 className="mb-2 text-sm font-medium leading-none text-muted-foreground">
                      Əsas Xidmətlər
                    </h3>
                    <ul className="space-y-1">
                      {dbServices.map((service) => (
                        <li key={service.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/service/${service.id}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-semibold leading-6 text-foreground hover:text-primary bg-transparent border-none shadow-none">
                  Sosial Media
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[300px] p-4 bg-popover border border-border shadow-lg rounded-md">
                    <h3 className="mb-2 text-sm font-medium leading-none text-muted-foreground">
                      Sosial Şəbəkələr
                    </h3>
                    <ul className="space-y-1">
                      {socialPlatforms.map((platform) => (
                        <li key={platform}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/order?platform=${platform.toLowerCase()}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none capitalize">{platform}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">{user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                {t('nav.signOut')}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthDialog(true)} size="sm">
              {t('nav.signIn')}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold text-primary">hitloyal</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-muted ${
                        isActive(item.href) ? 'text-primary bg-muted' : 'text-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                   <div className="space-y-1">
                     <div className="px-3 py-2 text-base font-semibold leading-7 text-foreground">
                       Əsas Xidmətlər
                     </div>
                     {dbServices.map((service) => (
                       <Link
                         key={service.id}
                         to={`/service/${service.id}`}
                         className="block rounded-lg px-6 py-2 text-sm leading-7 text-muted-foreground hover:bg-muted hover:text-foreground"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         {service.name}
                       </Link>
                     ))}
                   </div>
                   
                   <div className="space-y-1">
                     <div className="px-3 py-2 text-base font-semibold leading-7 text-foreground">
                       Sosial Şəbəkələr
                     </div>
                     {socialPlatforms.map((platform) => (
                       <Link
                         key={platform}
                         to={`/order?platform=${platform.toLowerCase()}`}
                         className="block rounded-lg px-6 py-2 text-sm leading-7 text-muted-foreground hover:bg-muted hover:text-foreground capitalize"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         {platform}
                       </Link>
                     ))}
                   </div>
                </div>
                <div className="py-6 space-y-4">
                  <Button
                    variant="ghost"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 w-full justify-start"
                  >
                    <Globe className="h-4 w-4" />
                    {language.toUpperCase()}
                  </Button>
                  
                  {user ? (
                    <div className="space-y-2">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t('nav.dashboard')}
                        </Button>
                      </Link>
                      <Button onClick={handleSignOut} variant="ghost" className="w-full">
                        {t('nav.signOut')}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setShowAuthDialog(true);
                        setIsMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      {t('nav.signIn')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </header>
  );
};
