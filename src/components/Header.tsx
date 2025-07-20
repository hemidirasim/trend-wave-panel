import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { proxyApiService, Service } from './ProxyApiService';
import AuthDialog from './AuthDialog';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [apiServices, setApiServices] = useState<Service[]>([]);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Haqqımızda', href: '/about' },
    { name: t('nav.blog'), href: '/blog' },
    { name: 'Əlaqə', href: '/contact' },
  ];

  useEffect(() => {
    // Fetch services from API and group by platform
    const fetchApiServices = async () => {
      try {
        const services = await proxyApiService.getServices();
        // Filter for social media platforms (without Twitter)
        const socialServices = services.filter(service => 
          ['instagram', 'tiktok', 'youtube', 'facebook'].some(platform => 
            service.platform?.toLowerCase().includes(platform)
          )
        );
        setApiServices(socialServices);
      } catch (error) {
        console.error('Error fetching API services:', error);
      }
    };

    fetchApiServices();
  }, []);

  // Get unique platforms from API services
  const socialPlatforms = [...new Set(apiServices.map(service => service.platform).filter(Boolean))]
    .slice(0, 8); // Limit to 8 platforms

  const isActive = (href: string) => location.pathname === href;

  const toggleLanguage = () => {
    const newLang = language === 'az' ? 'az' : 'az';
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
    <>
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HitLoyal
              </span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-semibold leading-6 text-foreground hover:text-primary">
                  Sosial Media
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg">
                <div className="p-2">
                  <h3 className="mb-2 text-sm font-medium leading-none text-muted-foreground">
                    Hesab
                  </h3>
                  {socialPlatforms.map((platform) => (
                    <DropdownMenuItem key={platform} asChild>
                      <Link
                        to={`/order?platform=${platform.toLowerCase()}`}
                        className="block w-full text-left px-2 py-1.5 text-sm capitalize cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {platform}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            {user ? (
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
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setIsMenuOpen(false)}>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HitLoyal
                </span>
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
                   <div className="space-y-1">
                     <div className="px-3 py-2 text-base font-semibold leading-7 text-foreground">
                       Hesab
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
    </>
  );
};
