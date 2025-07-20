
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap.xml">
${urlEntries}
</urlset>`;
};

export const getSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    { path: '', priority: 1.0, changefreq: 'daily' as const },
    { path: '/services', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/blog', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/terms', priority: 0.5, changefreq: 'yearly' as const },
    { path: '/privacy', priority: 0.5, changefreq: 'yearly' as const },
    { path: '/track', priority: 0.6, changefreq: 'monthly' as const }
  ];

  const languages = ['az', 'tr'];
  const urls: SitemapUrl[] = [];

  // Ana səhifə (dil prefix-i olmadan)
  pages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Dil-spesifik səhifələr
  languages.forEach(lang => {
    pages.forEach(page => {
      urls.push({
        loc: `${baseUrl}/${lang}${page.path}`,
        lastmod: currentDate,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });
  });

  // Blog yazıları (dinamik)
  const blogPosts = [
    'instagram-takipci-artirma-yollari',
    'tiktok-algoritmi-viral-olmaq',
    'youtube-seo-strategiyalari',
    'facebook-marketing-strategiyalari',
    'sosial-media-analitikasi',
    'influencer-marketing-strategiyalari'
  ];

  // Əsas dil üçün blog yazıları
  blogPosts.forEach(slug => {
    urls.push({
      loc: `${baseUrl}/blog/${slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    });
  });

  // Dil-spesifik blog yazıları
  languages.forEach(lang => {
    blogPosts.forEach(slug => {
      urls.push({
        loc: `${baseUrl}/${lang}/blog/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
  });

  return urls;
};

// Robots.txt generatoru
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://hitloyal.com/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Block access to admin areas
User-agent: *
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /reset-password/
Disallow: /password-recovery/
Disallow: /payment-success/
Disallow: /payment-error/

# Allow access to important pages
User-agent: *
Allow: /services/
Allow: /blog/
Allow: /about/  
Allow: /contact/
Allow: /terms/
Allow: /privacy/
Allow: /track/`;
};
