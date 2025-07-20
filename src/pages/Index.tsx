
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
      <div className="bg-background overflow-hidden">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};

export default Index;
