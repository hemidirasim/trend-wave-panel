
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Qaydalar və Şərtlər</h1>
          <p className="text-muted-foreground text-lg">
            SocialBoost SMM xidmətlərini istifadə etməzdən əvvəl bu şərtləri diqqətlə oxuyun
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Şərtlərin Qəbulu</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost SMM xidmətləri platformasını ("Xidmət") əldə etməklə və istifadə etməklə, siz bu razılaşmanın şərtlərini və müddəalarını qəbul etmiş olursunuz. Əgər yuxarıdakı şərtlərə əməl etməyi qəbul etmirsinizsə, lütfən bu xidməti istifadə etməyin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Xidmətin Təsviri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost Instagram, TikTok, YouTube və Facebook daxil olmaqla müxtəlif sosial media platformalarında şəxslərə və biznes strukturlarına real və keyfiyyətli izləyicilər, bəyənmələr, baxışlar və digər SMM xidmətləri təqdim edir.
              </p>
              <p>
                Xidmətlərimizə daxildir:
              </p>
              <ul>
                <li>Real və aktiv sosial media izləyiciləri</li>
                <li>Post və video bəyənmələri</li>
                <li>Video baxışları və şərhləri</li>
                <li>Instagram, TikTok, YouTube və Facebook xidmətləri</li>
                <li>24/7 müştəri dəstəyi</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. İstifadəçi Məsuliyyətləri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>İstifadəçilər aşağıdakılardan məsuldurlar:</p>
              <ul>
                <li>Dəqiq və yenilənmiş məlumat vermək</li>
                <li>Sosial media platformalarının qaydalarına uyğun davranmaq</li>
                <li>Hesab məlumatlarının məxfiliyini qorumaq</li>
                <li>Xidmətlərimizi etik və məsuliyyətlə istifadə etmək</li>
                <li>Bütün tətbiq olunan qanun və qaydalara əməl etmək</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Xidmət Məhdudiyyətləri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost real və keyfiyyətli SMM xidmətləri təqdim edir. Xidmətlərimiz sosial media platformalarının qaydalarına uyğundur və 100% təhlükəsizdir. Lakin internet və sosial media platformalarının dəyişkən təbiətinə görə nəticələrdə kiçik dəyişikliklər ola bilər.
              </p>
              <p>
                Sifarişləriniz adətən 24 saat ərzində başlayır və xidmətin növündən asılı olaraq tamamlanır. Biz şifrənizi və ya giriş məlumatlarınızı heç vaxt tələb etmirik.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Ödəniş və Geri Qaytarma</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Ödəniş şərtləri xidmətin növünə görə dəyişir. Xidmət təqdim edilməyibsə və ya keyfiyyət göstərilən standartlara uyğun deyilsə, 30 gün ərzində tam geri qaytarma təklif edirik. Müştəri məmnuniyyəti bizim prioritetimizdir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Əqli Mülkiyyət Hüquqları</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost tərəfindən təqdim edilən bütün məzmun, metodikalar və materiallar əqli mülkiyyət qanunları ilə qorunur. İstifadəçilər yazılı icazə olmadan məlumatları yenidən paylaşa və ya sata bilməzlər.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Məxfilik və Məlumat Qorunması</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Biz sizin məxfiliyinizə hörmət edirik və şəxsi məlumatlarınızı qorumağa sadiqik. Məlumatlarınızı necə topladığımız, istifadə etdiyimiz və qoruduğumuz haqqında ətraflı məlumat üçün Məxfilik Siyasətimizə baxın.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Məsuliyyətin Məhdudlaşdırılması</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost xidmətimizdən istifadəniz nəticəsində yaranan heç bir dolayı, təsadüfi, xüsusi və ya cəzalandırıcı zərərə görə məsuliyyət daşımır. Bu, gəlir itkisi, məlumat itkisi və ya digər maddi olmayan itkiləri də əhatə edir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Xidmətin Dayandırılması</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Hər iki tərəf yazılı bildiriş ilə istənilən vaxt xidmət müqaviləsini ləğv edə bilər. Dayandırma zamanı xüsusi materiallara və davamlı dəstəyə çıxışınız dayandırılacaq.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Şərtlərdə Dəyişikliklər</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                SocialBoost bu şərtləri istənilən vaxt dəyişdirmək hüququnu özündə saxlayır. Mühüm dəyişikliklər email və ya platform bildirişi ilə sizə çatdırılacaq. Dəyişikliklərdən sonra xidmətin istifadəsi yeni şərtlərin qəbul edilməsi deməkdir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Əlaqə Məlumatları</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Bu Qaydalar və Şərtlər haqqında suallarınız üçün bizimlə əlaqə saxlayın:
              </p>
              <p>
                Email: info@socialboost.az<br />
                Son yenilənmə: Yanvar 2024
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
