
import { useState } from 'react';
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
import AuthDialog from './AuthDialog';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.faq'), href: '/faq' },
  ];

  const mainServices = [
    { name: 'SMM Xidməti', href: '/services#smm' },
    { name: 'Google Reklamı', href: '/services#google-ads' },
    { name: 'YouTube Reklamı', href: '/services#youtube-ads' },
    { name: 'SEO Xidməti', href: '/services#seo' },
    { name: 'Loqo Hazırlanması', href: '/services#logo' },
    { name: 'Sayt Hazırlanması', href: '/services#web' },
    { name: 'TV/Radio Reklam', href: '/services#tv-radio' },
    { name: 'Facebook Reklam', href: '/services#facebook-ads' },
  ];

  const socialMediaServices = [
    { name: 'Instagram Xidmətləri', href: '/services#instagram' },
    { name: 'TikTok Marketinq', href: '/services#tiktok' },
    { name: 'YouTube Böyütmə', href: '/services#youtube-growth' },
  ];

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
            <span className="text-2xl font-bold text-primary">SocialBoost</span>
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
        
        <div className="hidden lg:flex lg:gap-x-8">
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
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-semibold leading-6 text-foreground hover:text-primary">
                  {t('nav.services')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-sm font-medium leading-none text-muted-foreground">
                        Əsas Xidmətlər
                      </h3>
                      <ul className="space-y-1">
                        {mainServices.map((service) => (
                          <li key={service.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={service.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{service.name}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium leading-none text-muted-foreground">
                        Sosial Media Xidmətləri
                      </h3>
                      <ul className="space-y-1">
                        {socialMediaServices.map((service) => (
                          <li key={service.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={service.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{service.name}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>
          
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
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold text-primary">SocialBoost</span>
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
                    {mainServices.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block rounded-lg px-6 py-2 text-sm leading-7 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-base font-semibold leading-7 text-foreground">
                      Sosial Media Xidmətləri
                    </div>
                    {socialMediaServices.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block rounded-lg px-6 py-2 text-sm leading-7 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.name}
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
