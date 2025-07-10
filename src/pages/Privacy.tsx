
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
            Məxfiliyiniz bizim üçün ən vacib prioritetdir. Bu siyasət HitLoyal-un məlumatlarınızı necə qoruyub istifadə etdiyini izah edir.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Şirkət Məlumatları</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Bu məxfilik siyasəti <strong>Midiya Agency MMC</strong> (VOEN: 6402180791) tərəfindən idarə olunan HitLoyal platforması üçün tətbiq edilir. Bizim əsas missiyamız müştərilərimizin rəqəmsal marketinq uğurlarını təmin etməklə yanaşı, onların şəxsi məlumatlarının tam təhlükəsizliyini qorumaqdır.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Topladığımız Məlumatlar</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h4>Müştəri Məlumatları</h4>
              <p>
                Reklam və marketinq xidmətlərimizi təqdim etmək üçün aşağıdakı məlumatları topluyuruq:
              </p>
              <ul>
                <li>Şəxsi və ya şirkət adı, əlaqə məlumatları</li>
                <li>Email ünvanı və telefon nömrəsi</li>
                <li>Biznes sahəsi və target auditoriya məlumatları</li>
                <li>Reklam kampaniya tələbləri və büdcə məlumatları</li>
                <li>Ödəniş məlumatları (təhlükəsiz ödəniş sistemləri vasitəsilə)</li>
              </ul>

              <h4>Texniki Məlumatlar</h4>
              <p>
                Platformamızın performansını artırmaq üçün toplanır:
              </p>
              <ul>
                <li>Saytda keçirdiyi vaxt və baxdığı səhifələr</li>
                <li>İstifadə olunan cihaz və brauzer məlumatları</li>
                <li>Reklam kampaniyalarının performans göstəriciləri</li>
                <li>Analitik məlumatlar və istifadəçi davranış nümunələri</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Məlumatların İstifadə Məqsədləri</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>Topladığımız məlumatları yalnız aşağıdakı məqsədlər üçün istifadə edirik:</p>
              <ul>
                <li>Google Ads, Facebook Ads və digər reklam kampaniyalarını planlaşdırmaq</li>
                <li>SEO və sosial media strategiyaları hazırlamaq</li>
                <li>Veb sayt və brend dizayn xidmətlərini təqdim etmək</li>
                <li>Kampaniya nəticələri haqqında hesabatlar hazırlamaq</li>
                <li>Müştəri dəstəyi və məsləhət xidmətləri göstərmək</li>
                <li>Ödəniş əməliyyatlarını təhlükəsiz şəkildə həyata keçirmək</li>
                <li>Qanuni tələblərə uyğunluğu təmin etmək</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Məlumat Paylaşımı</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Biz müştəri məlumatlarını satmır və ya icarəyə vermiriik. Məlumatlarınız yalnız aşağıdakı hallarda paylaşıla bilər:
              </p>
              <ul>
                <li><strong>Reklam Platformaları:</strong> Google, Facebook kimi platformalarla yalnız kampaniya məqsədilə</li>
                <li><strong>Ödəniş Təminatçıları:</strong> Təhlükəsiz ödəniş emalı üçün</li>
                <li><strong>Qanuni Tələblər:</strong> Hüquqi öhdəliklər çərçivəsində</li>
                <li><strong>Razılıq:</strong> Sizin açıq razılığınızla müəyyən məqsədlər üçün</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Məlumat Təhlükəsizliyi</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Məlumatlarınızın qorunması üçün güclü təhlükəsizlik tədbirləri həyata keçiririk:
              </p>
              <ul>
                <li>SSL şifrələməsi və təhlükəsiz serverlərdə saxlanma</li>
                <li>Müntəzəm təhlükəsizlik auditləri və yoxlamalar</li>
                <li>Məhdud giriş nəzarəti və avtorizasiya</li>
                <li>İşçilərin məlumat qorunması sahəsində təlimi</li>
                <li>Düzenli məlumat ehtiyat nüsxələrinin yaradılması</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Məlumat Saxlanma Müddəti</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Məlumatlarınızı yalnız zəruri olduğu müddət ərzində saxlayırıq:
              </p>
              <ul>
                <li>Müştəri hesab məlumatları: Hesab aktiv olduğu müddətdə</li>
                <li>Reklam kampaniya məlumatları: 5 il müddətində</li>
                <li>Əlaqə yazışmaları: 3 il müddətində</li>
                <li>Ödəniş məlumatları: Maliyyə qanunvericiliyinin tələbi ilə</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Sizin Hüquqlarınız</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>Siz aşağıdakı hüquqlara sahibsiniz:</p>
              <ul>
                <li>Şəxsi məlumatlarınızı əldə etmək və nəzərdən keçirmək</li>
                <li>Yanlış və ya natamamı məlumatları düzəltmək</li>
                <li>Hesabınızı və məlumatlarınızı silmək</li>
                <li>Marketinq kommunikasiyalarından imtina etmək</li>
                <li>Məlumat portativliyi tələb etmək</li>
                <li>Müəyyən məlumat işləmə fəaliyyətlərindən imtina etmək</li>
              </ul>
              <p>
                Bu hüquqları həyata keçirmək üçün info@hitloyal.com ünvanına müraciət edin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies və İzləmə</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Daha yaxşı xidmət üçün cookies istifadə edirik:
              </p>
              <ul>
                <li><strong>Zəruri Cookies:</strong> Saytın əsas funksiyaları üçün</li>
                <li><strong>Analitik Cookies:</strong> Sayt performansını başa düşmək üçün</li>
                <li><strong>Funksional Cookies:</strong> Tənzimləmələri yadda saxlamaq üçün</li>
                <li><strong>Reklam Cookies:</strong> Əlaqəli reklamlar göstərmək üçün</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Siyasətdə Dəyişikliklər</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Bu məxfilik siyasətini vaxtaşırı yeniləyə bilərik. Mühüm dəyişikliklər email və ya platform bildirişi ilə size çatdırılacaq. Dəyişikliklərdən sonra xidmətin istifadəsi yeni siyasətin qəbul edilməsi deməkdir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Bizimlə Əlaqə</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Bu məxfilik siyasəti haqqında suallarınız üçün:
              </p>
              <p>
                <strong>Midiya Agency MMC</strong><br />
                <strong>VOEN:</strong> 6402180791<br />
                <strong>Email:</strong> info@hitloyal.com<br />
                <strong>Məxfilik Sorğuları:</strong> privacy@hitloyal.com<br />
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
