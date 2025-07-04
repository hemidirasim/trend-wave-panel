import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle,
  Star,
  Users,
  Heart,
  Eye,
  Share2,
  ThumbsUp,
  Zap
} from 'lucide-react';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultPlatform = searchParams.get('platform') || 'instagram';

  const handleOrderClick = () => {
    if (user) {
      navigate('/order');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: MessageCircle, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
  ];

  const services = {
    instagram: [
      {
        id: 'ig_followers',
        name: 'Instagram Followers',
        description: 'Keyfiyyətli və real izləyicilər',
        icon: Users,
        price: 0.50,
        minOrder: 100,
        maxOrder: 100000,
        features: ['Real izləyicilər', 'Sürətli çatdırılma', 'Düşmə garantiyası']
      },
      {
        id: 'ig_likes',
        name: 'Instagram Likes',
        description: 'Postlarınıza keyfiyyətli bəyənmələr',
        icon: Heart,
        price: 0.25,
        minOrder: 50,
        maxOrder: 50000,
        features: ['Sürətli başlama', 'Təbii görünüş', 'Yüksək keyfiyyət']
      },
      {
        id: 'ig_views',
        name: 'Instagram Views',
        description: 'Video və reels üçün baxış sayı',
        icon: Eye,
        price: 0.15,
        minOrder: 1000,
        maxOrder: 1000000,
        features: ['Dərhal başlama', 'Yüksək sürət', 'Təhlükəsiz']
      }
    ],
    facebook: [
      {
        id: 'fb_likes',
        name: 'Facebook Likes',
        description: 'Səhifə və post bəyənmələri',
        icon: ThumbsUp,
        price: 0.35,
        minOrder: 100,
        maxOrder: 50000,
        features: ['Real istifadəçilər', 'Sürətli çatdırılma', 'Keyfiyyət garantiyası']
      },
      {
        id: 'fb_followers',
        name: 'Facebook Followers',
        description: 'Səhifəniz üçün izləyicilər',
        icon: Users,
        price: 0.60,
        minOrder: 50,
        maxOrder: 25000,
        features: ['Aktiv hesablar', 'Düşmə garantiyası', 'Təbii artım']
      },
      {
        id: 'fb_shares',
        name: 'Facebook Shares',
        description: 'Post paylaşımları',
        icon: Share2,
        price: 0.80,
        minOrder: 25,
        maxOrder: 10000,
        features: ['Real paylaşımlar', 'Sürətli başlama', 'Yüksək keyfiyyət']
      }
    ],
    tiktok: [
      {
        id: 'tt_followers',
        name: 'TikTok Followers',
        description: 'TikTok hesabınız üçün izləyicilər',
        icon: Users,
        price: 0.75,
        minOrder: 100,
        maxOrder: 100000,
        features: ['Real izləyicilər', 'Sürətli artım', 'Düşmə garantiyası']
      },
      {
        id: 'tt_likes',
        name: 'TikTok Likes',
        description: 'Video bəyənmələri',
        icon: Heart,
        price: 0.30,
        minOrder: 100,
        maxOrder: 100000,
        features: ['Sürətli çatdırılma', 'Yüksək keyfiyyət', 'Təbii görünüş']
      },
      {
        id: 'tt_views',
        name: 'TikTok Views',
        description: 'Video baxış sayı',
        icon: Eye,
        price: 0.10,
        minOrder: 1000,
        maxOrder: 1000000,
        features: ['Dərhal başlama', 'Çox sürətli', 'Ən ucuz qiymət']
      }
    ],
    youtube: [
      {
        id: 'yt_subscribers',
        name: 'YouTube Subscribers',
        description: 'Kanalınız üçün abunəçilər',
        icon: Users,
        price: 1.20,
        minOrder: 50,
        maxOrder: 50000,
        features: ['Real abunəçilər', 'Yavaş artım', 'Düşmə garantiyası']
      },
      {
        id: 'yt_likes',
        name: 'YouTube Likes',
        description: 'Video bəyənmələri',
        icon: ThumbsUp,
        price: 0.45,
        minOrder: 50,
        maxOrder: 25000,
        features: ['Sürətli başlama', 'Keyfiyyətli hesablar', 'Təhlükəsiz']
      },
      {
        id: 'yt_views',
        name: 'YouTube Views',
        description: 'Video baxış sayı',
        icon: Eye,
        price: 0.20,
        minOrder: 1000,
        maxOrder: 1000000,
        features: ['Sürətli çatdırılma', 'Yüksək keyfiyyət', 'Ən yaxşı qiymət']
      }
    ]
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Sosial Media <span className="text-primary">Xidmətləri</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bütün platformalar üçün keyfiyyətli və sürətli SMM xidmətləri
            </p>
          </div>

          <Tabs defaultValue={defaultPlatform} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    {platform.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services[platform.id as keyof typeof services]?.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Card key={service.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <ServiceIcon className="h-8 w-8 text-primary" />
                            <Badge variant="secondary">${service.price}/1K</Badge>
                          </div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Min: {service.minOrder.toLocaleString()}</span>
                            <span>Maks: {service.maxOrder.toLocaleString()}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full" 
                            onClick={handleOrderClick}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Sifariş ver
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Footer />
      </div>

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </>
  );
};

export default Services;
