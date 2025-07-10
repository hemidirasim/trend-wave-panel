import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiService, Service } from '@/components/ApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { Loader2, ShoppingCart, AlertCircle, CheckCircle, Calculator, Instagram, Youtube, Facebook, Heart, Users, Eye, Share, MessageCircle, Repeat, Star, Info, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [placing, setPlacing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('service') || '',
    url: '',
    quantity: '',
    additionalParams: {} as Record<string, any>
  });
  
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'low-to-high' | 'high-to-low'>('low-to-high');

  // URL-dən platform parametrini oxu
  const urlPlatform = searchParams.get('platform');

  // Yalnız bu 4 platformu göstər
  const allowedPlatforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // URL-dən platform parametri varsa, onu seç
    if (urlPlatform && allowedPlatforms.includes(urlPlatform.toLowerCase())) {
      setSelectedPlatform(urlPlatform.toLowerCase());
    }
  }, [urlPlatform]);

  useEffect(() => {
    if (services.length > 0 && formData.serviceId) {
      const service = services.find(s => s.id_service.toString() === formData.serviceId);
      if (service) {
        console.log('Selected service found:', service);
        setSelectedService(service);
        setSelectedPlatform(service.platform.toLowerCase());
        
        // Set service type based on the selected service
        const serviceType = service.type_name && service.type_name.trim() !== '' 
          ? service.type_name 
          : getServiceTypeFromName(service.public_name);
        setSelectedServiceType(serviceType);
        
        calculatePrice(service, parseInt(formData.quantity) || 0);
        
        // Fetch detailed service information
        console.log('Fetching detailed service information...');
        fetchServiceDetails(formData.serviceId);
      }
    }
  }, [services, formData.serviceId, formData.quantity, settings.commission_rate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services from API...');
      const data = await apiService.getServices();
      console.log('Services loaded:', data);
      
      // API-dən gələn məlumatları filterlə və qiymətə görə sırala
      const filteredData = data.filter(service => {
        if (!service || !service.platform || !service.id_service) {
          return false;
        }
        return allowedPlatforms.includes(service.platform.toLowerCase());
      });
      
      // Qiymətə görə sırala (avtomatik olaraq ucuzdan bahaya)
      const sortedData = [...filteredData].sort((a, b) => {
        const priceA = parseFloat(a.prices[0]?.price || '0');
        const priceB = parseFloat(b.prices[0]?.price || '0');
        return priceA - priceB;
      });
      
      setServices(sortedData);
    } catch (error) {
      toast.error('Xidmətlər yüklənərkən xəta baş verdi');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceDetails = async (serviceId: string) => {
    try {
      setLoadingServiceDetails(true);
      console.log('Fetching service details for ID:', serviceId);
      const details = await apiService.getServiceDetails(serviceId);
      console.log('Service details response:', details);
      
      if (details) {
        setServiceDetails(details);
        console.log('Service details set:', {
          hasDescription: !!details.description,
          description: details.description
        });
      } else {
        console.log('No service details received');
        setServiceDetails(null);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      setServiceDetails(null);
    } finally {
      setLoadingServiceDetails(false);
    }
  };

  const calculatePrice = (service: Service, quantity: number) => {
    if (!service || !quantity) {
      setCalculatedPrice(0);
      return;
    }
    
    console.log('Calculating price with commission rate:', settings.commission_rate);
    const price = apiService.calculatePrice(service, quantity, settings.commission_rate);
    console.log('Calculated price:', price);
    setCalculatedPrice(price);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceId) {
      newErrors.serviceId = 'Xidmət seçin';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL tələb olunur';
    } else if (selectedService && !apiService.validateUrl(selectedService.platform, formData.url)) {
      newErrors.url = `Yanlış ${selectedService.platform} URL formatı`;
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Miqdar tələb olunur';
    } else {
      const quantity = parseInt(formData.quantity);
      if (selectedService) {
        const minQuantity = parseInt(selectedService.amount_minimum);
        const increment = parseInt(selectedService.amount_increment);
        
        if (quantity < minQuantity) {
          newErrors.quantity = `Minimum miqdar ${minQuantity.toLocaleString()}`;
        } else if (increment > 1 && quantity % increment !== 0) {
          newErrors.quantity = `Miqdar ${increment.toLocaleString()} artımı ilə olmalıdır`;
        }
      }
    }

    // Validate additional parameters
    if (selectedService && selectedService.params) {
      selectedService.params.forEach(param => {
        if (param.field_validators.includes('required') && !formData.additionalParams[param.field_name]) {
          newErrors[param.field_name] = `${param.field_label} tələb olunur`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Zəhmət olmasa form xətalarını düzəldin');
      return;
    }

    try {
      setPlacing(true);
      const response = await apiService.placeOrder(
        formData.serviceId,
        formData.url,
        parseInt(formData.quantity),
        formData.additionalParams
      );

      if (response.status === 'success' && response.id_service_submission) {
        toast.success('Sifariş uğurla verildi!');
        navigate(`/track?order=${response.id_service_submission}`);
      } else if (response.message && response.message.length > 0) {
        const errorMessages = response.message.map(msg => msg.message).join(', ');
        toast.error(`Sifariş uğursuz: ${errorMessages}`);
      } else {
        toast.error('Sifariş verilmədi. Zəhmət olmasa yenidən cəhd edin.');
      }
    } catch (error) {
      toast.error('Sifariş verilmədi. Zəhmət olmasa yenidən cəhd edin.');
      console.error('Error placing order:', error);
    } finally {
      setPlacing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAdditionalParam = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: {
        ...prev.additionalParams,
        [paramName]: value
      }
    }));
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
      'Likes': Heart,
      'Followers': Users,
      'Views': Eye,
      'Shares': Share,
      'Comments': MessageCircle,
      'Reposts': Repeat,
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
        return getServiceTypeFromName(service.public_name);
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

    // Qiymət filtri tətbiq et - komissiya ilə birlikdə
    const sortedServices = [...filtered].sort((a, b) => {
      const priceA = apiService.calculatePrice(a, 1000, settings.commission_rate);
      const priceB = apiService.calculatePrice(b, 1000, settings.commission_rate);
      
      if (priceFilter === 'low-to-high') {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    return sortedServices;
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedServiceType(''); // Reset service type when platform changes
    setFormData(prev => ({ ...prev, serviceId: '' })); // Reset selected service
    setSelectedService(null);
    setServiceDetails(null);
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setFormData(prev => ({ ...prev, serviceId: '' })); // Reset selected service
    setSelectedService(null);
    setServiceDetails(null);
  };

  const handleServiceSelect = (serviceId: string) => {
    updateFormData('serviceId', serviceId);
    const service = services.find(s => s.id_service.toString() === serviceId);
    if (service) {
      setSelectedService(service);
      calculatePrice(service, parseInt(formData.quantity) || 0);
      fetchServiceDetails(serviceId);
    }
  };

  const getServiceDescription = () => {
    // İlk öncə detallı məlumatlardan description almağa çalış
    if (serviceDetails?.description && serviceDetails.description.trim()) {
      return serviceDetails.description;
    }
    
    // Əgər detallı məlumatlar yoxdursa, əsas xidmətdən almağa çalış
    if (selectedService?.description && selectedService.description.trim()) {
      return selectedService.description;
    }
    
    return null;
  };

  // Helper function to get service price with commission
  const getServicePriceWithCommission = (service: Service) => {
    const basePrice = parseFloat(service.prices[0]?.price || '0');
    return apiService.calculatePrice(service, parseInt(service.prices[0]?.pricing_per || '1000'), settings.commission_rate) / parseInt(service.prices[0]?.pricing_per || '1000');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Xidmətlər yüklənir...</span>
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
              Sifarişinizi Verin
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Xidmət seçin və məlumatlarınızı daxil edin
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Order Form - Now takes 3 columns */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sifariş Təfərrüatları
                  </CardTitle>
                  <CardDescription>
                    Sifarişinizi vermək üçün aşağıdakı məlumatları doldurun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Selection with Tabs */}
                    <div className="space-y-4">
                      <Label>Platform Seçin *</Label>
                      
                      <Tabs value={selectedPlatform} onValueChange={handlePlatformChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                          {getUniquePlatforms().map((platform) => {
                            const IconComponent = getPlatformIcon(platform);
                            return (
                              <TabsTrigger key={platform} value={platform} className="capitalize flex items-center gap-2">
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                {platform}
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>

                        {getUniquePlatforms().map((platform) => (
                          <TabsContent key={platform} value={platform}>
                            {/* Xidmət növü seçimi */}
                            {selectedPlatform && (
                              <div className="mb-6">
                                <Label className="text-base font-medium mb-3 block">Xidmət növünü seçin *</Label>
                                <ToggleGroup 
                                  type="single" 
                                  value={selectedServiceType} 
                                  onValueChange={(value) => handleServiceTypeChange(value || '')}
                                  className="flex flex-wrap gap-2 justify-start"
                                >
                                  {getUniqueServiceTypes(selectedPlatform).map((type) => {
                                    const IconComponent = getServiceTypeIcon(type);
                                    return (
                                      <ToggleGroupItem 
                                        key={type} 
                                        value={type}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all"
                                        variant="outline"
                                      >
                                        <IconComponent className="w-4 h-4" />
                                        {type}
                                      </ToggleGroupItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </div>
                            )}

                            {/* Qiymət filtri və konkret xidmət seçimi */}
                            {selectedPlatform && selectedServiceType && (
                              <div className="space-y-4">
                                {/* Qiymət filtri */}
                                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                  <Filter className="h-4 w-4 text-muted-foreground" />
                                  <Label className="text-sm font-medium">Qiymətə görə sırala:</Label>
                                  <Select value={priceFilter} onValueChange={(value: 'low-to-high' | 'high-to-low') => setPriceFilter(value)}>
                                    <SelectTrigger className="w-auto">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low-to-high">Ucuzdan bahaya</SelectItem>
                                      <SelectItem value="high-to-low">Bahadan ucuza</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPriceFilter('low-to-high')}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Konkret xidmət seçimi */}
                                <div className="space-y-2">
                                  <Label>Xidmət seçin *</Label>
                                  <Select 
                                    value={formData.serviceId} 
                                    onValueChange={handleServiceSelect}
                                  >
                                    <SelectTrigger className={errors.serviceId ? 'border-red-500' : ''}>
                                      <SelectValue placeholder="Xidmət seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getFilteredServices().map(service => (
                                        <SelectItem key={service.id_service} value={service.id_service.toString()}>
                                          <div className="flex items-center space-x-2">
                                            <span>{service.public_name}</span>
                                            <Badge variant="secondary" className="ml-2">
                                              ${apiService.formatPrice(getServicePriceWithCommission(service).toString())}/{service.prices[0]?.pricing_per || '1K'}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                        ))}
                      </Tabs>
                      
                      {errors.serviceId && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.serviceId}
                        </p>
                      )}
                    </div>

                    {/* Xidmət təsviri - seçilmiş xidmət varsa göstər */}
                    {selectedService && (
                      <div className="space-y-2">
                        <Label className="flex items-center text-base font-medium">
                          <Info className="h-4 w-4 mr-2" />
                          Xidmət Haqqında
                          {loadingServiceDetails && (
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          )}
                        </Label>
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                              {loadingServiceDetails ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Məlumat yüklənir...
                                </div>
                              ) : getServiceDescription() ? (
                                <div className="whitespace-pre-line">
                                  {getServiceDescription()}
                                </div>
                              ) : (
                                <span className="italic text-muted-foreground">
                                  Bu xidmət üçün ətraflı məlumat mövcud deyil
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Mesajlar */}
                    {!selectedPlatform && (
                      <div className="text-center py-6 text-muted-foreground">
                        Platform seçin
                      </div>
                    )}

                    {selectedPlatform && !selectedServiceType && (
                      <div className="text-center py-6 text-muted-foreground">
                        Xidmət növünü seçin
                      </div>
                    )}

                    {selectedPlatform && selectedServiceType && getFilteredServices().length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        Bu növə uyğun xidmət tapılmadı
                      </div>
                    )}

                    {/* URL və Quantity inputları yalnız xidmət seçildikdə göstər */}
                    {selectedService && (
                      <>
                        {/* URL Input */}
                        <div className="space-y-2">
                          <Label htmlFor="url">Məqsəd URL *</Label>
                          <Input
                            id="url"
                            type="url"
                            placeholder={selectedService.example || "https://..."}
                            value={formData.url}
                            onChange={(e) => updateFormData('url', e.target.value)}
                            className={errors.url ? 'border-red-500' : ''}
                          />
                          {errors.url && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.url}
                            </p>
                          )}
                          {selectedService.example && (
                            <p className="text-sm text-muted-foreground">
                              Nümunə: {selectedService.example}
                            </p>
                          )}
                        </div>

                        {/* Quantity Input */}
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Miqdar *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="1000"
                            value={formData.quantity}
                            onChange={(e) => updateFormData('quantity', e.target.value)}
                            className={errors.quantity ? 'border-red-500' : ''}
                            min={selectedService.amount_minimum}
                            step={selectedService.amount_increment}
                          />
                          {errors.quantity && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.quantity}
                            </p>
                          )}
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Minimum: {parseInt(selectedService.amount_minimum).toLocaleString()}</p>
                            <p>Artım: {parseInt(selectedService.amount_increment).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Additional Parameters */}
                        {selectedService.params && selectedService.params.map(param => (
                          <div key={param.field_name} className="space-y-2">
                            <Label htmlFor={param.field_name}>
                              {param.field_label}
                              {param.field_validators.includes('required') && ' *'}
                            </Label>
                            
                            {param.options && param.options.length > 0 ? (
                              <Select 
                                value={formData.additionalParams[param.field_name] || ''} 
                                onValueChange={(value) => updateAdditionalParam(param.field_name, value)}
                              >
                                <SelectTrigger className={errors[param.field_name] ? 'border-red-500' : ''}>
                                  <SelectValue placeholder={param.field_placeholder || `${param.field_label} seçin`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {param.options.filter(opt => opt.error_selection !== '1').map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Textarea
                                id={param.field_name}
                                placeholder={param.field_placeholder}
                                value={formData.additionalParams[param.field_name] || ''}
                                onChange={(e) => updateAdditionalParam(param.field_name, e.target.value)}
                                className={errors[param.field_name] ? 'border-red-500' : ''}
                              />
                            )}
                            
                            {param.field_descr && (
                              <p className="text-sm text-muted-foreground">{param.field_descr}</p>
                            )}
                            
                            {errors[param.field_name] && (
                              <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors[param.field_name]}
                              </p>
                            )}
                          </div>
                        ))}

                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg"
                          disabled={placing}
                        >
                          {placing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sifariş verilir...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Sifariş Ver - ${apiService.formatPrice(calculatedPrice.toFixed(2))}
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Now takes 1 column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Sifariş Xülasəsi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Xidmət:</span>
                          <Badge className={`${getPlatformColor(selectedService.platform)} text-white`}>
                            {selectedService.platform}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm">{selectedService.public_name}</h3>
                        <p className="text-xs text-muted-foreground">{selectedService.type_name || 'Xidmət'}</p>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Miqdar:</span>
                          <span>{formData.quantity || '0'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{selectedService.prices[0]?.pricing_per || '1000'} üçün qiymət:</span>
                          <span>${apiService.formatPrice(getServicePriceWithCommission(selectedService).toString())}</span>
                        </div>
                        {settings.commission_rate > 0 && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Komissiya ({settings.commission_rate}%):</span>
                            <span>Daxildir</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Cəmi:</span>
                          <span>${apiService.formatPrice(calculatedPrice.toFixed(2))}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Təhlükəsiz</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Sürətli Çatdırılma</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-purple-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>24/7 Dəstək</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 text-sm">
                      Sifariş xülasəsini görmək üçün xidmət seçin
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
