
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { SEO } from '@/components/SEO';
import AuthDialog from '@/components/auth/AuthDialog';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // Only open auth dialog if explicitly requested and not from sign-out
    if (searchParams.get('auth') === 'required' && !searchParams.get('from-signout')) {
      setIsAuthDialogOpen(true);
    }
    
    // Clear URL parameters after checking
    if (searchParams.get('auth') || searchParams.get('from-signout')) {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-background overflow-hidden">
        <Header />
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
        <Footer />
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};

export default Index;
