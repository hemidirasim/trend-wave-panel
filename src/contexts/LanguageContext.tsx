import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  az: {
    'header.dashboard': 'Panel',
    'header.orders': 'Sifarişlər',
    'header.balance': 'Balans',
    'header.logout': 'Çıxış',
    'footer.copyright': 'Bütün hüquqlar qorunur',
    'auth.login': 'Giriş',
    'auth.register': 'Qeydiyyat',
    'auth.email': 'E-poçt',
    'auth.password': 'Şifrə',
    'auth.name': 'Ad',
    'auth.loginButton': 'Daxil ol',
    'auth.registerButton': 'Qeydiyyatdan keç',
    'auth.googleButton': 'Google ilə',
    'auth.alreadyAccount': 'Hesabınız var?',
    'auth.noAccount': 'Hesabınız yoxdur?',
    'balance.title': 'Balansı artır',
    'balance.description': 'Balansınızı artırmaq üçün məbləği daxil edin',
    'balance.amount': 'Məbləğ',
    'balance.topUp': 'Artır',
    'order.title': 'Sifariş ver',
    'order.subtitle': 'Yeni sifarişinizi buradan verə bilərsiniz',
    'order.details': 'Sifariş detalları',
    'order.detailsDesc': 'Xidmət seçin və sifarişinizi tamamlayın',
    'order.serviceRequired': 'Xidmət seçmək vacibdir',
    'order.servicesLoading': 'Xidmətlər yüklənir...',
    'order.platformSelect': 'Platform seçin',
    'order.serviceTypeSelect': 'Xidmət növünü seçin',
    'order.noServicesFound': 'Seçilmiş kriterlərə uyğun xidmət tapılmadı',
    'order.selectedService': 'Seçilmiş xidmət',
    'order.cheapestOption': '💰 Ən ucuz',
    'order.perUnit': 'ədəd üçün',
    'order.minimum': 'Min',
    'order.startTime': '🚀',
    'order.speed': '⚡',
    'order.instantly': 'Dərhal başlanır',
    'order.withinHours': 'saat ərzində',
    'order.withinDays': 'gün ərzində',
    'order.withinMinutes': 'dəqiqə ərzində',
    'order.perDay': 'gündə',
    'order.perHour': 'saatda',
    'order.urlRequired': 'URL daxil etmək vacibdir',
    'order.validUrlRequired': 'Düzgün URL formatı daxil edin',
    'order.quantityRequired': 'Miqdar daxil etmək vacibdir',
    'order.validQuantityRequired': 'Düzgün miqdar daxil edin',
    'order.minimumQuantity': 'Minimum miqdar',
    'order.maximumQuantity': 'Maksimum miqdar',
    'order.fieldRequired': 'vacibdir',
    'order.insufficientBalance': 'Kifayət qədər balansınız yoxdur. Balansınızı artırın.',
    'order.orderPlaced': 'Sifariş uğurla verildi!',
    'order.orderFailed': 'Sifariş verilmədi. Yenidən cəhd edin.',
    'order.placingOrder': 'Sifariş verilir...'
  },
  tr: {
    'header.dashboard': 'Panel',
    'header.orders': 'Siparişler',
    'header.balance': 'Bakiye',
    'header.logout': 'Çıkış',
    'footer.copyright': 'Tüm hakları saklıdır',
    'auth.login': 'Giriş',
    'auth.register': 'Kaydol',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.name': 'Ad',
    'auth.loginButton': 'Giriş Yap',
    'auth.registerButton': 'Kaydol',
    'auth.googleButton': 'Google ile',
    'auth.alreadyAccount': 'Hesabınız var mı?',
    'auth.noAccount': 'Hesabınız yok mu?',
    'balance.title': 'Bakiyeyi artır',
    'balance.description': 'Bakiyenizi artırmak için miktarı girin',
    'balance.amount': 'Miktar',
    'balance.topUp': 'Artır',
    'order.title': 'Sipariş ver',
    'order.subtitle': 'Yeni siparişinizi buradan verebilirsiniz',
    'order.details': 'Sipariş detayları',
    'order.detailsDesc': 'Hizmet seçin ve siparişinizi tamamlayın',
    'order.serviceRequired': 'Hizmet seçmek zorunludur',
    'order.servicesLoading': 'Hizmetler yükleniyor...',
    'order.platformSelect': 'Platform seçin',
    'order.serviceTypeSelect': 'Hizmet türünü seçin',
    'order.noServicesFound': 'Seçilen kriterlere uygun hizmet bulunamadı',
    'order.selectedService': 'Seçilen hizmet',
    'order.cheapestOption': '💰 En ucuz',
    'order.perUnit': 'adet için',
    'order.minimum': 'Min',
    'order.startTime': '🚀',
    'order.speed': '⚡',
    'order.instantly': 'Hemen başlar',
    'order.withinHours': 'saat içinde',
    'order.withinDays': 'gün içinde',
    'order.withinMinutes': 'dakika içinde',
    'order.perDay': 'günde',
    'order.perHour': 'saatte',
    'order.urlRequired': 'URL girmeniz gereklidir',
    'order.validUrlRequired': 'Doğru URL formatı girin',
    'order.quantityRequired': 'Miktar girmeniz gereklidir',
    'order.validQuantityRequired': 'Doğru miktar girin',
    'order.minimumQuantity': 'Minimum miktar',
    'order.maximumQuantity': 'Maksimum miktar',
    'order.fieldRequired': 'gereklidir',
    'order.insufficientBalance': 'Yeterli bakiyeniz yok. Bakiyenizi artırın.',
    'order.orderPlaced': 'Sipariş başarıyla verildi!',
    'order.orderFailed': 'Sipariş verilemedi. Tekrar deneyin.',
    'order.placingOrder': 'Sipariş veriliyor...'
  },
  en: {
    'header.dashboard': 'Dashboard',
    'header.orders': 'Orders',
    'header.balance': 'Balance',
    'header.logout': 'Logout',
    'footer.copyright': 'All rights reserved',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.loginButton': 'Log In',
    'auth.registerButton': 'Register',
    'auth.googleButton': 'With Google',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': 'Don\'t have an account?',
    'balance.title': 'Top Up Balance',
    'balance.description': 'Enter the amount to top up your balance',
    'balance.amount': 'Amount',
    'balance.topUp': 'Top Up',
    'order.title': 'Place Order',
    'order.subtitle': 'You can place your new order here',
    'order.details': 'Order Details',
    'order.detailsDesc': 'Select a service and complete your order',
    'order.serviceRequired': 'Service selection is required',
    'order.servicesLoading': 'Services are loading...',
    'order.platformSelect': 'Select platform',
    'order.serviceTypeSelect': 'Select service type',
    'order.noServicesFound': 'No services found for selected criteria',
    'order.selectedService': 'Selected service',
    'order.cheapestOption': '💰 Cheapest',
    'order.perUnit': 'for',
    'order.minimum': 'Min',
    'order.startTime': '🚀',
    'order.speed': '⚡',
    'order.instantly': 'Starts instantly',
    'order.withinHours': 'within hours',
    'order.withinDays': 'within days',
    'order.withinMinutes': 'within minutes',
    'order.perDay': 'per day',
    'order.perHour': 'per hour',
    'order.urlRequired': 'URL is required',
    'order.validUrlRequired': 'Enter valid URL format',
    'order.quantityRequired': 'Quantity is required',
    'order.validQuantityRequired': 'Enter valid quantity',
    'order.minimumQuantity': 'Minimum quantity',
    'order.maximumQuantity': 'Maximum quantity',
    'order.fieldRequired': 'is required',
    'order.insufficientBalance': 'Insufficient balance. Please top up your balance.',
    'order.orderPlaced': 'Order placed successfully!',
    'order.orderFailed': 'Order failed. Please try again.',
    'order.placingOrder': 'Placing order...'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'az');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language as keyof typeof translations]?.[key] || key;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }

    return translation;
  }, [language]);

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
