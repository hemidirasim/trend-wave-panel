
import { useEffect } from 'react';
import { getSitemapUrls, generateSitemap } from '@/utils/sitemapGenerator';

export const SitemapRoute = () => {
  useEffect(() => {
    const urls = getSitemapUrls();
    const sitemapXml = generateSitemap(urls);
    
    // Set proper content type and headers
    const response = new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
    // Replace the entire document with XML content
    document.open();
    document.write(sitemapXml);
    document.close();
  }, []);

  // Return null to prevent React from rendering anything
  return null;
};
