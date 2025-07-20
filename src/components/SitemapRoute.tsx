
import { useEffect } from 'react';
import { getSitemapUrls, generateSitemap } from '@/utils/sitemapGenerator';

export const SitemapRoute = () => {
  useEffect(() => {
    const urls = getSitemapUrls();
    const sitemapXml = generateSitemap(urls);
    
    // XML məzmunu göstər
    document.open();
    document.write(sitemapXml);
    document.close();
  }, []);

  return null;
};
