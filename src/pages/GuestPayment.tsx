import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CreditCard, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { toast } from 'sonner';

interface ServiceData {
  id_service: string;
  public_name: string;
  platform: string;
  price: number;
  min_amount: number;
  max_amount: number;
  currency: string;
}

const GuestPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceData = location.state?.selectedService as ServiceData;

  const [formData, setFormData] = useState({
    email: '',
    serviceUrl: '',
    quantity: serviceData?.min_amount || 100,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceData) {
      toast.error('Service information not found. Redirecting to services page.');
      navigate('/en/order');
    }
  }, [serviceData, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.serviceUrl || !isValidUrl(formData.serviceUrl)) {
      newErrors.serviceUrl = 'Please enter a valid URL';
    }

    if (!formData.quantity || formData.quantity < (serviceData?.min_amount || 1)) {
      newErrors.quantity = `Minimum quantity is ${serviceData?.min_amount || 1}`;
    }

    if (serviceData?.max_amount && formData.quantity > serviceData.max_amount) {
      newErrors.quantity = `Maximum quantity is ${serviceData.max_amount}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const calculateTotal = () => {
    if (!serviceData) return 0;
    return (formData.quantity * (serviceData.price || 0.01)).toFixed(2);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success('Payment completed successfully!');
    navigate('/payment-success', {
      state: {
        transactionId,
        orderDetails: {
          service: serviceData?.public_name,
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

  if (!serviceData) {
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

                <div className="space-y-2">
                  <Label htmlFor="serviceUrl">Service URL *</Label>
                  <Input
                    id="serviceUrl"
                    type="url"
                    value={formData.serviceUrl}
                    onChange={(e) => handleInputChange('serviceUrl', e.target.value)}
                    placeholder={`Enter your ${serviceData.platform} URL`}
                    className={errors.serviceUrl ? 'border-red-500' : ''}
                  />
                  {errors.serviceUrl && <p className="text-red-500 text-sm">{errors.serviceUrl}</p>}
                  <p className="text-xs text-muted-foreground">
                    The URL where you want the service to be delivered
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min={serviceData.min_amount}
                    max={serviceData.max_amount}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                  <p className="text-xs text-muted-foreground">
                    Min: {serviceData.min_amount} - Max: {serviceData.max_amount || 'No limit'}
                  </p>
                </div>

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
                    <span className="text-right">{serviceData.public_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Platform:</span>
                    <span className="capitalize">{serviceData.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Quantity:</span>
                    <span>{formData.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price per unit:</span>
                    <span>${(serviceData.price || 0.01).toFixed(4)} USD</span>
                  </div>
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

                {validateForm() ? (
                  <PaymentButton
                    amount={parseFloat(calculateTotal())}
                    orderId={`guest-${Date.now()}-${serviceData.id_service}`}
                    description={`${serviceData.public_name} - ${formData.quantity} units`}
                    customerEmail={formData.email}
                    customerName="Guest User"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full"
                    serviceData={serviceData}
                    orderDetails={{
                      serviceUrl: formData.serviceUrl,
                      quantity: formData.quantity,
                      notes: formData.notes,
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
