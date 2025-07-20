
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  canonical?: string;
}

export const SEO = ({ 
  title, 
  description, 
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  noindex = false,
  canonical
}: SEOProps) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  
  const siteUrl = "https://hitloyal.com";
  const currentUrl = `${siteUrl}${location.pathname}`;
  
  const seoData = {
    az: {
      siteName: "HitLoyal - Sosial Media Marketinq Xidmətləri",
      defaultTitle: "HitLoyal - Instagram, TikTok, YouTube və Facebook üçün Profesional Sosial Media Marketinq",
      defaultDescription: "HitLoyal ilə sosial media hesablarınızı böyüdün. Instagram takipçi, TikTok bəyənmə, YouTube izləyici və Facebook engagement xidmətləri. Təhlükəsiz, sürətli və effektiv.",
      keywords: "instagram takipçi, tiktok bəyənmə, youtube izləyici, facebook marketinq, sosial media artırma, azərbaycan"
    },
    tr: {
      siteName: "HitLoyal - Sosyal Medya Pazarlama Hizmetleri", 
      defaultTitle: "HitLoyal - Instagram, TikTok, YouTube ve Facebook için Profesyonel Sosyal Medya Pazarlama",
      defaultDescription: "HitLoyal ile sosyal medya hesaplarınızı büyütün. Instagram takipçi, TikTok beğeni, YouTube izleyici ve Facebook engagement hizmetleri. Güvenli, hızlı ve etkili.",
      keywords: "instagram takipçi, tiktok beğeni, youtube izleyici, facebook pazarlama, sosyal medya artırma, türkiye"
    }
  };

  const currentSeo = seoData[language as keyof typeof seoData];
  const pageTitle = title ? `${title} - ${currentSeo.siteName}` : currentSeo.defaultTitle;
  const pageDescription = description || currentSeo.defaultDescription;
  const canonicalUrl = canonical || currentUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={currentSeo.keywords} />
      <meta name="author" content="HitLoyal" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="az" href={`${siteUrl}/az${location.pathname.replace(/^\/(az|tr)/, '')}`} />
      <link rel="alternate" hrefLang="tr" href={`${siteUrl}/tr${location.pathname.replace(/^\/(az|tr)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${location.pathname.replace(/^\/(az|tr)/, '')}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={currentSeo.siteName} />
      <meta property="og:locale" content={language === 'az' ? 'az_AZ' : 'tr_TR'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hitloyal" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": currentSeo.siteName,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "description": currentSeo.defaultDescription,
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["az", "tr"]
          },
          "sameAs": [
            "https://instagram.com/hitloyal",
            "https://twitter.com/hitloyal"
          ]
        })}
      </script>
    </Helmet>
  );
};
