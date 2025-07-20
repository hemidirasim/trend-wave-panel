const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Haqqımızda</h1>
        
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Sosial media xidmətlərində lider platformaya xoş gəlmisiniz
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Missiyamız</h2>
              <p className="text-muted-foreground">
                Müştərilərimizə yüksək keyfiyyətli sosial media xidmətləri təqdim etmək və 
                onların rəqəmsal mövcudluğunu güclündirmək məqsədilə fəaliyyət göstəririk.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Viziyamız</h2>
              <p className="text-muted-foreground">
                Sosial media sahəsində ən etibarlı və innovativ xidmət təminatçısı olmaq, 
                müştərilərimizin uğuruna töhfə vermək.
              </p>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Niyə Bizi Seçməlisiniz?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold mb-2">Sürətli Çatdırılma</h3>
                <p className="text-sm text-muted-foreground">
                  Sifarişləriniz ən qısa zamanda yerinə yetirilir
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold mb-2">Təhlükəsizlik</h3>
                <p className="text-sm text-muted-foreground">
                  Məlumatlarınızın təhlükəsizliyi bizim prioritetimizdir
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold mb-2">24/7 Dəstək</h3>
                <p className="text-sm text-muted-foreground">
                  Hər zaman sizin yanınızda dəstək xidməti
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Bizə Qatılın</h2>
            <p className="text-muted-foreground mb-6">
              Minlərlə məmnun müştərimizin arasına qatılaraq sosial media uğurunuzu bizimlə qurşalayın
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;