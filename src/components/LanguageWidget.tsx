import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageWidget = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Remove any existing widget scripts
    const existingScripts = document.querySelectorAll('script[src*="widget-js"]');
    existingScripts.forEach(script => script.remove());

    // Load appropriate script based on current language
    let scriptSrc = '';
    
    if (language === 'az') {
      // Azerbaijani version
      scriptSrc = 'https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/96512d35-bc30-409c-b4bd-db0e0915f746';
    } else if (language === 'tr') {
      // Turkish version  
      scriptSrc = 'https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/3e2bafc8-aa76-4b81-aacd-4da589904455';
    }

    if (scriptSrc) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);

      // Cleanup function to remove script when component unmounts or language changes
      return () => {
        const scriptToRemove = document.querySelector(`script[src="${scriptSrc}"]`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [language]);

  return null; // This component doesn't render anything visible
};

export default LanguageWidget;