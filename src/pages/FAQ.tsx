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
      question: "Instagram Followers artırma xidməti necə işləyir?",
      answer: "Instagram Followers xidməti üçün profil linkinizi və istədiyiniz followers sayını seçirsiniz. Real və aktiv istifadəçilər vasitəsilə followers sayınız təhlükəsiz şəkildə artırılır. Artım 24-48 saat ərzində başlayır və tədricən tamamlanır."
    },
    {
      question: "Instagram Likes xidməti ilə hansı nəticələr əldə edə bilərəm?",
      answer: "Instagram Likes xidməti paylaşımlarınızın məşhurluğunu artırır və daha çox insanın diqqətini çəkir. Real istifadəçilər tərəfindən like alacaqsınız və bu da organik reach-inizi artıracaq."
    },
    {
      question: "TikTok Views artırma xidməti nə qədər sürətlidir?",
      answer: "TikTok Views xidməti bizim ən sürətli xidmətlərimizdən biridir. Sifarişiniz verildikdən sonra 1-6 saat ərzində görüntüləmə sayınız artmağa başlayır və 24 saat ərzində tamamlanır."
    },
    {
      question: "TikTok Followers xidməti təhlükəsizdirmi?",
      answer: "Bəli, TikTok Followers xidməti tamamilə təhlükəsizdir. Real istifadəçilər və təbii artım metodları istifadə edirik. TikTok-un qaydalarına uyğun işləyirik və hesabınız risk altında deyil."
    },
    {
      question: "YouTube Views artırma xidməti necə işləyir?",
      answer: "YouTube Views xidməti üçün video linkinizi göndərin. Real izləyicilər tərəfindən videonuz izlənəcək və görüntüləmə sayınız artacaq. Bu da YouTube alqoritmi tərəfindən videonuzun daha çox tövsiyə edilməsinə kömək edəcək."
    },
    {
      question: "YouTube Subscribers xidməti ilə kanal inkişafım necə olacaq?",
      answer: "YouTube Subscribers xidməti kanalınızın kredibilliyini artırır və daha çox organik izləyici cəlb etməyə kömək edir. Real abunəçilər əldə edəcəksiniz və bu da kanalınızın ümumi performansını yaxşılaşdıracaq."
    },
    {
      question: "Facebook Post Likes xidməti hansı növ paylaşımlar üçün uyğundur?",
      answer: "Facebook Post Likes xidməti bütün növ paylaşımlar üçün uyğundur - foto, video, mətn və ya link paylaşımları. Paylaşımınızın linkini bizə göndərin və real istifadəçilər tərəfindən like alın."
    },
    {
      question: "Minimum və maksimum sifarişlər nədir?",
      answer: "Hər xidmətin öz minimum və maksimum limitləri mövcuddur. Ümumiyyətlə minimum 100, maksimum 100.000 həddində sifarişlər qəbul edirik. Instagram Followers üçün minimum 100, maksimum 50.000 followers sifariş edə bilərsiniz."
    },
    {
      question: "Sifarişimi necə izləyə bilərəm?",
      answer: "Hesabınıza daxil olaraq bütün sifarişlərinizin statusunu real vaxtda izləyə bilərsiniz. Hər sifarişin gedişatı, başlama vaxtı və tamamlanma müddəti göstərilir. Eyni zamanda SMS və email bildirişləri də göndəririk."
    },
    {
      question: "Ödəniş metodları hansılardır?",
      answer: "Müxtəlif ödəniş metodlarını qəbul edirik: Bank kartları (Visa/MasterCard), Kapital Bank, Rabitəbank və digər yerli bank kartları. Bütün ödənişlər SSL şifrələmə ilə təmin edilir və tamamilə təhlükəsizdir."
    },
    {
      question: "Xidmətlər başladıqdan sonra dayandırıla bilərmi?",
      answer: "Xidmət başladıqdan sonra dayandırılması mümkün deyil, çünki proses avtomatik olaraq işə salınır. Lakin əgər texniki problem yaşanırsa, dəstək komandamızla əlaqə saxlayın və həll yolu tapacağıq."
    },
    {
      question: "Geri qaytarma siyasəti necədir?",
      answer: "Əgər xidmət başlamayıbsa və ya keyfiyyət gözlənilən səviyyədə deyilsə, 7 gün ərzində tam geri qaytarma mümkündür. Xidmət başladıqdan sonra qismən geri qaytarma yalnız xüsusi hallarda həyata keçirilir."
    },
    {
      question: "24/7 müştəri dəstəyi mövcuddur?",
      answer: "Bəli, müştəri dəstəyi komandamız 24/7 xidmətinizdədir. WhatsApp, email və ya telefon vasitəsilə bizimlə əlaqə saxlaya bilərsiniz. Bütün suallarınızı ən qısa müddətdə cavablandırırıq."
    },
    {
      question: "Toplu sifarişlər üçün endirimlər varmı?",
      answer: "Bəli, böyük həcmli sifarişlər və müntəzəm müştərilər üçün xüsusi endirimlər təklif edirik. 10.000+ həcmli sifarişlərdə 10% endirim, 50.000+ sifarişlərdə isə 20% endirim tətbiq olunur."
    },
    {
      question: "Hesabımın təhlükəsizliyi təmin edilirmi?",
      answer: "Bəli, istifadə etdiyimiz bütün metodlar platform qaydalarına uyğun və tamamilə təhlükəsizdir. Real istifadəçilər və təbii artım metodları sayəsində hesabınız heç bir risk altında deyil. İndiyədək heç bir müştərimizin hesabı bağlanmamışdır."
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
