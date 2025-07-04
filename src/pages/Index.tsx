
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiService, Service } from '@/components/ApiService';
import { 
  Play, 
  Heart, 
  Users, 
  MessageCircle, 
  Share2, 
  Eye, 
  Star,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  UserPlus
} from 'lucide-react';

const Index = () => {
  const [stats, setStats] = useState({
    totalOrders: 125000,
    activePlatforms: 4,
    averageRating: 4.9,
    deliveryTime: '1-6'
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Define allowed platforms and service types
  const ALLOWED_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'telegram'];
  const ALLOWED_SERVICE_TYPES = ['like', 'view', 'follow', 'likes', 'views', 'followers', 'subscriber', 'subscribers'];

  const PLATFORM_ICONS = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '▶️',
    telegram: '✈️'
  };

  const SERVICE_TYPE_ICONS = {
    like: Heart,
    view: Eye,
    follow: Users,
    subscriber: UserPlus
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      
      // Filter services to only include allowed platforms and service types
      const filteredData = data.filter(service => {
        const platformMatch = ALLOWED_PLATFORMS.includes(service.platform.toLowerCase());
        const serviceTypeMatch = ALLOWED_SERVICE_TYPES.some(type => 
          service.type_name.toLowerCase().includes(type) || 
          service.public_name.toLowerCase().includes(type)
        );
        return platformMatch && serviceTypeMatch;
      });
      
      setServices(filteredData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByPlatform = (platform: string) => {
    return services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  const getServiceTypeForPlatform = (platform: string) => {
    const platformServices = getServicesByPlatform(platform);
    const serviceTypes = [...new Set(platformServices.map(service => {
      const typeName = service.type_name.toLowerCase();
      const publicName = service.public_name.toLowerCase();
      
      if (typeName.includes('like') || publicName.includes('like')) return 'like';
      if (typeName.includes('view') || publicName.includes('view')) return 'view';
      if (typeName.includes('follow') || publicName.includes('follow')) {
        // For YouTube, show 'subscriber' instead of 'follow'
        return platform.toLowerCase() === 'youtube' ? 'subscriber' : 'follow';
      }
      if (typeName.includes('subscriber') || publicName.includes('subscriber')) return 'subscriber';
      return null;
    }).filter(Boolean))];
    
    return serviceTypes;
  };

  const getServiceTypeLabel = (serviceType: string, platform: string) => {
    if (serviceType === 'subscriber' && platform.toLowerCase() === 'youtube') {
      return 'Subscriber';
    }
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

  const features = [
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Orders start processing within 1-60 minutes of placement'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All services are delivered safely without risking your account'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    },
    {
      icon: TrendingUp,
      title: 'High Quality',
      description: 'Premium quality engagement from real and active users'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      rating: 5,
      text: 'Amazing service! My YouTube channel grew by 50K subscribers in just 2 weeks.',
      platform: 'YouTube'
    },
    {
      name: 'Mike Chen',
      role: 'Business Owner',
      rating: 5,
      text: 'Perfect for boosting my Instagram business page. Great quality followers!',
      platform: 'Instagram'
    },
    {
      name: 'Emma Davis',
      role: 'Influencer',
      rating: 5,
      text: 'Fast delivery and excellent results. My TikTok videos are going viral!',
      platform: 'TikTok'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              #1 Social Media Marketing Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Boost Your Social Media Presence
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get real followers, likes, views, and engagement across all major social media platforms. 
              Professional SMM services trusted by 50,000+ customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/services">
                  Browse Services <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/track">Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{stats.totalOrders.toLocaleString()}+</div>
              <div className="text-muted-foreground">Orders Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{stats.activePlatforms}</div>
              <div className="text-muted-foreground">Active Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{stats.averageRating}</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{stats.deliveryTime}h</div>
              <div className="text-muted-foreground">Delivery Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported Platforms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Grow your presence across all major social media platforms with our comprehensive services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ALLOWED_PLATFORMS.map((platform) => (
              <Card key={platform} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center">
                    <div className="text-4xl mb-3">{PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]}</div>
                  </div>
                  <CardTitle className="text-xl text-center capitalize">{platform}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getServiceTypeForPlatform(platform).map((serviceType) => {
                      const IconComponent = SERVICE_TYPE_ICONS[serviceType as keyof typeof SERVICE_TYPE_ICONS];
                      return (
                        <div key={serviceType} className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{getServiceTypeLabel(serviceType, platform)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button asChild className="w-full mt-4" variant="outline">
                    <Link to={`/services?platform=${platform}`}>
                      View Services
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SocialBoost?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the highest quality social media marketing services with unmatched reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their social media presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <Badge variant="secondary">{testimonial.platform}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start growing your online presence today with our premium social media marketing services
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to="/order">
              Place Your First Order <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
