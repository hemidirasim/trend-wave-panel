
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

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
    { path: '/auth', priority: 0.6, changefreq: 'monthly' as const },
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
