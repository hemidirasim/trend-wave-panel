
import { useEffect } from 'react';
import { getSitemapUrls, generateSitemap } from '@/utils/sitemapGenerator';

export const SitemapRoute = () => {
  useEffect(() => {
    const urls = getSitemapUrls();
    const sitemapXml = generateSitemap(urls);
    
    // Clear the document and write XML content
    document.open('application/xml', 'replace');
    document.write(sitemapXml);
    document.close();
    
    // Set the content type header if possible
    if (document.contentType) {
      try {
        (document as any).contentType = 'application/xml';
      } catch (e) {
        // Ignore if we can't set content type
      }
    }
  }, []);

  return null;
};
