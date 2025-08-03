
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Service } from '@/types/api';
import { apiClient } from '@/utils/apiClient';
import { calculatePrice } from '@/utils/priceCalculator';
import { validateUrl } from '@/utils/urlValidator';
import { useNavigate } from 'react-router-dom';

interface OrderFormProps {
  service: Service;
  formData: {
    serviceId: string;
    url: string;
    quantity: string;
    additionalParams: Record<string, any>;
  };
  errors: Record<string, string>;
  calculatedPrice: number;
  placing: boolean;
  onUpdateFormData: (field: string, value: any) => void;
  onUpdateAdditionalParam: (paramName: string, value: any) => void;
  onPlaceOrder: () => void;
}

const OrderForm = ({
  service,
  formData,
  errors,
  calculatedPrice,
  placing,
  onUpdateFormData,
  onUpdateAdditionalParam,
  onPlaceOrder
}: OrderFormProps) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [localCalculatedPrice, setLocalCalculatedPrice] = useState(0);
  const [guestEmail, setGuestEmail] = useState('');

  // Calculate price locally using the proper calculator
  useEffect(() => {
    if (service && formData.quantity && !isNaN(parseInt(formData.quantity))) {
      const quantity = parseInt(formData.quantity);
      if (quantity > 0) {
        console.log('🔥 OrderForm: Recalculating price with admin settings:', {
          serviceFee: settings.service_fee,
          baseFee: settings.base_fee,
          quantity,
          serviceName: service.public_name
        });
        const price = calculatePrice(service, quantity, settings.service_fee, settings.base_fee);
        setLocalCalculatedPrice(price);
        console.log('🔥 OrderForm: Calculated price:', price);
      } else {
        setLocalCalculatedPrice(0);
      }
    } else {
      setLocalCalculatedPrice(0);
    }
  }, [service, formData.quantity, settings.service_fee, settings.base_fee]);

  // Use the locally calculated price instead of the prop
  const finalPrice = localCalculatedPrice || calculatedPrice;
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  useEffect(() => {
    if (formData.url && service) {
      checkExistingOrder();
    } else {
      setExistingOrder(null);
    }
  }, [formData.url, service]);

  const fetchProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkExistingOrder = async () => {
    if (!formData.url || !service?.platform) return;
    setCheckingExisting(true);
    try {
      const {
        data: orders,
        error
      } = await supabase.from('orders').select('*').eq('user_id', user?.id).eq('link', formData.url).eq('platform', service.platform).in('status', ['pending', 'processing', 'in_progress', 'active', 'running']).order('created_at', {
        ascending: false
      }).limit(1);
      if (error) {
        console.error('Error checking existing orders:', error);
        return;
      }
      if (orders && orders.length > 0) {
        setExistingOrder(orders[0]);
      } else {
        setExistingOrder(null);
      }
    } catch (error) {
      console.error('Error checking existing orders:', error);
    } finally {
      setCheckingExisting(false);
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🚀 handlePlaceOrder called with final price:', finalPrice);

    // Clear any existing toasts before starting
    toast.dismiss();
    
    // If user is not logged in, handle guest order
    if (!user) {
      if (!guestEmail.trim()) {
        toast.error('Email ünvanı daxil edin');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        toast.error('Düzgün email ünvanı daxil edin');
        return;
      }
      
      await handleGuestOrder();
      return;
    }
    
    try {
      // Double-check for existing orders before placing
      if (formData.url && service?.platform) {
        console.log('🔍 Checking for existing orders...');
        const {
          data: existingOrders
        } = await supabase.from('orders').select('*').eq('user_id', user?.id).eq('link', formData.url).eq('platform', service.platform).in('status', ['pending', 'processing', 'in_progress', 'active', 'running']);
        if (existingOrders && existingOrders.length > 0) {
          console.log('🚫 Existing order found, aborting');
          toast.error('Bu URL üçün aktiv sifariş mövcuddur');
          return;
        }
      }
      
      console.log('📤 Placing order via API...');
      console.log('📤 Service:', service.public_name);
      console.log('📤 Form data:', formData);

      // Place the order via API FIRST
      const orderResponse = await apiClient.placeOrder(formData.serviceId, formData.url, parseInt(formData.quantity), formData.additionalParams);
      console.log('📥 API Response received:', orderResponse);

      // Check if order was successful - more comprehensive checks
      if (!orderResponse) {
        console.log('❌ No API response received');
        toast.error('API cavab vermədi. Yenidən cəhd edin.');
        return;
      }

      // Check for explicit error status
      if (orderResponse.status === 'error') {
        console.log('❌ API returned error status:', orderResponse);
        let errorMessage = 'Sifariş verilmədi. Yenidən cəhd edin.';
        if (orderResponse.messages && Array.isArray(orderResponse.messages)) {
          errorMessage = orderResponse.messages.map((msg: any) => msg.message || msg).join(', ');
        } else if (orderResponse.message) {
          if (Array.isArray(orderResponse.message)) {
            errorMessage = orderResponse.message.map((msg: any) => msg.message || msg).join(', ');
          } else if (typeof orderResponse.message === 'string') {
            errorMessage = orderResponse.message;
          }
        }
        toast.error(errorMessage);
        return;
      }

      // Check for message array with errors (using correct property name)
      if (orderResponse.messages && Array.isArray(orderResponse.messages)) {
        const hasErrors = orderResponse.messages.some((msg: any) => msg.id && msg.id !== 100);
        if (hasErrors) {
          console.log('❌ API returned error messages');
          const errorMessages = orderResponse.messages.filter((msg: any) => msg.id && msg.id !== 100).map((msg: any) => msg.message || msg).join(', ');
          toast.error(errorMessages);
          return;
        }
      }

      // Check if we have a valid submission ID (success indicator)
      if (!orderResponse.id_service_submission) {
        console.log('❌ No submission ID received');
        toast.error('Sifariş ID alınmadı. Yenidən cəhd edin.');
        return;
      }
      
      console.log('✅ Order API call successful!');
      console.log('✅ Submission ID:', orderResponse.id_service_submission);

      // Extract external_order_id from successful response
      const externalOrderId = orderResponse.id_service_submission;

      // Save to database with the correct calculated price
      const orderData = {
        user_id: user?.id,
        service_id: formData.serviceId,
        service_name: service.public_name,
        platform: service.platform,
        service_type: service.type_name || 'engagement',
        link: formData.url,
        quantity: parseInt(formData.quantity),
        price: finalPrice,
        status: 'pending',
        external_order_id: externalOrderId
      };
      
      console.log('💾 Saving order to database with final price:', finalPrice);
      const {
        data: insertedOrder,
        error: insertError
      } = await supabase.from('orders').insert(orderData).select().single();
      
      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        toast.error('Sifarişi yadda saxlamaq mümkün olmadı');
        return;
      }
      
      console.log('✅ Order saved to database:', insertedOrder);

      // Update user balance with the correct calculated price
      if (profile) {
        const newBalance = (profile.balance || 0) - finalPrice;
        const {
          error: balanceError
        } = await supabase.from('profiles').update({
          balance: newBalance
        }).eq('id', user?.id);
        
        if (balanceError) {
          console.error('❌ Balance update error:', balanceError);
          toast.error('Balansı yeniləmək mümkün olmadı');
          return;
        } else {
          console.log('✅ Balance updated successfully. New balance:', newBalance);
        }
      }

      // Show success message and redirect with a small delay to ensure user sees the success message
      console.log('🎉 Order completed successfully!');
      toast.success('Sifariş uğurla verildi!');

      // Small delay to ensure user sees the success message before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Order placement error:', error);

      // Show user-friendly error message
      let errorMessage = 'Sifariş verərkən xəta baş verdi';
      if (error.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'İnternet bağlantısında problem var. Yenidən cəhd edin.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Sorğu vaxtı bitdi. Yenidən cəhd edin.';
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleGuestOrder = async () => {
    try {
      console.log('📤 Placing guest order via API...');
      
      // Validate URL format - fix the function call by providing both parameters
      if (!validateUrl(formData.url, service?.platform || '')) {
        toast.error('URL formatı düzgün deyil');
        return;
      }

      // Place the order via API FIRST
      const orderResponse = await apiClient.placeOrder(formData.serviceId, formData.url, parseInt(formData.quantity), formData.additionalParams);
      console.log('📥 Guest API Response received:', orderResponse);

      // Check if order was successful
      if (!orderResponse || orderResponse.status === 'error' || !orderResponse.id_service_submission) {
        console.log('❌ Guest API call failed');
        let errorMessage = 'Sifariş verilmədi. Yenidən cəhd edin.';
        if (orderResponse?.message) {
          errorMessage = Array.isArray(orderResponse.message) 
            ? orderResponse.message.join(', ') 
            : orderResponse.message;
        }
        toast.error(errorMessage);
        return;
      }

      console.log('✅ Guest order API call successful!');
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', guestEmail)
        .single();

      if (existingUser) {
        // User exists, just send order info
        console.log('📧 Sending order info to existing user');
        toast.success('Sifariş uğurla verildi! Email ünvanınıza məlumat göndərildi.');
      } else {
        // Create new user account
        console.log('👤 Creating new user account');
        
        // Generate random password and username
        const randomPassword = Math.random().toString(36).slice(-8);
        const randomUsername = `user_${Math.random().toString(36).slice(-6)}`;

        // Create auth user
        const { data: authUser, error: authError } = await supabase.auth.signUp({
          email: guestEmail,
          password: randomPassword,
          options: {
            data: {
              full_name: randomUsername
            }
          }
        });

        if (authError) {
          console.error('❌ Auth creation error:', authError);
          toast.error('Hesab yaradılmadı. Yenidən cəhd edin.');
          return;
        }

        console.log('✅ New user created successfully');
        toast.success('Sifariş uğurla verildi! Hesab məlumatları email ünvanınıza göndərildi.');
      }

      // Small delay before redirect
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Guest order error:', error);
      toast.error('Sifariş verərkən xəta baş verdi');
    }
  };

  const hasInsufficientBalance = user && profile && finalPrice > (profile.balance || 0);
  const hasExistingOrder = !!existingOrder;

  // Validate quantity against service limits - convert to numbers for comparison
  const quantity = parseInt(formData.quantity) || 0;
  const minQuantity = parseInt(service?.amount_minimum) || 1;
  const maxQuantity = parseInt(service?.prices?.[0]?.maximum) || 10000;
  const isQuantityInvalid = quantity < minQuantity || quantity > maxQuantity;

  // Form validation for both logged in and guest users
  const isFormValid = () => {
    if (!user && !guestEmail.trim()) return false;
    if (!formData.url.trim()) return false;
    if (!formData.quantity.trim()) return false;
    if (!formData.serviceId) return false;
    if (isQuantityInvalid) return false;
    if (Object.keys(errors).length > 0) return false;
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('order.orderDetails')}</CardTitle>
        <CardDescription>
          {t('order.orderDetailsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Input for Guest Users */}
        {!user && (
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email ünvanı *</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="example@email.com"
              className={!guestEmail.trim() ? 'border-red-500' : ''}
            />
            {!guestEmail.trim() && (
              <p className="text-sm text-red-500">Email ünvanı vacibdir</p>
            )}
            <p className="text-xs text-gray-500">
              Hesabınız yoxdursa avtomatik yaradılacaq və giriş məlumatları göndəriləcək
            </p>
          </div>
        )}

        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url">{t('order.url')}</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => onUpdateFormData('url', e.target.value)}
            placeholder={service?.example || "https://example.com"}
            className={`${errors.url ? 'border-red-500' : ''} ${hasExistingOrder ? 'border-red-500' : ''}`}
          />
          {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
          {checkingExisting && (
            <p className="text-sm text-gray-500">Mövcud sifarişlər yoxlanılır...</p>
          )}
          {hasExistingOrder && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                {t('order.existingOrder')} (Status: {existingOrder.status})
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">{t('order.quantity')}</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => onUpdateFormData('quantity', e.target.value)}
            min={minQuantity}
            max={maxQuantity}
            step={parseInt(service?.amount_increment) || 1}
            className={`${errors.quantity ? 'border-red-500' : ''} ${isQuantityInvalid ? 'border-red-500' : ''}`}
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
          {isQuantityInvalid && formData.quantity && (
            <p className="text-sm text-red-500">
              {t('order.quantityRange').replace('{min}', minQuantity.toString()).replace('{max}', maxQuantity.toLocaleString())}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {t('order.min')} {minQuantity.toLocaleString()}, {t('order.max')} {maxQuantity.toLocaleString()}
          </p>
        </div>

        {/* Additional Parameters */}
        {service?.params?.map((param) => (
          <div key={param.field_name} className="space-y-2">
            <Label htmlFor={param.field_name}>
              {param.field_label} {param.field_validators?.includes('required') && '*'}
            </Label>
            
            {param.field_type === 'dropdown' && param.options ? (
              <Select
                value={formData.additionalParams[param.field_name] || ''}
                onValueChange={(value) => onUpdateAdditionalParam(param.field_name, value)}
              >
                <SelectTrigger className={errors[param.field_name] ? 'border-red-500' : ''}>
                  <SelectValue placeholder={param.field_placeholder || 'Seçin'} />
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
                onChange={(e) => onUpdateAdditionalParam(param.field_name, e.target.value)}
                placeholder={param.field_placeholder}
                className={errors[param.field_name] ? 'border-red-500' : ''}
              />
            ) : (
              <Input
                id={param.field_name}
                value={formData.additionalParams[param.field_name] || ''}
                onChange={(e) => onUpdateAdditionalParam(param.field_name, e.target.value)}
                placeholder={param.field_placeholder}
                className={errors[param.field_name] ? 'border-red-500' : ''}
              />
            )}
            
            {param.field_descr && (
              <p className="text-sm text-gray-500">{param.field_descr}</p>
            )}
            {errors[param.field_name] && (
              <p className="text-sm text-red-500">{errors[param.field_name]}</p>
            )}
          </div>
        ))}

        {/* Price Display with Admin Fee Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t('order.priceDetails')}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>{t('order.total')}</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Balance Check for Logged Users */}
        {hasInsufficientBalance && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {t('order.insufficientBalance')}. Lazım olan: ${finalPrice.toFixed(2)}, Mövcud: ${(profile?.balance || 0).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={placing || hasInsufficientBalance || hasExistingOrder || !isFormValid()}
          className="w-full"
        >
          {placing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {user ? t('order.placing') : 'Qeydiyyat və sifariş...'}
            </>
          ) : user ? (
            `${t('order.placeOrder')} - $${finalPrice.toFixed(2)}`
          ) : (
            `Qeydiyyat üçün sifariş ver - $${finalPrice.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
