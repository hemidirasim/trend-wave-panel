
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Shield, Clock, Zap } from 'lucide-react';

const FAQ = () => {
  const faqData = [
    {
      question: "SocialBoost nədir və necə işləyir?",
      answer: "SocialBoost, Instagram, TikTok, YouTube və Facebook üçün peşəkar SMM xidmətləri təqdim edən platformadır. Siz istədiyiniz xidməti seçir, linkinizi daxil edir və sifarişiniz avtomatik olaraq işə başlayır."
    },
    {
      question: "Xidmətlər təhlükəsizdir?",
      answer: "Bəli, bütün xidmətlərimiz 100% təhlükəsizdir. Biz real və keyfiyyətli istifadəçilərlə işləyirik. Şifrənizi və ya giriş məlumatlarınızı heç vaxt tələb etmirik."
    },
    {
      question: "Nə qədər vaxt çəkir?",
      answer: "Sifarişlər adətən 24 saat ərzində başlayır və xidmətin növündən asılı olaraq bir neçə saat və ya gün ərzində tamamlanır. Bəzi xidmətlər dərhal başlayır."
    },
    {
      question: "Ödəniş üsulları hansılardır?",
      answer: "Biz müxtəlif ödəniş üsullarını dəstəkləyirik: kredit kartları, PayPal, bank köçürməsi və kriptovalyutalar. Bütün ödənişlər təhlükəsizdir."
    },
    {
      question: "Geri qaytarma siyasəti necədir?",
      answer: "Əgər xidmət təqdim edilməyibsə və ya keyfiyyət aşağıdırsa, 30 gün ərzində tam geri qaytarma təklif edirik. Müştəri məmnuniyyəti bizim prioritetimizdir."
    },
    {
      question: "Sifarişimi necə izləyə bilərəm?",
      answer: "Hesabınıza daxil olaraq sifarişlərinizin statusunu real vaxtda izləyə bilərsiniz. SMS və email bildirişləri də göndəririk."
    },
    {
      question: "Minimum və maksimum sifarişlər nədir?",
      answer: "Hər xidmətin öz minimum və maksimum limitləri var. Bu məlumatları xidmət səhifəsində görə bilərsiniz. Adətən minimum 100, maksimum 100K-ya qədərdir."
    },
    {
      question: "24/7 dəstək mövcuddur?",
      answer: "Bəli, bizim müştəri dəstəyi komandamız 24/7 xidmətinizdədir. Chat, email və ya telefon vasitəsilə bizimlə əlaqə saxlaya bilərsiniz."
    },
    {
      question: "Korporativ müştərilər üçün endirimlər varmı?",
      answer: "Bəli, böyük sifarişlər və müntəzəm müştərilər üçün xüsusi endirimlərimiz mövcuddur. Ətraflı məlumat üçün bizimlə əlaqə saxlayın."
    },
    {
      question: "Hansı platformları dəstəkləyirsiniz?",
      answer: "Hal-hazırda Instagram, TikTok, YouTube və Facebook platformlarını dəstəkləyirik. Yaxın zamanda Twitter və LinkedIn də əlavə ediləcək."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Tez-tez Verilən <span className="text-primary">Suallar</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SocialBoost xidmətləri haqqında ən çox verilən sualların cavabları
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle>100% Təhlükəsiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bütün xidmətlərimiz tamamilə təhlükəsiz və etibarlıdır
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle>24/7 Dəstək</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hər zaman əlçatan peşəkar müştəri dəstəyi
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <CardTitle>Sürətli Çatdırılma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sifarişlər 24 saat ərzində başlayır
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sual və Cavablar</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">
                Hələ də sualınız var?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Bizim dəstək komandamız sizə kömək etməyə hazırdır
              </p>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                24/7 Dəstək Mövcuddur
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
