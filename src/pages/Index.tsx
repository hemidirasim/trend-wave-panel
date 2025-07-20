
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import AuthDialog from '@/components/AuthDialog';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // Əgər auth=required parametri varsa, AuthDialog-u aç
    if (searchParams.get('auth') === 'required') {
      setIsAuthDialogOpen(true);
      // URL-dən parametri təmizlə
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
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
