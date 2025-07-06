
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Database, Cookie, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-primary mr-2" />
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  At SocialBoost, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our social media marketing services and website.
                </p>
              </section>

              <Separator />

              {/* Information Collection */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Database className="h-6 w-6 text-primary mr-2" />
                  2. Information We Collect
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Email address and contact information</li>
                      <li>Account credentials and profile information</li>
                      <li>Payment and billing information</li>
                      <li>Social media account links and usernames</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Usage Information</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Service usage patterns and preferences</li>
                      <li>Order history and transaction records</li>
                      <li>Website interaction and navigation data</li>
                      <li>Device information and IP addresses</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              {/* How We Use Information */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use collected information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and deliver our social media marketing services</li>
                    <li>Process payments and manage your account</li>
                    <li>Communicate with you about orders and support</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                    <li>Send promotional content (with your consent)</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Information Sharing */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We may share your information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> Third-party companies that help us deliver services</li>
                    <li><strong>Payment Processors:</strong> To process payments securely</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                  </ul>
                  <p className="mt-4">
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  5. Data Security
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We implement appropriate security measures to protect your information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure data storage and access controls</li>
                    <li>Regular security audits and updates</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Cookie className="h-6 w-6 text-primary mr-2" />
                  6. Cookies and Tracking
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve website functionality and performance</li>
                  </ul>
                  <p>You can control cookie settings through your browser preferences.</p>
                </div>
              </section>

              <Separator />

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  7. Your Privacy Rights
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Delete your account and personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                    <li>File complaints with regulatory authorities</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  8. International Data Transfers
                </h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </section>

              <Separator />

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Mail className="h-6 w-6 text-primary mr-2" />
                  9. Contact Us
                </h2>
                <div className="text-muted-foreground">
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@socialboost.com</p>
                    <p><strong>Support:</strong> Available 24/7 through our help center</p>
                    <p><strong>Address:</strong> SocialBoost Privacy Team</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
