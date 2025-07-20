
import { useEffect } from 'react';

export const RobotsRoute = () => {
  useEffect(() => {
    const robotsTxt = `User-agent: *
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

    // Text kimi təqdim et
    const response = new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'max-age=86400' // 24 saat cache
      }
    });
    
    // Text məzmunu göstər
    document.open();
    document.write(`<pre>${robotsTxt}</pre>`);
    document.close();
    document.contentType = 'text/plain';
  }, []);

  return null;
};
