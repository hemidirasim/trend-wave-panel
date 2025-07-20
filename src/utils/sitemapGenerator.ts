
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const urlEntries = urls.map(url => `  <sitemap>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</sitemapindex>`;
};

export const getSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString();
  
  const sitemaps: SitemapUrl[] = [
    // Ana sitemap
    {
      loc: `${baseUrl}/sitemap-main.xml`,
      lastmod: currentDate
    },
    // Xidmətlər kategoriyası
    {
      loc: `${baseUrl}/sitemap-services.xml`, 
      lastmod: currentDate
    },
    // Blog kategoriyası  
    {
      loc: `${baseUrl}/sitemap-blog.xml`,
      lastmod: currentDate
    },
    // Azərbaycan dili üçün blog
    {
      loc: `${baseUrl}/sitemap-blog-az.xml`,
      lastmod: currentDate
    },
    // Türk dili üçün blog
    {
      loc: `${baseUrl}/sitemap-blog-tr.xml`,
      lastmod: currentDate
    },
    // Əlaqə və digər səhifələr
    {
      loc: `${baseUrl}/sitemap-pages.xml`,
      lastmod: currentDate
    }
  ];

  return sitemaps;
};

// Ana sitemap generatoru
export const generateMainSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    { path: '', priority: 1.0, changefreq: 'daily' as const },
    { path: '/az', priority: 1.0, changefreq: 'daily' as const },
    { path: '/tr', priority: 1.0, changefreq: 'daily' as const }
  ];

  const urlEntries = pages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Xidmətlər sitemap generatoru
export const generateServicesSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const servicePages = [
    '/services',
    '/az/services', 
    '/tr/services'
  ];

  const urlEntries = servicePages.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Blog sitemap generatoru
export const generateBlogSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const blogPages = [
    '/blog',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/track'
  ];

  const urlEntries = blogPages.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Azərbaycan dili blog sitemap
export const generateBlogAzSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const blogPosts = [
    '/az/blog/instagram-takipci-artirma-yollari',
    '/az/blog/tiktok-algoritmi-viral-olmaq',
    '/az/blog/youtube-seo-strategiyalari',
    '/az/blog/facebook-marketing-strategiyalari',
    '/az/blog/sosial-media-analitikasi',
    '/az/blog/influencer-marketing-strategiyalari'
  ];

  const pages = [
    '/az/blog',
    '/az/about', 
    '/az/contact',
    '/az/terms',
    '/az/privacy',
    '/az/track'
  ];

  const allUrls = [...pages, ...blogPosts];
  
  const urlEntries = allUrls.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Türk dili blog sitemap
export const generateBlogTrSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const blogPosts = [
    '/tr/blog/instagram-takipci-artirma-yollari',
    '/tr/blog/tiktok-algoritmi-viral-olmaq', 
    '/tr/blog/youtube-seo-strategiyalari',
    '/tr/blog/facebook-marketing-strategiyalari',
    '/tr/blog/sosial-media-analitikasi',
    '/tr/blog/influencer-marketing-strategiyalari'
  ];

  const pages = [
    '/tr/blog',
    '/tr/about',
    '/tr/contact', 
    '/tr/terms',
    '/tr/privacy',
    '/tr/track'
  ];

  const allUrls = [...pages, ...blogPosts];
  
  const urlEntries = allUrls.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Səhifələr sitemap generatoru
export const generatePagesSitemap = (): string => {
  const baseUrl = 'https://hitloyal.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    '/about',
    '/contact', 
    '/terms',
    '/privacy',
    '/track',
    '/az/about',
    '/az/contact',
    '/az/terms', 
    '/az/privacy',
    '/az/track',
    '/tr/about',
    '/tr/contact',
    '/tr/terms',
    '/tr/privacy', 
    '/tr/track'
  ];

  const urlEntries = pages.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
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
