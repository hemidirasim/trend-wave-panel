import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  [key: string]: string;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Language> = {
  az: {
    'nav.home': 'Ana səhifə',
    'nav.services': 'Xidmətlər',
    'nav.blog': 'Bloq',
    'nav.faq': 'Suallar',
    'nav.dashboard': 'Dashboard',
    'nav.signIn': 'Daxil ol',
    'nav.signOut': 'Çıxış',
    'service.selectPlatform': 'Platform seçin',
    'service.selectServiceType': 'Xidmət növünü seçin',
    'service.noServicesFound': 'Seçilmiş kriterlərə uyğun xidmət tapılmadı',
    'service.selectService': 'Xidmət seçin',
    'service.selectServicePlaceholder': 'Xidmət seçin...',
    'service.priceFor': 'ədəd üçün',
    'service.minimumOrder': 'Minimum sifariş',
    'service.speed': 'Sürət',
    'service.startTime': 'Başlama vaxtı',
    'service.instantStart': 'Dərhal başlanır',
    'service.withinHours': 'saat ərzində',
    'service.withinDays': 'gün ərzində',
    'service.withinMinutes': 'dəqiqə ərzində',
    'service.perDay': 'gündə',
    'service.perHour': 'saatda',
    'service.sortLowToHigh': 'Qiymət: Azdan Çoxa',
    'service.sortHighToLow': 'Qiymət: Çoxdan Aza',
    'service.units': 'ədəd',
    'service.instant': 'Dərhal',
    'service.hours': 'saat',
    'service.days': 'gün',
    'service.minutes': 'dəqiqə',
    // API stringləri üçün tərcümələr
    'service.api.instant': 'Dərhal',
    'service.api.immediate': 'Ani',
    'service.api.0-1hour': '0-1 saat',
    'service.api.1-6hours': '1-6 saat',  
    'service.api.6-12hours': '6-12 saat',
    'service.api.12-24hours': '12-24 saat',
    'service.api.1-3days': '1-3 gün',
    'service.api.3-7days': '3-7 gün',
    'service.api.slowstart': 'Yavaş başlama',
    'service.api.faststart': 'Sürətli başlama',
    'service.api.normalstart': 'Normal başlama',
    'service.api.day': 'gün',
    'service.api.hour': 'saat', 
    'service.api.minute': 'dəqiqə',
    'service.api.perday': 'gündə',
    'service.api.perhour': 'saatda',
    'service.api.perminute': 'dəqiqədə',
    'service.api.within': 'ərzində'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('az');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage === 'az') {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
