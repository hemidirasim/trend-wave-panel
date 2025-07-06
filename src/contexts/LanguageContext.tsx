
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type Language = 'az' | 'en' | 'tr' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  az: {
    // Header
    'header.home': 'Ana səhifə',
    'header.services': 'Xidmətlər',
    'header.blog': 'Bloq',
    'header.faq': 'FAQ',
    'header.login': 'Giriş',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Çıxış',
    'header.rating': '4.9/5 Rating',
    
    // Index page
    'index.hero.badge': 'Ən Yaxşı SMM Paneli',
    'index.hero.title': 'Sosial Media Artımınız Burada Başlayır',
    'index.hero.subtitle': 'Instagram, TikTok, YouTube və Facebook üçün ən keyfiyyətli və uygun qiymətli SMM xidmətləri. Takipçi, bəyənmə və baxış sayınızı artırın!',
    'index.hero.start': 'İndi Başlayın',
    'index.hero.signup': 'Hesab Yaradın',
    
    // Stats
    'stats.customers': 'Məmnun Müştəri',
    'stats.orders': 'Tamamlanmış Sifariş',
    'stats.satisfaction': 'Müştəri Məmnuniyyəti',
    'stats.support': 'Dəstək Xidməti',
    
    // Platforms
    'platforms.title': 'Dəstəklənən Platformlar',
    'platforms.subtitle': 'Ən populyar sosial media platformları üçün geniş xidmət çeşidi',
    'platforms.viewServices': 'Xidmətlərə Bax',
    
    // Features
    'features.title': 'Niyə SocialBoost?',
    'features.subtitle': 'Bizim üstünlüklərimiz və sizə təqdim etdiyimiz keyfiyyətli xidmətlər',
    'features.fast': 'Sürətli Çatdırılma',
    'features.fastDesc': 'Sifarişlər 24 saat ərzində başlayır və tez bir zamanda tamamlanır',
    'features.secure': 'Təhlükəsiz Xidmət',
    'features.secureDesc': '100% təhlükəsiz və etibarlı xidmətlər, hesabınız üçün heç bir risk yoxdur',
    'features.support': '24/7 Dəstək',
    'features.supportDesc': 'Hər zaman əlçatan müştəri dəstəyi və peşəkar kömək',
    'features.quality': 'Keyfiyyətli Takipçilər',
    'features.qualityDesc': 'Real və aktiv istifadəçilərdən ibarət keyfiyyətli takipçilər',
    
    // CTA
    'cta.title': 'Sosial Media Artımınızı İndi Başladın!',
    'cta.subtitle': 'Minlərlə məmnun müştərimizə qoşulun və sosial media hesablarınızı yeni səviyyəyə çıxarın. İlk sifarişinizdə 10% endirim!',
    'cta.order': 'İndi Sifariş Verin',
    'cta.register': 'Qeydiyyatdan Keçin',
    
    // Footer
    'footer.description': 'Sosial media hesablarınızı gücləndirecək peşəkar SMM xidmətləri. Bütün əsas platformlar üçün keyfiyyətli həllər.',
    'footer.secure': 'Təhlükəsiz',
    'footer.fast': 'Sürətli',
    'footer.support247': '24/7 Dəstək',
    'footer.services': 'Xidmətlər',
    'footer.company': 'Şirkət',
    'footer.supportSection': 'Dəstək',
    'footer.copyright': '© 2024 SocialBoost. Bütün hüquqlar qorunur.',
    'footer.trustedBy': '50,000+ məmnun müştəri tərəfindən güvənilir'
  },
  en: {
    // Header
    'header.home': 'Home',
    'header.services': 'Services',
    'header.blog': 'Blog',
    'header.faq': 'FAQ',
    'header.login': 'Login',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Logout',
    'header.rating': '4.9/5 Rating',
    
    // Index page
    'index.hero.badge': 'Best SMM Panel',
    'index.hero.title': 'Your Social Media Growth Starts Here',
    'index.hero.subtitle': 'The highest quality and most affordable SMM services for Instagram, TikTok, YouTube and Facebook. Increase your followers, likes and views!',
    'index.hero.start': 'Get Started',
    'index.hero.signup': 'Create Account',
    
    // Stats
    'stats.customers': 'Happy Customers',
    'stats.orders': 'Completed Orders',
    'stats.satisfaction': 'Customer Satisfaction',
    'stats.support': 'Support Service',
    
    // Platforms
    'platforms.title': 'Supported Platforms',
    'platforms.subtitle': 'Wide range of services for the most popular social media platforms',
    'platforms.viewServices': 'View Services',
    
    // Features
    'features.title': 'Why SocialBoost?',
    'features.subtitle': 'Our advantages and quality services we offer you',
    'features.fast': 'Fast Delivery',
    'features.fastDesc': 'Orders start within 24 hours and are completed quickly',
    'features.secure': 'Secure Service',
    'features.secureDesc': '100% safe and reliable services, no risk to your account',
    'features.support': '24/7 Support',
    'features.supportDesc': 'Always available customer support and professional help',
    'features.quality': 'Quality Followers',
    'features.qualityDesc': 'Quality followers from real and active users',
    
    // CTA
    'cta.title': 'Start Your Social Media Growth Now!',
    'cta.subtitle': 'Join thousands of satisfied customers and take your social media accounts to the next level. 10% discount on your first order!',
    'cta.order': 'Order Now',
    'cta.register': 'Register',
    
    // Footer
    'footer.description': 'Professional SMM services to strengthen your social media accounts. Quality solutions for all major platforms.',
    'footer.secure': 'Secure',
    'footer.fast': 'Fast',
    'footer.support247': '24/7 Support',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.supportSection': 'Support',
    'footer.copyright': '© 2024 SocialBoost. All rights reserved.',
    'footer.trustedBy': 'Trusted by 50,000+ satisfied customers'
  },
  tr: {
    // Header
    'header.home': 'Anasayfa',
    'header.services': 'Hizmetler',
    'header.blog': 'Blog',
    'header.faq': 'SSS',
    'header.login': 'Giriş',
    'header.dashboard': 'Panel',
    'header.logout': 'Çıkış',
    'header.rating': '4.9/5 Puan',
    
    // Index page
    'index.hero.badge': 'En İyi SMM Paneli',
    'index.hero.title': 'Sosyal Medya Büyümeniz Burada Başlar',
    'index.hero.subtitle': 'Instagram, TikTok, YouTube ve Facebook için en kaliteli ve uygun fiyatlı SMM hizmetleri. Takipçi, beğeni ve görüntüleme sayınızı artırın!',
    'index.hero.start': 'Hemen Başla',
    'index.hero.signup': 'Hesap Oluştur',
    
    // Stats
    'stats.customers': 'Mutlu Müşteri',
    'stats.orders': 'Tamamlanan Sipariş',
    'stats.satisfaction': 'Müşteri Memnuniyeti',
    'stats.support': 'Destek Hizmeti',
    
    // Platforms
    'platforms.title': 'Desteklenen Platformlar',
    'platforms.subtitle': 'En popüler sosyal medya platformları için geniş hizmet yelpazesi',
    'platforms.viewServices': 'Hizmetleri Görüntüle',
    
    // Features
    'features.title': 'Neden SocialBoost?',
    'features.subtitle': 'Avantajlarımız ve size sunduğumuz kaliteli hizmetler',
    'features.fast': 'Hızlı Teslimat',
    'features.fastDesc': 'Siparişler 24 saat içinde başlar ve hızla tamamlanır',
    'features.secure': 'Güvenli Hizmet',
    'features.secureDesc': '%100 güvenli ve güvenilir hizmetler, hesabınız için hiçbir risk yok',
    'features.support': '7/24 Destek',
    'features.supportDesc': 'Her zaman erişilebilir müşteri desteği ve profesyonel yardım',
    'features.quality': 'Kaliteli Takipçiler',
    'features.qualityDesc': 'Gerçek ve aktif kullanıcılardan oluşan kaliteli takipçiler',
    
    // CTA
    'cta.title': 'Sosyal Medya Büyümenizi Şimdi Başlatın!',
    'cta.subtitle': 'Binlerce memnun müşterimize katılın ve sosyal medya hesaplarınızı bir sonraki seviyeye taşıyın. İlk siparişinizde %10 indirim!',
    'cta.order': 'Şimdi Sipariş Ver',
    'cta.register': 'Kayıt Ol',
    
    // Footer
    'footer.description': 'Sosyal medya hesaplarınızı güçlendirecek profesyonel SMM hizmetleri. Tüm ana platformlar için kaliteli çözümler.',
    'footer.secure': 'Güvenli',
    'footer.fast': 'Hızlı',
    'footer.support247': '7/24 Destek',
    'footer.services': 'Hizmetler',
    'footer.company': 'Şirket',
    'footer.supportSection': 'Destek',
    'footer.copyright': '© 2024 SocialBoost. Tüm hakları saklıdır.',
    'footer.trustedBy': '50.000+ memnun müşteri tarafından güvenilir'
  },
  ru: {
    // Header
    'header.home': 'Главная',
    'header.services': 'Услуги',
    'header.blog': 'Блог',
    'header.faq': 'FAQ',
    'header.login': 'Вход',
    'header.dashboard': 'Панель',
    'header.logout': 'Выход',
    'header.rating': '4.9/5 Рейтинг',
    
    // Index page
    'index.hero.badge': 'Лучшая SMM Панель',
    'index.hero.title': 'Ваш Рост в Социальных Сетях Начинается Здесь',
    'index.hero.subtitle': 'Самые качественные и доступные SMM услуги для Instagram, TikTok, YouTube и Facebook. Увеличьте количество подписчиков, лайков и просмотров!',
    'index.hero.start': 'Начать',
    'index.hero.signup': 'Создать Аккаунт',
    
    // Stats
    'stats.customers': 'Довольных Клиентов',
    'stats.orders': 'Выполненных Заказов',
    'stats.satisfaction': 'Удовлетворенность Клиентов',
    'stats.support': 'Служба Поддержки',
    
    // Platforms
    'platforms.title': 'Поддерживаемые Платформы',
    'platforms.subtitle': 'Широкий спектр услуг для самых популярных платформ социальных сетей',
    'platforms.viewServices': 'Посмотреть Услуги',
    
    // Features
    'features.title': 'Почему SocialBoost?',
    'features.subtitle': 'Наши преимущества и качественные услуги, которые мы вам предлагаем',
    'features.fast': 'Быстрая Доставка',
    'features.fastDesc': 'Заказы начинаются в течение 24 часов и быстро выполняются',
    'features.secure': 'Безопасный Сервис',
    'features.secureDesc': '100% безопасные и надежные услуги, никакого риска для вашего аккаунта',
    'features.support': 'Поддержка 24/7',
    'features.supportDesc': 'Всегда доступная поддержка клиентов и профессиональная помощь',
    'features.quality': 'Качественные Подписчики',
    'features.qualityDesc': 'Качественные подписчики от реальных и активных пользователей',
    
    // CTA
    'cta.title': 'Начните Рост в Социальных Сетях Прямо Сейчас!',
    'cta.subtitle': 'Присоединяйтесь к тысячам довольных клиентов и поднимите свои аккаунты в социальных сетях на новый уровень. Скидка 10% на первый заказ!',
    'cta.order': 'Заказать Сейчас',
    'cta.register': 'Зарегистрироваться',
    
    // Footer
    'footer.description': 'Профессиональные SMM услуги для укрепления ваших аккаунтов в социальных сетях. Качественные решения для всех основных платформ.',
    'footer.secure': 'Безопасно',
    'footer.fast': 'Быстро',
    'footer.support247': 'Поддержка 24/7',
    'footer.services': 'Услуги',
    'footer.company': 'Компания',
    'footer.supportSection': 'Поддержка',
    'footer.copyright': '© 2024 SocialBoost. Все права защищены.',
    'footer.trustedBy': 'Нам доверяют 50 000+ довольных клиентов'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguageState] = useState<Language>(() => {
    // First check URL parameter
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && ['az', 'en', 'tr', 'ru'].includes(urlLang)) {
      return urlLang;
    }
    // Then check localStorage
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'az';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update URL parameter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('lang', lang);
    setSearchParams(newSearchParams, { replace: true });
  };

  useEffect(() => {
    // Sync URL with current language on mount
    const urlLang = searchParams.get('lang');
    if (urlLang !== language) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('lang', language);
      setSearchParams(newSearchParams, { replace: true });
    }
  }, []);

  useEffect(() => {
    // Listen for URL changes and update language
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && ['az', 'en', 'tr', 'ru'].includes(urlLang) && urlLang !== language) {
      setLanguageState(urlLang);
      localStorage.setItem('language', urlLang);
    }
  }, [searchParams]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
