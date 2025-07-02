import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiService, Service } from '@/components/ApiService';
import { Loader2, Search, Filter, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || 'all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedPlatform, selectedType]);

  useEffect(() => {
    if (searchParams.get('platform')) {
      setSelectedPlatform(searchParams.get('platform') || 'all');
    }
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.getServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services. Please try again.');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.public_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.type_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(service =>
        service.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(service =>
        service.type_name.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const getPlatforms = () => {
    const platforms = [...new Set(services.map(service => service.platform))];
    return platforms.sort();
  };

  const getServiceTypes = () => {
    const types = [...new Set(services.map(service => service.type_name))];
    return types.sort();
  };

  const formatPrice = (service: Service) => {
    if (service.prices && service.prices.length > 0) {
      const firstPrice = service.prices[0];
      const price = parseFloat(firstPrice.price);
      const pricingPer = parseInt(firstPrice.pricing_per);
      return `$${price.toFixed(2)} per ${pricingPer.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  const getMinQuantity = (service: Service) => {
    return parseInt(service.amount_minimum).toLocaleString();
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-purple-500',
      facebook: 'bg-blue-500',
      twitter: 'bg-sky-500',
      telegram: 'bg-blue-400',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading services...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Social Media Marketing Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose from our comprehensive range of SMM services across all major platforms
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {getPlatforms().map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getServiceTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {filteredServices.length} services found
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id_service} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`${getPlatformColor(service.platform)} text-white`}
                      >
                        {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.9</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{service.public_name}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.type_name.charAt(0).toUpperCase() + service.type_name.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Starting Price:</span>
                        <span className="font-semibold">{formatPrice(service)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min. Quantity:</span>
                        <span className="font-semibold">{getMinQuantity(service)}</span>
                      </div>
                      {service.example && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Example: </span>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {service.example}
                          </code>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {service.is_geo === '1' && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Geo-targeted
                        </Badge>
                      )}
                      {service.is_drip === '1' && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Drip-feed
                        </Badge>
                      )}
                    </div>

                    <Button asChild className="w-full">
                      <Link to={`/order?service=${service.id_service}`}>
                        Order Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;