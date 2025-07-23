
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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
  image = "https://hitloyal.com/logo-og.png",
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
      defaultTitle: "HitLoyal - Instagram, TikTok, YouTube və Facebook üçün Peşəkar Sosial Media Marketinq Xidmətləri | Azərbaycan",
      defaultDescription: "🚀 HitLoyal ilə sosial media hesablarınızı böyüdün! ✨ Instagram takipçi, TikTok bəyənmə, YouTube izləyici və Facebook engagement. 💎 Real istifadəçilər, təhlükəsiz xidmət, 24/7 dəstək. Azərbaycanda #1 sosial media marketinq platforması!",
      keywords: "instagram takipçi azərbaycan, tiktok bəyənmə, youtube izləyici, facebook marketinq, sosial media artırma, smm panel azərbaycan, sosial media xidmətləri bakı, instagram likes azərbaycan, tiktok followers, youtube views"
    },
    tr: {
      siteName: "HitLoyal - Sosyal Medya Pazarlama Hizmetleri", 
      defaultTitle: "HitLoyal - Instagram, TikTok, YouTube ve Facebook için Profesyonel Sosyal Medya Pazarlama Hizmetleri | Türkiye",
      defaultDescription: "🚀 HitLoyal ile sosyal medya hesaplarınızı büyütün! ✨ Instagram takipçi, TikTok beğeni, YouTube izleyici ve Facebook engagement. 💎 Gerçek kullanıcılar, güvenli hizmet, 7/24 destek. Türkiye'de güvenilir sosyal medya pazarlama platformu!",
      keywords: "instagram takipçi türkiye, tiktok beğeni, youtube izleyici, facebook pazarlama, sosyal medya artırma, smm panel türkiye, sosyal medya hizmetleri, instagram likes türkiye, tiktok followers, youtube views"
    },
    en: {
      siteName: "HitLoyal - Social Media Marketing Services",
      defaultTitle: "HitLoyal - Professional Social Media Marketing Services for Instagram, TikTok, YouTube & Facebook | Global",
      defaultDescription: "🚀 Grow your social media accounts with HitLoyal! ✨ Instagram followers, TikTok likes, YouTube views, and Facebook engagement. 💎 Real users, secure service, 24/7 support. The trusted social media growth platform worldwide!",
      keywords: "instagram followers, tiktok likes, youtube views, facebook marketing, social media growth, smm panel, social media services, instagram likes, tiktok followers, social media marketing"
    }
  };

  const currentSeo = seoData[language as keyof typeof seoData] || seoData.en;
  const pageTitle = title ? `${title} - ${currentSeo.siteName}` : currentSeo.defaultTitle;
  const pageDescription = description || currentSeo.defaultDescription;
  const canonicalUrl = canonical || currentUrl;

  // Force re-render when language changes
  useEffect(() => {
    // This will trigger a re-render of the Helmet component when language changes
  }, [language]);

  return (
    <Helmet key={language}>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={currentSeo.keywords} />
      <meta name="author" content="HitLoyal - Midiya Agency MMC" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#6366f1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" href={`${siteUrl}/sitemap.xml`} />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="az" href={`${siteUrl}/az${location.pathname.replace(/^\/(az|tr|en)/, '')}`} />
      <link rel="alternate" hrefLang="tr" href={`${siteUrl}/tr${location.pathname.replace(/^\/(az|tr|en)/, '')}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${location.pathname.replace(/^\/(az|tr|en)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${location.pathname.replace(/^\/(az|tr|en)/, '')}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={currentSeo.siteName} />
      <meta property="og:locale" content={language === 'az' ? 'az_AZ' : language === 'tr' ? 'tr_TR' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hitloyal" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Business Information */}
      <meta name="geo.region" content="AZ" />
      <meta name="geo.placename" content="Baku" />
      <meta name="geo.position" content="40.409264;49.867092" />
      <meta name="ICBM" content="40.409264, 49.867092" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "HitLoyal",
          "legalName": "Midiya Agency MMC",
          "url": siteUrl,
          "logo": `${siteUrl}/favicon.svg`,
          "description": currentSeo.defaultDescription,
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Cəfər Cabbarlı 44, Caspian Plaza",
            "addressLocality": "Bakı",
            "addressCountry": "AZ"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["az", "tr", "en"]
          },
          "sameAs": [
            "https://instagram.com/hitloyal",
            "https://twitter.com/hitloyal"
          ],
          "areaServed": ["AZ", "TR", "US"],
          "serviceType": [
            "Social Media Marketing",
            "Instagram Marketing", 
            "TikTok Marketing",
            "YouTube Marketing",
            "Facebook Marketing"
          ]
        })}
      </script>

      {/* Website Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": currentSeo.siteName,
          "url": siteUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Service Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Social Media Marketing Services",
          "provider": {
            "@type": "Organization",
            "name": "HitLoyal"
          },
          "serviceType": "Social Media Marketing",
          "areaServed": ["Azerbaijan", "Turkey", "United States"],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Social Media Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Instagram Followers"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "TikTok Likes"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "YouTube Views"
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
};
