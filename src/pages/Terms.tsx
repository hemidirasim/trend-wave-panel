
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground text-lg">
            Please read these terms carefully before using HitLoyal's social media growth platform
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                By accessing and using HitLoyal's social media growth platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                HitLoyal provides social media growth strategies, analytics, consultation services, and educational resources to help individuals and businesses build their authentic online presence across various social media platforms including Instagram, TikTok, YouTube, and Facebook.
              </p>
              <p>
                Our services include but are not limited to:
              </p>
              <ul>
                <li>Strategic growth planning and consultation</li>
                <li>Performance analytics and insights</li>
                <li>Educational resources and training materials</li>
                <li>Expert guidance and mentoring</li>
                <li>Platform-specific optimization strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>Users are responsible for:</p>
              <ul>
                <li>Providing accurate and up-to-date information</li>
                <li>Implementing strategies in compliance with platform terms of service</li>
                <li>Maintaining the confidentiality of account credentials</li>
                <li>Using our services ethically and responsibly</li>
                <li>Following all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Service Limitations</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                HitLoyal provides guidance and strategic advice for organic social media growth. We do not guarantee specific results or outcomes. Success depends on various factors including content quality, consistency, audience engagement, and platform algorithm changes.
              </p>
              <p>
                Our services are consultative and educational in nature. We do not directly interact with or modify your social media accounts unless explicitly authorized.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Payment and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Payment terms vary by service package. All fees are non-refundable unless otherwise specified in writing. We reserve the right to modify pricing with 30 days notice to existing customers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                All content, strategies, methodologies, and materials provided by HitLoyal are proprietary and protected by intellectual property laws. Users may not redistribute, resell, or share proprietary content without explicit written permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We respect your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                HitLoyal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Either party may terminate the service agreement at any time with written notice. Upon termination, your access to proprietary materials and ongoing support will cease.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                HitLoyal reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the service after changes constitutes acceptance of new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                For questions about these Terms & Conditions, please contact us at:
              </p>
              <p>
                Email: legal@hitloyal.com<br />
                Last updated: January 2024
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
