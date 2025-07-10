
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Məxfilik Siyasəti</h1>
          <p className="text-muted-foreground text-lg">
            Məxfiliyiniz bizim üçün vacibdir. Bu siyasət SocialBoost-un məlumatlarınızı necə topladığını, istifadə etdiyini və qoruduğunu izah edir.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Topladığımız Məlumatlar</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h4>Şəxsi Məlumatlar</h4>
              <p>
                Biz sizin birbaşa verdiyiniz məlumatları topluyuruq, məsələn hesab yaratdığınız, xidmətlərimizə abunə olduğunuz və ya dəstək üçün bizimlə əlaqə saxladığınız zaman:
              </p>
              <ul>
                <li>Ad və əlaqə məlumatları (email ünvanı, telefon nömrəsi)</li>
                <li>Hesab məlumatları və profil məlumatları</li>
                <li>Ödəniş məlumatları (üçüncü tərəf provayderlər vasitəsilə təhlükəsiz emal edilir)</li>
                <li>Kommunikasiya seçimləri və tarixçəsi</li>
              </ul>

              <h4>İstifadə Məlumatları</h4>
              <p>
                Biz platformamızdan necə istifadə etdiyinizə dair bəzi məlumatları avtomatik topluyuruq:
              </p>
              <ul>
                <li>Giriş tezliyi və sessiya müddəti</li>
                <li>İstifadə edilən funksiyalar və əldə edilən məzmun</li>
                <li>Performans analitikası və əlaqə metrikləri</li>
                <li>Cihaz məlumatları və texniki xüsusiyyətlər</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Məlumatlarınızı Necə İstifadə Edirik</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>Topladığımız məlumatları aşağıdakı məqsədlər üçün istifadə edirik:</p>
              <ul>
                <li>SMM xidmətlərimizi təqdim etmək, qorumaq və təkmilləşdirmək</li>
                <li>Fərdiləşdirilmiş sosial media strategiyaları və təkliflər hazırlamaq</li>
                <li>Ödənişləri emal etmək və abunəlikləri idarə etmək</li>
                <li>Mühüm yeniliklər, bildirişlər və marketinq materialları göndərmək</li>
                <li>Müştəri dəstəyi təqdim etmək və sorğulara cavab vermək</li>
                <li>İstifadə nümunələrini təhlil edərək istifadəçi təcrübəsini artırmaq</li>
                <li>Platform təhlükəsizliyini təmin etmək və saxtakarlığın qarşısını almaq</li>
                <li>Qanuni öhdəliklərə əməl etmək və şərtlərimizi tətbiq etmək</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We implement robust security measures to protect your personal information:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure payment processing through certified providers</li>
                <li>Employee training on data protection best practices</li>
              </ul>
              <p>
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specific retention periods include:
              </p>
              <ul>
                <li>Account information: Until account deletion or as required by law</li>
                <li>Usage analytics: Anonymized after 24 months</li>
                <li>Communication records: 3 years for customer support purposes</li>
                <li>Payment information: As required by financial regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>You have the right to:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability in machine-readable format</li>
                <li>Withdraw consent for specific data processing activities</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@hitloyal.com.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Our platform may integrate with third-party services for enhanced functionality. These services have their own privacy policies, and we encourage you to review them:
              </p>
              <ul>
                <li>Social media platform APIs for analytics</li>
                <li>Payment processors for subscription management</li>
                <li>Analytics tools for performance measurement</li>
                <li>Communication tools for customer support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including:
              </p>
              <ul>
                <li>Standard contractual clauses approved by regulatory authorities</li>
                <li>Adequacy decisions for specific countries</li>
                <li>Certification under recognized privacy frameworks</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or for legal and regulatory reasons. We will notify you of significant changes via email or platform notification.
              </p>
              <p>
                Continued use of our services after policy updates constitutes acceptance of the revised terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Bizimlə Əlaqə</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Bu Məxfilik Siyasəti və ya məlumatlarınızı necə idarə etdiyimiz haqqında suallarınız varsa, bizimlə əlaqə saxlayın:
              </p>
              <p>
                <strong>Email:</strong> info@socialboost.az<br />
                <strong>Ünvan:</strong> SocialBoost Məxfilik Komandası<br />
                <strong>Son Yenilənmə:</strong> Yanvar 2024
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
