
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Clock, AlertTriangle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms & Conditions
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
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to SocialBoost ("we," "our," or "us"). These Terms & Conditions ("Terms") govern your use of our social media marketing services and website. By accessing or using our services, you agree to be bound by these Terms.
                </p>
              </section>

              <Separator />

              {/* Services */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  2. Our Services
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>SocialBoost provides social media marketing services including but not limited to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Instagram followers, likes, and views</li>
                    <li>TikTok followers, likes, and views</li>
                    <li>YouTube subscribers, views, and likes</li>
                    <li>Facebook likes, followers, and shares</li>
                  </ul>
                  <p>All services are delivered through legitimate means and comply with platform guidelines.</p>
                </div>
              </section>

              <Separator />

              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  3. User Responsibilities
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>By using our services, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate account information</li>
                    <li>Use services only for legitimate purposes</li>
                    <li>Not resell or redistribute our services</li>
                    <li>Comply with all applicable laws and platform terms</li>
                    <li>Not use our services for illegal or harmful activities</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Payment Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  4. Payment Terms
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Payment terms include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All payments must be made in advance</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Refunds are provided according to our refund policy</li>
                    <li>We accept major payment methods and cryptocurrencies</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Service Delivery */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Clock className="h-6 w-6 text-primary mr-2" />
                  5. Service Delivery
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Service delivery guidelines:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Most orders start within 24 hours</li>
                    <li>Delivery times vary by service and quantity</li>
                    <li>We provide order tracking and status updates</li>
                    <li>Quality is guaranteed for all services</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Limitations */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                  6. Limitations of Liability
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    SocialBoost shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability is limited to the amount paid for the specific service.
                  </p>
                  <p>
                    We are not responsible for actions taken by social media platforms that may affect your account or our service delivery.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  7. Changes to Terms
                </h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the modified Terms.
                </p>
              </section>

              <Separator />

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  8. Contact Information
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at support@socialboost.com or through our support system.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
