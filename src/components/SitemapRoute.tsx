
import { useEffect } from 'react';
import { getSitemapUrls, generateSitemap } from '@/utils/sitemapGenerator';

export const SitemapRoute = () => {
  useEffect(() => {
    const urls = getSitemapUrls();
    const sitemapXml = generateSitemap(urls);
    
    // XML kimi təqdim et
    const response = new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=86400' // 24 saat cache
      }
    });
    
    // XML məzmunu göstər
    document.open();
    document.write(sitemapXml);
    document.close();
    document.contentType = 'application/xml';
  }, []);

  return null;
};
