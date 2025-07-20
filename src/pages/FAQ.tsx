import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "Xidmətləriniz necə işləyir?",
      answer: "Platformamızda istədiyiniz xidməti seçin, lazımi məlumatları daxil edin və ödənişi tamamlayın. Sifarişiniz avtomatik olaraq işlənməyə başlayacaq."
    },
    {
      question: "Ödəniş etmək təhlükəsizdirmi?",
      answer: "Bəli, bütün ödənişlər SSL şifrələməsi ilə qorunur və beynəlxalq təhlükəsizlik standartlarına uyğundur."
    },
    {
      question: "Sifarişim nə vaxt başlayacaq?",
      answer: "Əksər sifarişlər ödənişdən sonra 1-24 saat ərzində başlayır. Xidmət növündən asılı olaraq bu müddət dəyişə bilər."
    },
    {
      question: "Sifarişimi ləğv edə bilərəmmi?",
      answer: "Sifarişin işlənməsinə başlanana qədər ləğv etmək mümkündür. İşlənməyə başlanan sifarişlər ləğv edilə bilməz."
    },
    {
      question: "Geri qaytarma siyasətiniz necədir?",
      answer: "Əgər sifarişiniz 48 saat ərzində başlamazsa, tam geri qaytarma edilir. Keyfiyyət problemi olarsa, pulsuz təkrar və ya qismən geri qaytarma təmin olunur."
    },
    {
      question: "Hesabım bloklanma riski varmı?",
      answer: "Biz yalnız real və keyfiyyətli xidmətlər təqdim edirik. Sosial media platformalarının qaydalarına riayət edirik və risk minimuma endirilir."
    },
    {
      question: "Sifarişin gedişatını necə izləyə bilərəm?",
      answer: "Dashboard bölməsindən bütün sifarişlərinizi real zamanda izləyə bilərsiniz. SMS və email bildirişləri də göndəririk."
    },
    {
      question: "Müştəri dəstəyi necə əlaqə saxlaya bilərəm?",
      answer: "24/7 canlı söhbət, email və telefon vasitəsilə bizimlə əlaqə saxlaya bilərsiniz. Ortalama cavab müddəti 5-10 dəqiqədir."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Tez-tez Verilən Suallar</h1>
          <p className="text-lg text-muted-foreground">
            Ən çox soruşulan sualların cavablarını burada tapa bilərsiniz
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sualınızın cavabını tapa bilmirsiniz?</CardTitle>
            <CardDescription>
              Bizə yazın və ən qısa zamanda sizə kömək edək
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email: support@example.com | Telefon: +994 XX XXX XX XX
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Hələ də sualınız var?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Dəstək komandamız sizə kömək etməyə hazırdır
            </p>
            <p className="text-sm text-muted-foreground">
              Canlı söhbət: Saytın sağ aşağı küncündəki söhbət ikonasına klikləyin
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;