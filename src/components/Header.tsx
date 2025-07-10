
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Star, Zap, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthDialog from './AuthDialog';
import { LanguageSelector } from './LanguageSelector';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
              <div className="relative group">
                <button className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative flex items-center">
                  {t('header.services')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link to="/services" className="block px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
                      Reklam və Marketinq
                    </Link>
                    <Link to="/services#web" className="block px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
                      Veb Dizayn
                    </Link>
                    <Link to="/services#brand" className="block px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
                      Brend Xidmətləri
                    </Link>
                    <Link to="/services#additional" className="block px-3 py-2 text-sm hover:bg-muted rounded transition-colors">
                      Əlavə Xidmətlər
                    </Link>
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
                <Link 
                  to="/services" 
                  className="text-foreground hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.services')}
                </Link>
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
