import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService, Service } from '@/components/ApiService';
import { Loader2, Target, Star, Instagram, Youtube, Facebook, BookOpen, Users, BarChart3, ArrowUpDown, Lightbulb, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultPlatform = searchParams.get('platform') || '';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [priceSort, setPriceSort] = useState<string>('none');

  const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching growth services from API...');
      const data = await apiService.getServices();
      console.log('Raw API response:', data);
      
      const filteredData = data.filter(service => {
        if (!service || !service.platform || !service.id_service) {
          console.log('Skipping invalid service:', service);
          return false;
        }
        
        const platformMatch = allowedPlatforms.includes(service.platform.toLowerCase());
        if (!platformMatch) {
          console.log('Platform not supported:', service.platform);
          return false;
        }
        
        if (!service.prices || service.prices.length === 0) {
          console.log('No pricing info for service:', service.id_service);
          return false;
        }
        
        return true;
      });
      
      console.log('Filtered growth services:', filteredData);
      setServices(filteredData);
      
      if (filteredData.length === 0) {
        toast.error('Seçilmiş platformlar üçün growth xidməti tapılmadı');
      }
    } catch (error) {
      console.error('Error fetching growth services:', error);
      toast.error('Growth xidmətləri yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationClick = (serviceId: string) => {
    if (user) {
      navigate(`/order?service=${serviceId}`);
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      facebook: 'bg-blue-500',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      tiktok: () => <div className="w-4 h-4 bg-current rounded-sm" />,
    };
    return icons[platform.toLowerCase()] || null;
  };

  const getServiceTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'Strategy': Target,
      'Analytics': BarChart3,
      'Content': BookOpen,
      'Engagement': Users,
      'Growth': TrendingUp,
      'Consultation': Lightbulb,
      'Other': Star,
    };
    return icons[type] || Star;
  };

  const getUniquePlatforms = () => {
    const platforms = services
      .map(service => service.platform.toLowerCase())
      .filter(platform => allowedPlatforms.includes(platform));
    return [...new Set(platforms)];
  };

  const getUniqueServiceTypes = (platform: string) => {
    const platformServices = services.filter(service => 
      service.platform.toLowerCase() === platform.toLowerCase()
    );
    
    // type_name-dən service növlərini çıxar
    const types = platformServices
      .map(service => {
        if (service.type_name && service.type_name.trim() !== '') {
          return service.type_name;
        }
        // Əgər type_name yoxdursa, public_name-dən çıxarmağa çalış
        if (service.public_name) {
          const name = service.public_name.toLowerCase();
          if (name.includes('like')) return 'Likes';
          if (name.includes('follow')) return 'Followers';
          if (name.includes('view')) return 'Views';
          if (name.includes('share')) return 'Shares';
          if (name.includes('comment')) return 'Comments';
          if (name.includes('repost')) return 'Reposts';
        }
        return 'Other';
      })
      .filter(type => type && type.trim() !== '');
    
    const uniqueTypes = [...new Set(types)];
    
    // "Other"i siyahıdan çıxar və sonuna əlavə et
    const otherIndex = uniqueTypes.indexOf('Other');
    if (otherIndex > -1) {
      uniqueTypes.splice(otherIndex, 1);
      uniqueTypes.push('Other');
    }
    
    return uniqueTypes;
  };

  const getFilteredServices = () => {
    if (!selectedPlatform || !selectedServiceType) {
      return [];
    }

    let filtered = services.filter(service => 
      service.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );

    // Xidmət növü filteri
    filtered = filtered.filter(service => {
      const serviceType = service.type_name && service.type_name.trim() !== '' 
        ? service.type_name 
        : getServiceTypeFromName(service.public_name);
      return serviceType === selectedServiceType;
    });

    // Qiymət sıralaması
    if (priceSort && priceSort !== 'none') {
      filtered = filtered.sort((a, b) => {
        const priceA = parseFloat(a.prices?.[0]?.price || '0');
        const priceB = parseFloat(b.prices?.[0]?.price || '0');
        
        if (priceSort === 'asc') {
          return priceA - priceB; // Ucuzdan bahaya
        } else {
          return priceB - priceA; // Bahadan ucuza
        }
      });
    }

    return filtered;
  };

  const getServiceTypeFromName = (publicName: string) => {
    if (!publicName) return 'Other';
    const name = publicName.toLowerCase();
    if (name.includes('like')) return 'Likes';
    if (name.includes('follow')) return 'Followers';
    if (name.includes('view')) return 'Views';
    if (name.includes('share')) return 'Shares';
    if (name.includes('comment')) return 'Comments';
    if (name.includes('repost')) return 'Reposts';
    return 'Other';
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType(''); // Reset service type when platform changes
    setPriceSort('none'); // Reset price sort when platform changes
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Growth xidmətləri yüklənir...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Sosial Media <span className="text-primary">Growth Strategies</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Instagram, TikTok, YouTube və Facebook üçün professional growth consultancy və strategic guidance
            </p>
          </div>

          {/* Growth Services Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-500 text-white">Strategic Planning</Badge>
                </div>
                <CardTitle className="text-xl">Growth Strategy Development</CardTitle>
                <CardDescription>
                  Comprehensive growth strategies tailored to your brand and audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Audience analysis and targeting
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Content strategy planning
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Growth timeline and milestones
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => setIsAuthDialogOpen(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Get Strategy Consultation
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg text-white">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <Badge className="bg-green-500 text-white">Analytics & Insights</Badge>
                </div>
                <CardTitle className="text-xl">Performance Analytics</CardTitle>
                <CardDescription>
                  Advanced analytics and performance tracking tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Detailed performance reports
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Competitor analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Growth optimization tips
                  </div>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={() => setIsAuthDialogOpen(true)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Access Analytics Tools
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <Badge className="bg-purple-500 text-white">Education</Badge>
                </div>
                <CardTitle className="text-xl">Expert Training</CardTitle>
                <CardDescription>
                  Learn from social media experts and industry professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Video tutorials and guides
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    One-on-one mentoring
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    Best practices and tips
                  </div>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={() => setIsAuthDialogOpen(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Platform-specific features */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Platform-Specific Growth Tools</h2>
            <p className="text-muted-foreground">Specialized tools and strategies for each major social media platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Instagram', 'TikTok', 'YouTube', 'Facebook'].map((platform) => (
              <Card key={platform} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${getPlatformColor(platform.toLowerCase())} rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl`}>
                    {platform === 'Instagram' && '📸'}
                    {platform === 'TikTok' && '🎵'}
                    {platform === 'YouTube' && '📺'}
                    {platform === 'Facebook' && '👥'}
                  </div>
                  <CardTitle className="text-xl">{platform}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-muted-foreground">✓ Growth strategy consultation</div>
                    <div className="text-sm text-muted-foreground">✓ Performance analytics</div>
                    <div className="text-sm text-muted-foreground">✓ Expert guidance</div>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => setIsAuthDialogOpen(true)}>
                    Explore {platform} Tools
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
