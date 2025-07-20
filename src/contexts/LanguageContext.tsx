
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
    'nav.dashboard': 'Hesab',
    'nav.signIn': 'Daxil ol',
    'nav.signOut': 'Çıxış',
    'nav.about': 'Haqqımızda',
    'nav.contact': 'Əlaqə',
    'nav.socialMedia': 'Sosial Media',
    'nav.socialNetworks': 'Sosial Şəbəkələr',
    'hero.title': 'HitLoyal ilə Brendinizi Gücləndirin',
    'hero.subtitle': 'Instagram, TikTok, YouTube və digər sosial media platformalarında hesablarınızı böyütmək üçün ən keyfiyyətli xidmətlər. Organik böyümə və təhlükəsiz yanaşma ilə real nəticələr əldə edin.',
    'hero.viewServices': 'Xidmətləri Gör',
    'stats.completedOrders': 'Tamamlanmış Sifarişlər',
    'stats.happyCustomers': 'Məmnun Müştərilər',
    'stats.customerSatisfaction': 'Müştəri Məmnuniyyəti',
    'stats.support247': 'Dəstək Xidməti',
    'features.whyUs': 'Niyə HitLoyal?',
    'features.subtitle': 'Sosial media xidmətlərimizlə hesablarınızı güclü şəkildə inkişaf etdirin və real nəticələr əldə edin',
    'guarantees.resultGuarantee': 'Nəticə Zəmanəti',
    'guarantees.satisfactionGuarantee': 'Məmnuniyyət Zəmanəti',
    'guarantees.support247': '24/7 Müştəri Dəstəyi',
    'guarantees.moneyBack': 'Pul Geri Qaytarma',
    'footer.company': 'Şirkət',
    'footer.whyUs': 'Niyə Bizimlə?',
    'footer.secureReliable': 'Təhlükəsiz və Etibarlı',
    'footer.fastService': 'Sürətli Xidmət',
    'footer.support247': '24/7 Dəstək',
    'footer.description': 'Peşəkar reklam və marketinq agentliyi. Biznesinizi rəqəmsal dünyada gücləndirir, brendinizi növbəti səviyyəyə çıxarırıq. Google reklamları, SMM, SEO və digər xidmətlərlə uğurunuzu təmin edirik.',
    'footer.copyright': '© 2024 HitLoyal. Bütün hüquqlar qorunur. Bu sayt rəsmi olaraq Midiya Agency MMC-ə aiddir. VOEN: 6402180791',
    'footer.trustedPlatform': '1,500+ müştərimizin etibar etdiyi platform'
  },
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.blog': 'Blog',
    'nav.faq': 'SSS',
    'nav.dashboard': 'Hesap',
    'nav.signIn': 'Giriş Yap',
    'nav.signOut': 'Çıkış',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.socialMedia': 'Sosyal Medya',
    'nav.socialNetworks': 'Sosyal Ağlar',
    'hero.title': 'HitLoyal ile Markanızı Güçlendirin',
    'hero.subtitle': 'Instagram, TikTok, YouTube ve diğer sosyal medya platformlarında hesaplarınızı büyütmek için en kaliteli hizmetler. Organik büyüme ve güvenli yaklaşımla gerçek sonuçlar elde edin.',
    'hero.viewServices': 'Hizmetleri Gör',
    'stats.completedOrders': 'Tamamlanan Siparişler',
    'stats.happyCustomers': 'Mutlu Müşteriler',
    'stats.customerSatisfaction': 'Müşteri Memnuniyeti',
    'stats.support247': 'Destek Hizmeti',
    'features.whyUs': 'Neden HitLoyal?',
    'features.subtitle': 'Sosyal medya hizmetlerimizle hesaplarınızı güçlü şekilde geliştirin ve gerçek sonuçlar elde edin',
    'guarantees.resultGuarantee': 'Sonuç Garantisi',
    'guarantees.satisfactionGuarantee': 'Memnuniyet Garantisi',
    'guarantees.support247': '7/24 Müşteri Desteği',
    'guarantees.moneyBack': 'Para İade Garantisi',
    'footer.company': 'Şirket',
    'footer.whyUs': 'Neden Bizimle?',
    'footer.secureReliable': 'Güvenli ve Güvenilir',
    'footer.fastService': 'Hızlı Hizmet',
    'footer.support247': '7/24 Destek',
    'footer.description': 'Profesyonel reklam ve pazarlama ajansı. İşinizi dijital dünyada güçlendiriyor, markanızı bir sonraki seviyeye taşıyoruz. Google reklamları, SMM, SEO ve diğer hizmetlerle başarınızı sağlıyoruz.',
    'footer.copyright': '© 2024 HitLoyal. Tüm hakları saklıdır. Bu site resmi olarak Midiya Agency MMC\'ye aittir. VOEN: 6402180791',
    'footer.trustedPlatform': '1,500+ müşterimizin güvendiği platform'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('az');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'az' || savedLanguage === 'tr')) {
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
