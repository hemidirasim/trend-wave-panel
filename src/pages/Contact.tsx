
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-poçt',
      value: 'support@hitloyal.com',
      link: 'mailto:support@hitloyal.com'
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+994 55 289 57 03',
      link: 'tel:+994552895703'
    },
    {
      icon: MapPin,
      title: 'Ünvan',
      value: 'Cəfər Cabbarlı 44 (Caspian Plaza)',
      link: '#'
    },
    {
      icon: Clock,
      title: 'İş Saatları',
      value: '24/7 Dəstək',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bizimlə Əlaqə
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Suallarınız var? Bizə müraciət edin və peşəkar komandamız sizə kömək etsin. 
            24/7 dəstək xidməti ilə həmişə yanınızdayıq.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Əlaqə Məlumatları</h2>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="p-3 bg-primary/10 rounded-lg mr-4">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        {info.link !== '#' ? (
                          <a 
                            href={info.link} 
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle>Niyə HitLoyal?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Sürətli cavab müddəti (24 saat ərzində)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Peşəkar konsultasiya xidməti
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Fərdiləşdirilmiş həllər
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Şəffaf qiymətləndirmə
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Bizə Yazın</CardTitle>
                <p className="text-muted-foreground">
                  Sualınızı göndərin və tezliklə sizinlə əlaqə saxlayaq.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Ad və Soyad *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Adınızı daxil edin"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        E-poçt *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Mövzu *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Mesajınızın mövzusu"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mesaj *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Mesajı Göndər
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map or Additional Info Section */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ofisimizə Yolunuzu Tapın</h3>
                <p className="text-muted-foreground mb-6">
                  Bakı şəhəri, Cəfər Cabbarlı küçəsi 44, Caspian Plaza binasında yerləşirik. 
                  Metro stansiyalarına yaxın və əlçatan yerdəyik.
                </p>
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg p-8">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Cəfər Cabbarlı 44 (Caspian Plaza)</p>
                  <p className="text-muted-foreground mt-2">Bakı, Azərbaycan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
