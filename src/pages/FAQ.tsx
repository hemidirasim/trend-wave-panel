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
      question: "Instagram followers artırma xidməti necə işləyir?",
      answer: "Instagram followers artırma xidməti tamamilə təhlükəsizdir. Siz profil linkinizi və istədiyiniz followers sayını daxil edirsiniz. Biz real və aktiv istifadəçilər vasitəsilə followers sayınızı artırırıq. 24-48 saat ərzində artım başlayır."
    },
    {
      question: "TikTok görüntüləmə sayı artırma xidməti nə qədər vaxt alır?",
      answer: "TikTok görüntüləmə sayı artırma xidməti ən sürətli xidmətlərimizdən biridir. Sifarişiniz verildikdən sonra 1-6 saat ərzində artım başlayır və 24 saat ərzində tamamlanır."
    },
    {
      question: "YouTube izləyici artırma xidməti təhlükəsizdirmi?",
      answer: "Bəli, YouTube izləyici artırma xidməti tamamilə təhlükəsizdir. Biz yalnız real istifadəçilər və təbii artım metodları istifadə edirik. YouTube-un qaydalarına uyğun olaraq işləyirik və hesabınız heç bir risk altında deyil."
    },
    {
      question: "Facebook like və comment artırma necə edilir?",
      answer: "Facebook like və comment artırma xidməti üçün paylaşımınızın linkini bizə göndərin. Biz həm like, həm də keyfiyyətli comment artırma xidməti təqdim edirik. Real istifadəçilər tərəfindən müsbət təsirlər yaradırıq."
    },
    {
      question: "Sifarişimi necə izləyə bilərəm?",
      answer: "Hesabınıza daxil olaraq sifarişlərinizin statusunu real vaxtda izləyə bilərsiniz. Hər sifarişin gedişatı, başlama vaxtı və tamamlanma müddəti görünür. SMS və email bildirişləri də göndəririk."
    },
    {
      question: "Ödəniş metodları hansılardır?",
      answer: "Biz müxtəlif ödəniş metodlarını qəbul edirik: Kapital Bank, Rabitəbank, Bank kartları, Visa/MasterCard, və digər yerli bank kartları. Bütün ödənişlər təhlükəsizdir və şifrələnmişdir."
    },
    {
      question: "Geri qaytarma siyasəti necədir?",
      answer: "Əgər xidmət təqdim edilməyibsə və ya keyfiyyət aşağıdırsa, 30 gün ərzində tam geri qaytarma təklif edirik. Müştəri məmnuniyyəti bizim prioritetimizdir. Xidmət başladıqdan sonra geri qaytarma mümkün deyil."
    },
    {
      question: "Minimum və maksimum sifarişlər nədir?",
      answer: "Hər xidmətin öz minimum və maksimum limitləri var. Adətən minimum 100, maksimum 100.000-ə qədər sifarişlər qəbul edirik. Instagram followers üçün minimum 100, maksimum 50.000-dir."
    },
    {
      question: "24/7 müştəri dəstəyi mövcuddur?",
      answer: "Bəli, bizim müştəri dəstəyi komandamız 24/7 xidmətinizdədir. WhatsApp, email və ya telefon vasitəsilə bizimlə əlaqə saxlaya bilərsiniz. Suallarınızı dərhal cavablandırırıq."
    },
    {
      question: "Toplu sifarişlər üçün endirimlər varmı?",
      answer: "Bəli, böyük sifarişlər və müntəzəm müştərilər üçün xüsusi endirimlər mövcuddur. 10.000+ followers sifarişlərində 10% endirim, 50.000+ sifarişlərində 20% endirim tətbiq edirik."
    },
    {
      question: "Hesabım bağlana bilərmi?",
      answer: "Xeyr, bizim istifadə etdiyimiz metodlar tamamilə təhlükəsizdir və platform qaydalarına uyğundur. Heç bir müştərimizin hesabı bağlanmamışdır. Biz yalnız real istifadəçilər və təbii artım metodları istifadə edirik."
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
