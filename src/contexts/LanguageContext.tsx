import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    'features.fastQuality': 'Sürətli və Keyfiyyətli',
    'features.fastQualityDesc': 'Real istifadəçilərlə işləyərək sosial media hesablarınızı sürətli və təhlükəsiz şəkildə inkişaf etdiririk.',
    'features.support247': '24/7 Dəstək Xidməti',
    'features.support247Desc': 'Peşəkar müştəri dəstəyi komandamız həftənin 7 günü sizin xidmətinizdədir.',
    'features.securePayment': 'Təhlükəsiz Ödəniş',
    'features.securePaymentDesc': 'Bütün ödənişləriniz SSL şifrələməsi ilə qorunur və müxtəlif ödəniş üsullarını dəstəkləyirik.',
    'features.guarantee': 'Zəmanət və Keyfiyyət',
    'features.guaranteeDesc': 'Bütün xidmətlərimiz 100% zəmanətlidir və keyfiyyət standartlarımıza uyğundur.',
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
    'footer.trustedPlatform': '1,500+ müştərimizin etibar etdiyi platform',
    'order.title': 'Sifarişinizi Verin',
    'order.subtitle': 'Xidmət seçin və məlumatlarınızı daxil edin',
    'order.details': 'Sifariş Təfərrüatları',
    'order.detailsDesc': 'Sifarişinizi vermək üçün aşağıdakı məlumatları doldurun',
    'order.serviceRequired': 'Xidmət seçmək vacibdir',
    'order.servicesLoading': 'Xidmətlər və parametrlər yüklənir...',
    // Dashboard
    'dashboard.title': 'İdarə Paneli',
    'dashboard.orders': 'Sifarişlər',
    'dashboard.balance': 'Balans',
    'dashboard.topUp': 'Balans Artır',
    'dashboard.paymentHistory': 'Ödəniş Tarixçəsi',
    'dashboard.support': 'Dəstək',
    'dashboard.settings': 'Ayarlar',
    'dashboard.noOrders': 'Sifariş tapılmadı',
    'dashboard.noOrdersDesc': 'Bu kateqoriyada sifariş yoxdur',
    'dashboard.allOrders': 'Bütün sifarişlər',
    'dashboard.pending': 'Gözlənir',
    'dashboard.processing': 'İşlənir',
    'dashboard.completed': 'Tamamlandı',
    'dashboard.cancelled': 'Ləğv edildi',
    // Orders Table
    'orders.service': 'Xidmət',
    'orders.quantity': 'Miqdar',
    'orders.price': 'Qiymət',
    'orders.status': 'Status',
    'orders.date': 'Tarix',
    'orders.link': 'Link',
    'orders.comment': 'Şərh',
    'orders.pending': 'Gözlənir',
    'orders.processing': 'İşlənir',
    'orders.completed': 'Tamamlandı',
    'orders.error': 'Xəta',
    'orders.refunded': 'Geri qaytarıldı',
    'orders.stopped': 'Dayandırıldı',
    'orders.cancelled': 'Ləğv edildi',
    // Account Settings
    'account.title': 'Hesab Ayarları',
    'account.profile': 'Profil',
    'account.security': 'Təhlükəsizlik',
    'account.personalInfo': 'Şəxsi Məlumatlar',
    'account.fullName': 'Ad Soyad',
    'account.email': 'E-mail',
    'account.save': 'Yadda saxla',
    'account.passwordSecurity': 'Şifrə və Təhlükəsizlik',
    'account.newPassword': 'Yeni Şifrə',
    'account.confirmPassword': 'Şifrəni Təsdiqlə',
    'account.updatePassword': 'Şifrəni Yenilə',
    'account.fullNameRequired': 'Ad Soyad sahəsi mütləqdir',
    'account.profileUpdated': 'Profil uğurla yeniləndi',
    'account.profileUpdateError': 'Profil yenilənərkən xəta baş verdi',
    'account.passwordRequired': 'Bütün şifrə sahələri mütləqdir',
    'account.passwordMismatch': 'Yeni şifrələr uyğun gəlmir',
    'account.passwordMinLength': 'Şifrə ən azı 6 simvol olmalıdır',
    'account.passwordUpdated': 'Şifrə uğurla yeniləndi',
    'account.passwordUpdateError': 'Şifrə yenilənərkən xəta baş verdi',
    // Popular Services
    'services.popular': 'Populyar Xidmətlər',
    // About Page
    'about.title': 'HitLoyal Haqqında',
    'about.description': 'Biz rəqəmsal marketinq sahəsində aparıcı agentliklərdən biriyik. 2020-ci ildən bəri müştərilərimizə keyfiyyətli sosial media marketinq, reklam və brendinq xidmətləri təqdim edirik.',
    'about.ourMission': 'Bizim Missiyamız',
    'about.missionText': 'Hər bir müştərimizin rəqəmsal dünyada uğur qazanmasına kömək etmək və onların brendlərini gücləndiməkdir. Biz innovativ həllər, şəffaf proseslər və müştəri məmnuniyyətini prioritet olaraq götürürük. Məqsədimiz Azərbaycanda və regionda rəqəmsal marketinq sahəsində liderlik mövqeyini qorumaq və daha da möhkəmləndirməkdir.',
    'about.whyChooseUs': 'Niyə Məhz Bizi Seçməlisiniz?',
    'about.companyInfo': 'Şirkət Haqqında',
    'about.companyDescription': 'HitLoyal, Midiya Agency MMC-nin nəzarəti altında fəaliyyət göstərən rəqəmsal marketinq platformasıdır. Şirkətimiz rəsmi olaraq qeydiyyatdan keçmişdir və VOEN: 6402180791 nömrəsi ilə tanınır.',
    'about.companyServices': 'Biz sosial media platformalarında organic və ödənişli reklam kampaniyaları, SEO optimallaşdırması, kontent marketinqi və brendinq xidmətləri təqdim edirik. Komandamız müasir texnologiyalar və ən son marketinq trendləri ilə işləyir.',
    // Features for About page
    'about.security': 'Təhlükəsizlik',
    'about.securityDesc': 'Bütün məlumatlarınız və sifarişləriniz tam təhlükəsizlik altındadır.',
    'about.fastService': 'Sürətli Xidmət',
    'about.fastServiceDesc': 'Sifarişləriniz ən qısa müddətdə yerinə yetirilir.',
    'about.professionalTeam': 'Peşəkar Komanda',
    'about.professionalTeamDesc': 'Təcrübəli mütəxəssislərdən ibarət komandamız sizə yardım edir.',
    'about.targeted': 'Məqsədyönlü',
    'about.targetedDesc': 'Hər layihəyə fərdi yanaşma və maksimal nəticə əldə edirik.',
    'about.quality': 'Keyfiyyət',
    'about.qualityDesc': 'Yüksək keyfiyyətli xidmət və müştəri məmnuniyyəti prioritetimizdir.',
    'about.globalReach': 'Global Əhatə',
    'about.globalReachDesc': 'Dünya üzrə müxtəlif platformalarda xidmət göstəririk.',
    // Stats
    'about.happyCustomers': 'Məmnun Müştəri',
    'about.completedOrders': 'Tamamlanmış Sifariş',
    'about.successRate': 'Uğur Nisbəti',
    'about.supportService': 'Dəstək Xidməti',
    // Contact Page  
    'contact.title': 'Bizimlə Əlaqə',
    'contact.description': 'Suallarınız var? Bizə müraciət edin və peşəkar komandamız sizə kömək etsin. 24/7 dəstək xidməti ilə həmişə yanınızdayıq.',
    'contact.info': 'Əlaqə Məlumatları',
    'contact.writeToUs': 'Bizə Yazın',
    'contact.sendMessage': 'Mesajı Göndər',
    'contact.email': 'E-poçt',
    'contact.phone': 'Telefon',
    'contact.address': 'Ünvan',
    'contact.workHours': 'İş Saatları',
    'contact.support247': '24/7 Dəstək',
    'contact.whyHitLoyal': 'Niyə HitLoyal?',
    'contact.fastResponse': 'Sürətli cavab müddəti (24 saat ərzində)',
    'contact.professionalConsult': 'Peşəkar konsultasiya xidməti',
    'contact.personalizedSolutions': 'Fərdiləşdirilmiş həllər',
    'contact.transparentPricing': 'Şəffaf qiymətləndirmə',
    'contact.formDesc': 'Sualınızı göndərin və tezliklə sizinlə əlaqə saxlayaq.',
    'contact.fullName': 'Ad və Soyad',
    'contact.subject': 'Mövzu',
    'contact.message': 'Mesaj',
    'contact.namePlaceholder': 'Adınızı daxil edin',
    'contact.emailPlaceholder': 'email@example.com',
    'contact.subjectPlaceholder': 'Mesajınızın mövzusu',
    'contact.messagePlaceholder': 'Mesajınızı buraya yazın...',
    'contact.findOffice': 'Ofisimizə Yolunuzu Tapın',
    'contact.officeLocation': 'Bakı şəhəri, Cəfər Cabbarlı küçəsi 44, Caspian Plaza binasında yerləşirik. Metro stansiyalarına yaxın və əlçatan yerdəyik.',
    'contact.addressFull': 'Cəfər Cabbarlı 44 (Caspian Plaza)',
    'contact.city': 'Bakı, Azərbaycan',
    // Blog Page
    'blog.title': 'SMM Bloqu',
    'blog.subtitle': 'Sosial media marketinqi, strategiya və trendlər haqqında ən son məqalələr',
    'blog.latestTrends': 'Ən Son Trendlər',
    'blog.latestTrendsDesc': 'Sosial media dünyasındakı ən yeni trendlər və yeniliklər',
    'blog.practicalTips': 'Praktik Məsləhətlər',
    'blog.practicalTipsDesc': 'Dərhal tətbiq edə biləcəyiniz effektiv strategiyalar',
    'blog.analytics': 'Analiz və İstatistika',
    'blog.analyticsDesc': 'Rəqəmlərlə dəstəklənən dərin analiz və tövsiyələr',
    'blog.readArticle': 'Məqaləni Oxu',
    'blog.backToBlog': 'Bloqa Qayıt',
    'blog.readOtherArticles': 'Digər Məqalələri Oxu',
    'blog.articleNotFound': 'Məqalə Tapılmadı',
    'blog.articleNotFoundDesc': 'Axtardığınız məqalə mövcud deyil və ya silinib.',
    'blog.loading': 'Məqalə yüklənir...',
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
    'features.fastQuality': 'Hızlı ve Kaliteli',
    'features.fastQualityDesc': 'Gerçek kullanıcılarla çalışarak sosyal medya hesaplarınızı hızlı ve güvenli şekilde geliştiriyoruz.',
    'features.support247': '7/24 Destek Hizmeti',
    'features.support247Desc': 'Profesyonel müşteri destek ekibimiz haftanın 7 günü hizmetinizde.',
    'features.securePayment': 'Güvenli Ödeme',
    'features.securePaymentDesc': 'Tüm ödemeleriniz SSL şifreleme ile korunur ve çeşitli ödeme yöntemlerini destekliyoruz.',
    'features.guarantee': 'Garanti ve Kalite',
    'features.guaranteeDesc': 'Tüm hizmetlerimiz %100 garantilidir ve kalite standartlarımıza uygundur.',
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
    'footer.trustedPlatform': '1,500+ müşterimizin güvendiği platform',
    'order.title': 'Siparişinizi Verin',
    'order.subtitle': 'Hizmet seçin ve bilgilerinizi girin',
    'order.details': 'Sipariş Detayları',
    'order.detailsDesc': 'Siparişinizi vermek için aşağıdaki bilgileri doldurun',
    'order.serviceRequired': 'Hizmet seçmek zorunludur',
    'order.servicesLoading': 'Hizmetler ve parametreler yükleniyor...',
    // Dashboard
    'dashboard.title': 'Kontrol Paneli',
    'dashboard.orders': 'Siparişler',
    'dashboard.balance': 'Bakiye',
    'dashboard.topUp': 'Bakiye Yükle',
    'dashboard.paymentHistory': 'Ödeme Geçmişi',
    'dashboard.support': 'Destek',
    'dashboard.settings': 'Ayarlar',
    'dashboard.noOrders': 'Sipariş bulunamadı',
    'dashboard.noOrdersDesc': 'Bu kategoride sipariş yok',
    'dashboard.allOrders': 'Tüm siparişler',
    'dashboard.pending': 'Bekliyor',
    'dashboard.processing': 'İşleniyor',
    'dashboard.completed': 'Tamamlandı',
    'dashboard.cancelled': 'İptal edildi',
    // Orders Table
    'orders.service': 'Hizmet',
    'orders.quantity': 'Miktar',
    'orders.price': 'Fiyat',
    'orders.status': 'Durum',
    'orders.date': 'Tarih',
    'orders.link': 'Link',
    'orders.comment': 'Yorum',
    'orders.pending': 'Bekliyor',
    'orders.processing': 'İşleniyor',
    'orders.completed': 'Tamamlandı',
    'orders.error': 'Hata',
    'orders.refunded': 'İade edildi',
    'orders.stopped': 'Durduruldu',
    'orders.cancelled': 'İptal edildi',
    // Account Settings
    'account.title': 'Hesap Ayarları',
    'account.profile': 'Profil',
    'account.security': 'Güvenlik',
    'account.personalInfo': 'Kişisel Bilgiler',
    'account.fullName': 'Ad Soyad',
    'account.email': 'E-posta',
    'account.save': 'Kaydet',
    'account.passwordSecurity': 'Şifre ve Güvenlik',
    'account.newPassword': 'Yeni Şifre',
    'account.confirmPassword': 'Şifreyi Onayla',
    'account.updatePassword': 'Şifreyi Güncelle',
    'account.fullNameRequired': 'Ad Soyad alanı zorunludur',
    'account.profileUpdated': 'Profil başarıyla güncellendi',
    'account.profileUpdateError': 'Profil güncellenirken hata oluştu',
    'account.passwordRequired': 'Tüm şifre alanları zorunludur',
    'account.passwordMismatch': 'Yeni şifreler eşleşmiyor',
    'account.passwordMinLength': 'Şifre en az 6 karakter olmalıdır',
    'account.passwordUpdated': 'Şifre başarıyla güncellendi',
    'account.passwordUpdateError': 'Şifre güncellenirken hata oluştu',
    // Popular Services
    'services.popular': 'Popüler Hizmetler',
    // About Page
    'about.title': 'HitLoyal Hakkında',
    'about.description': 'Dijital pazarlama alanında önde gelen ajanslardan biriyiz. 2020\'den beri müşterilerimize kaliteli sosyal medya pazarlama, reklam ve branding hizmetleri sunuyoruz.',
    'about.ourMission': 'Misyonumuz',
    'about.missionText': 'Her müşterimizin dijital dünyada başarı kazanmasına yardım etmek ve markalarını güçlendirmektir. İnovatif çözümler, şeffaf süreçler ve müşteri memnuniyetini öncelik olarak alıyoruz. Amacımız Azerbaycan\'da ve bölgede dijital pazarlama alanında liderlik konumunu korumak ve daha da güçlendirmektir.',
    'about.whyChooseUs': 'Neden Bizi Seçmelisiniz?',
    'about.companyInfo': 'Şirket Hakkında',
    'about.companyDescription': 'HitLoyal, Midiya Agency MMC\'nin kontrolü altında faaliyet gösteren dijital pazarlama platformudur. Şirketimiz resmi olarak kayıtlıdır ve VOEN: 6402180791 numarası ile tanınmaktadır.',
    'about.companyServices': 'Sosyal medya platformlarında organik ve ücretli reklam kampanyaları, SEO optimizasyonu, içerik pazarlama ve branding hizmetleri sunuyoruz. Ekibimiz modern teknolojiler ve en son pazarlama trendleri ile çalışmaktadır.',
    // Features for About page
    'about.security': 'Güvenlik',
    'about.securityDesc': 'Tüm bilgileriniz ve siparişleriniz tam güvenlik altındadır.',
    'about.fastService': 'Hızlı Hizmet',
    'about.fastServiceDesc': 'Siparişleriniz en kısa sürede yerine getirilir.',
    'about.professionalTeam': 'Profesyonel Ekip',
    'about.professionalTeamDesc': 'Deneyimli uzmanlardan oluşan ekibimiz size yardımcı olur.',
    'about.targeted': 'Hedef Odaklı',
    'about.targetedDesc': 'Her projeye bireysel yaklaşım ve maksimum sonuç elde ediyoruz.',
    'about.quality': 'Kalite',
    'about.qualityDesc': 'Yüksek kaliteli hizmet ve müşteri memnuniyeti önceliğimizdir.',
    'about.globalReach': 'Global Erişim',
    'about.globalReachDesc': 'Dünya çapında çeşitli platformlarda hizmet veriyoruz.',
    // Stats
    'about.happyCustomers': 'Mutlu Müşteri',
    'about.completedOrders': 'Tamamlanan Sipariş',
    'about.successRate': 'Başarı Oranı',
    'about.supportService': 'Destek Hizmeti',
    // Contact Page
    'contact.title': 'Bizimle İletişime Geçin',
    'contact.description': 'Sorularınız mı var? Bize ulaşın ve profesyonel ekibimiz size yardımcı olsun. 7/24 destek hizmeti ile her zaman yanınızdayız.',
    'contact.info': 'İletişim Bilgileri',
    'contact.writeToUs': 'Bize Yazın',
    'contact.sendMessage': 'Mesajı Gönder',
    'contact.email': 'E-posta',
    'contact.phone': 'Telefon',
    'contact.address': 'Adres',
    'contact.workHours': 'Çalışma Saatleri',
    'contact.support247': '7/24 Destek',
    'contact.whyHitLoyal': 'Neden HitLoyal?',
    'contact.fastResponse': 'Hızlı yanıt süresi (24 saat içinde)',
    'contact.professionalConsult': 'Profesyonel danışmanlık hizmeti',
    'contact.personalizedSolutions': 'Kişiselleştirilmiş çözümler',
    'contact.transparentPricing': 'Şeffaf fiyatlandırma',
    'contact.formDesc': 'Sorunuzu gönderin ve kısa sürede sizinle iletişime geçelim.',
    'contact.fullName': 'İsim ve Soy isim',
    'contact.subject': 'Konu',
    'contact.message': 'Mesaj',
    'contact.namePlaceholder': 'Adınızı girin',
    'contact.emailPlaceholder': 'email@example.com',
    'contact.subjectPlaceholder': 'Mesajınızın konusu',
    'contact.messagePlaceholder': 'Mesajınızı buraya yazın...',
    'contact.findOffice': 'Ofisimizi Bulun',
    'contact.officeLocation': 'Bakü şehri, Cəfər Cabbarlı caddesi 44, Caspian Plaza binasında yer alıyoruz. Metro istasyonlarına yakın ve ulaşılabilir konumdayız.',
    'contact.addressFull': 'Cəfər Cabbarlı 44 (Caspian Plaza)',
    'contact.city': 'Bakü, Azerbaycan',
    // Blog Page
    'blog.title': 'SMM Blogu',
    'blog.subtitle': 'Sosyal medya pazarlama, strateji ve trendler hakkında en son makaleler',
    'blog.latestTrends': 'En Son Trendler',
    'blog.latestTrendsDesc': 'Sosyal medya dünyasındaki en yeni trendler ve yenilikler',
    'blog.practicalTips': 'Pratik Öneriler',
    'blog.practicalTipsDesc': 'Hemen uygulayabileceğiniz etkili stratejiler',
    'blog.analytics': 'Analiz ve İstatistik',
    'blog.analyticsDesc': 'Sayılarla desteklenen derinlemesine analiz ve öneriler',
    'blog.readArticle': 'Makaleyi Oku',
    'blog.backToBlog': 'Bloga Dön',
    'blog.readOtherArticles': 'Diğer Makaleleri Oku',
    'blog.articleNotFound': 'Makale Bulunamadı',
    'blog.articleNotFoundDesc': 'Aradığınız makale mevcut değil veya silinmiş.',
    'blog.loading': 'Makale yükleniyor...',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('az'); // Default to Azerbaijani
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL for language parameter
    const pathParts = location.pathname.split('/');
    const langFromUrl = pathParts[1];
    
    if (langFromUrl === 'az' || langFromUrl === 'tr') {
      setLanguage(langFromUrl);
      localStorage.setItem('language', langFromUrl);
    } else {
      // Use Azerbaijani as default instead of checking localStorage
      const defaultLanguage = 'az';
      setLanguage(defaultLanguage);
      localStorage.setItem('language', defaultLanguage);
      
      // Redirect to language-specific URL with Azerbaijani as default
      const newPath = `/${defaultLanguage}${location.pathname}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update URL with new language
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'az' || pathParts[1] === 'tr') {
      pathParts[1] = lang;
    } else {
      pathParts.splice(1, 0, lang);
    }
    const newPath = pathParts.join('/') + location.search;
    navigate(newPath, { replace: true });
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
