import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dəstək</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground mb-8">
            Sizə kömək etmək üçün buradayıq. Suallarınızı göndərin və ən qısa zamanda cavab verərik.
          </p>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Əlaqə Məlumatları</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@example.com</p>
                <p><strong>Telefon:</strong> +994 XX XXX XX XX</p>
                <p><strong>İş saatları:</strong> Bazar ertəsi - Cümə, 9:00-18:00</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Tez-tez Verilən Suallar</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Xidmətlər necə işleyir?</h3>
                  <p className="text-sm text-muted-foreground">
                    Platformamız sosial media xidmətlərini sadə və təhlükəsiz şəkildə təqdim edir.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Ödəniş etmək təhlükəsizdirmi?</h3>
                  <p className="text-sm text-muted-foreground">
                    Bəli, bütün ödənişlər şifrələnmiş və təhlükəsiz kanallarla həyata keçirilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;