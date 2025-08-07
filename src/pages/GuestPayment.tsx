
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CreditCard, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { toast } from 'sonner';
import { Service } from '@/types/api';
import { proxyApiService } from '@/components/ProxyApiService';
import { useSettings } from '@/contexts/SettingsContext';
import { calculatePrice } from '@/utils/priceCalculator';

interface ServiceData {
  id_service: string;
  public_name: string;
  platform: string;
}

const GuestPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceData = location.state?.selectedService as ServiceData;
  const { settings } = useSettings();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    serviceUrl: '',
    quantity: 100,
    notes: '',
    additionalParams: {} as Record<string, any>
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!serviceData) {
      toast.error('Service information not found. Redirecting to services page.');
      navigate('/en/order');
      return;
    }
    fetchServiceDetails();
  }, [serviceData, navigate]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching service details for:', serviceData.id_service);
      
      const services = await proxyApiService.getServices();
      const foundService = services.find(s => s.id_service === serviceData.id_service);
      
      if (!foundService) {
        toast.error('Service details not found');
        navigate('/en/order');
        return;
      }

      console.log('✅ Service details loaded:', foundService);
      setService(foundService);
      
      // Set initial quantity based on service minimum
      const minQuantity = parseInt(foundService.amount_minimum) || 100;
      setFormData(prev => ({
        ...prev,
        quantity: minQuantity
      }));
      
    } catch (error) {
      console.error('❌ Error fetching service details:', error);
      toast.error('Failed to load service details');
      navigate('/en/order');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // URL validation
    if (!formData.serviceUrl || !isValidUrl(formData.serviceUrl)) {
      newErrors.serviceUrl = 'Please enter a valid URL';
    }

    // Quantity validation
    const minQuantity = parseInt(service?.amount_minimum || '1');
    const maxQuantity = service?.prices?.[0]?.maximum ? parseInt(service.prices[0].maximum) : 10000;
    
    if (!formData.quantity || formData.quantity < minQuantity) {
      newErrors.quantity = `Minimum quantity is ${minQuantity}`;
    }

    if (formData.quantity > maxQuantity) {
      newErrors.quantity = `Maximum quantity is ${maxQuantity}`;
    }

    // Additional parameters validation
    if (service?.params) {
      service.params.forEach(param => {
        const value = formData.additionalParams[param.field_name];
        const isRequired = param.field_validators?.includes('required');
        
        if (isRequired && (!value || value.toString().trim() === '')) {
          newErrors[param.field_name] = `${param.field_label} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Use useMemo to compute form validity without triggering re-renders
  const isFormValid = useMemo(() => {
    if (!service) return false;
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }

    if (!formData.serviceUrl || !isValidUrl(formData.serviceUrl)) {
      return false;
    }

    const minQuantity = parseInt(service.amount_minimum || '1');
    const maxQuantity = service.prices?.[0]?.maximum ? parseInt(service.prices[0].maximum) : 10000;
    
    if (!formData.quantity || formData.quantity < minQuantity || formData.quantity > maxQuantity) {
      return false;
    }

    // Check required additional parameters
    if (service.params) {
      for (const param of service.params) {
        const isRequired = param.field_validators?.includes('required');
        const value = formData.additionalParams[param.field_name];
        
        if (isRequired && (!value || value.toString().trim() === '')) {
          return false;
        }
      }
    }

    return true;
  }, [formData, service]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAdditionalParamChange = (paramName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalParams: {
        ...prev.additionalParams,
        [paramName]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[paramName]) {
      setErrors(prev => ({
        ...prev,
        [paramName]: ''
      }));
    }
  };

  const calculateTotal = () => {
    if (!service) return '0.00';
    
    console.log('🔥 GuestPayment: Calculating price with settings:', {
      serviceFee: settings.service_fee,
      baseFee: settings.base_fee,
      quantity: formData.quantity,
      serviceName: service.public_name
    });
    
    const price = calculatePrice(service, formData.quantity, settings.service_fee, settings.base_fee);
    return price.toFixed(2);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success('Payment completed successfully!');
    navigate('/payment-success', {
      state: {
        transactionId,
        orderDetails: {
          service: service?.public_name,
          quantity: formData.quantity,
          email: formData.email,
          total: calculateTotal()
        }
      }
    });
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The selected service information could not be loaded.
            </p>
            <Button onClick={() => navigate('/en/order')}>
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Order</h1>
            <p className="text-xl text-muted-foreground">
              Enter your details and complete the payment for your selected service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
                <CardDescription>
                  Please provide the required information for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  <p className="text-xs text-muted-foreground">
                    Order confirmation and details will be sent to this email
                  </p>
                </div>

                {/* Service URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="serviceUrl">Service URL *</Label>
                  <Input
                    id="serviceUrl"
                    type="url"
                    value={formData.serviceUrl}
                    onChange={(e) => handleInputChange('serviceUrl', e.target.value)}
                    placeholder={service.example || `Enter your ${service.platform} URL`}
                    className={errors.serviceUrl ? 'border-red-500' : ''}
                  />
                  {errors.serviceUrl && <p className="text-red-500 text-sm">{errors.serviceUrl}</p>}
                  <p className="text-xs text-muted-foreground">
                    The URL where you want the service to be delivered
                  </p>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min={parseInt(service.amount_minimum) || 1}
                    max={service.prices?.[0]?.maximum ? parseInt(service.prices[0].maximum) : undefined}
                    step={parseInt(service.amount_increment) || 1}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                  <p className="text-xs text-muted-foreground">
                    Min: {parseInt(service.amount_minimum) || 1} - Max: {service.prices?.[0]?.maximum ? parseInt(service.prices[0].maximum).toLocaleString() : 'No limit'}
                  </p>
                </div>

                {/* Additional Parameters from API */}
                {service.params?.map((param) => (
                  <div key={param.field_name} className="space-y-2">
                    <Label htmlFor={param.field_name}>
                      {param.field_label} {param.field_validators?.includes('required') && '*'}
                    </Label>
                    
                    {param.field_type === 'dropdown' && param.options ? (
                      <Select
                        value={formData.additionalParams[param.field_name] || ''}
                        onValueChange={(value) => handleAdditionalParamChange(param.field_name, value)}
                      >
                        <SelectTrigger className={errors[param.field_name] ? 'border-red-500' : ''}>
                          <SelectValue placeholder={param.field_placeholder || 'Select option'} />
                        </SelectTrigger>
                        <SelectContent>
                          {param.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : param.field_type === 'textarea' ? (
                      <Textarea
                        id={param.field_name}
                        value={formData.additionalParams[param.field_name] || ''}
                        onChange={(e) => handleAdditionalParamChange(param.field_name, e.target.value)}
                        placeholder={param.field_placeholder}
                        className={errors[param.field_name] ? 'border-red-500' : ''}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={param.field_name}
                        type={param.field_type === 'number' ? 'number' : 'text'}
                        value={formData.additionalParams[param.field_name] || ''}
                        onChange={(e) => handleAdditionalParamChange(param.field_name, e.target.value)}
                        placeholder={param.field_placeholder}
                        className={errors[param.field_name] ? 'border-red-500' : ''}
                      />
                    )}
                    
                    {param.field_descr && (
                      <p className="text-xs text-muted-foreground">{param.field_descr}</p>
                    )}
                    {errors[param.field_name] && (
                      <p className="text-red-500 text-sm">{errors[param.field_name]}</p>
                    )}
                  </div>
                ))}

                {/* General Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special instructions or notes for your order..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Review your order and proceed with payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Service:</span>
                    <span className="text-right">{service.public_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Platform:</span>
                    <span className="capitalize">{service.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Quantity:</span>
                    <span>{formData.quantity.toLocaleString()}</span>
                  </div>
                  {service.prices && service.prices.length > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">Base price per {service.prices[0].pricing_per}:</span>
                      <span>${parseFloat(service.prices[0].price).toFixed(4)} USD</span>
                    </div>
                  )}
                  <hr className="border-muted-foreground/20" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()} USD</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">💡 What happens next:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Complete payment securely via Epoint</li>
                    <li>• Order confirmation sent to your email</li>
                    <li>• Service delivery starts within 24 hours</li>
                    <li>• Account created for order tracking</li>
                  </ul>
                </div>

                {isFormValid ? (
                  <PaymentButton
                    amount={parseFloat(calculateTotal())}
                    orderId={`guest-${Date.now()}-${service.id_service}`}
                    description={`${service.public_name} - ${formData.quantity} units`}
                    customerEmail={formData.email}
                    customerName="Guest User"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full"
                    serviceData={service}
                    orderDetails={{
                      serviceUrl: formData.serviceUrl,
                      quantity: formData.quantity,
                      notes: formData.notes,
                      additionalParams: formData.additionalParams,
                      total: calculateTotal()
                    }}
                    isGuestOrder={true}
                  >
                    Pay Now - ${calculateTotal()} USD
                  </PaymentButton>
                ) : (
                  <Button 
                    onClick={validateForm} 
                    className="w-full" 
                    variant="outline"
                  >
                    Complete Form to Continue
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuestPayment;
