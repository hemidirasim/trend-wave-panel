
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
import { Loader2, AlertTriangle, Mail, User } from 'lucide-react';
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
    email: string;
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
      let query = supabase
        .from('orders')
        .select('*')
        .eq('link', formData.url)
        .eq('platform', service.platform)
        .in('status', ['pending', 'processing', 'in_progress', 'active', 'running'])
        .order('created_at', { ascending: false })
        .limit(1);

      // Qeydiyyatlı istifadəçi üçün user_id ilə yoxla
      if (user) {
        query = query.eq('user_id', user.id);
      } 
      // Qeydiyyatsız istifadəçi üçün email ilə yoxla
      else if (formData.email) {
        query = query.eq('email', formData.email);
      } else {
        // Email olmasa yoxlama etmə
        setCheckingExisting(false);
        return;
      }

      const { data: orders, error } = await query;
      
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

  // Avtomatik hesab yaratma funksiyası
  const createAccountForAnonymousUser = async (email: string) => {
    try {
      // Random şifrə yaratmaq
      const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      // Supabase-də hesab yaratmaq
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: email.split('@')[0]
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Email göndərmə (edge function vasitəsilə)
      if (signUpData.user) {
        try {
          await supabase.functions.invoke('send-account-email', {
            body: {
              email: email,
              password: password,
              userId: signUpData.user.id
            }
          });
        } catch (emailError) {
          console.error('Error sending account email:', emailError);
          // Email göndərilmədikdə də hesab yaradılsın
        }
      }

      return signUpData.user;
    } catch (error) {
      console.error('Error creating anonymous account:', error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    console.log('🚀 handlePlaceOrder called with final price:', finalPrice);

    // Clear any existing toasts before starting
    toast.dismiss();
    try {
      // Double-check for existing orders before placing
      if (formData.url && service?.platform) {
        console.log('🔍 Checking for existing orders...');
        let query = supabase
          .from('orders')
          .select('*')
          .eq('link', formData.url)
          .eq('platform', service.platform)
          .in('status', ['pending', 'processing', 'in_progress', 'active', 'running']);

        if (user) {
          query = query.eq('user_id', user.id);
        } else if (formData.email) {
          query = query.eq('email', formData.email);
        }

        const { data: existingOrders } = await query;
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

      // Check if order was successful
      if (!orderResponse || orderResponse.status === 'error') {
        console.log('❌ API returned error status:', orderResponse);
        let errorMessage = 'Sifariş verilmədi. Yenidən cəhd edin.';
        if (orderResponse?.messages && Array.isArray(orderResponse.messages)) {
          errorMessage = orderResponse.messages.map((msg: any) => msg.message || msg).join(', ');
        } else if (orderResponse?.message) {
          if (Array.isArray(orderResponse.message)) {
            errorMessage = orderResponse.message.map((msg: any) => msg.message || msg).join(', ');
          } else if (typeof orderResponse.message === 'string') {
            errorMessage = orderResponse.message;
          }
        }
        toast.error(errorMessage);
        return;
      }

      // Check for message array with errors
      if (orderResponse.messages && Array.isArray(orderResponse.messages)) {
        const hasErrors = orderResponse.messages.some((msg: any) => msg.id && msg.id !== 100);
        if (hasErrors) {
          console.log('❌ API returned error messages');
          const errorMessages = orderResponse.messages.filter((msg: any) => msg.id && msg.id !== 100).map((msg: any) => msg.message || msg).join(', ');
          toast.error(errorMessages);
          return;
        }
      }

      // Check if we have a valid submission ID
      if (!orderResponse.id_service_submission) {
        console.log('❌ No submission ID received');
        toast.error('Sifariş ID alınmadı. Yenidən cəhd edin.');
        return;
      }

      console.log('✅ Order API call successful!');
      console.log('✅ Submission ID:', orderResponse.id_service_submission);

      const externalOrderId = orderResponse.id_service_submission;
      let orderUserId = user?.id || null;
      
      // Qeydiyyatsız istifadəçi üçün hesab yaratmaq
      if (!user && formData.email) {
        try {
          const newUser = await createAccountForAnonymousUser(formData.email);
          orderUserId = newUser?.id || null;
          console.log('✅ Anonymous user account created:', newUser?.id);
        } catch (error) {
          console.error('❌ Error creating anonymous account:', error);
          // Hətta hesab yaradılmasa da sifariş verilə bilər
        }
      }

      // Save to database with the correct calculated price
      const orderData = {
        user_id: orderUserId,
        email: !user ? formData.email : null, // Qeydiyyatsız istifadəçi üçün email saxlamaq
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

      // Update user balance with the correct calculated price (only for registered users)
      if (user && profile) {
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

      // Show success message
      console.log('🎉 Order completed successfully!');
      toast.success('Sifariş uğurla verildi!');
      
      if (!user) {
        toast.success('Hesab məlumatları email ünvanınıza göndərildi!');
      }

      // Small delay to ensure user sees the success message before redirect
      setTimeout(() => {
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
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

  const hasInsufficientBalance = user && profile && finalPrice > (profile.balance || 0);
  const hasExistingOrder = !!existingOrder;

  // Validate quantity against service limits
  const quantity = parseInt(formData.quantity) || 0;
  const minQuantity = parseInt(service?.amount_minimum) || 1;
  const maxQuantity = parseInt(service?.prices?.[0]?.maximum) || 10000;
  const isQuantityInvalid = quantity < minQuantity || quantity > maxQuantity;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {user ? <User className="h-5 w-5 mr-2" /> : <Mail className="h-5 w-5 mr-2" />}
          {user ? 'Sifariş Təfərrüatları' : 'Sifariş Təfərrüatları (Qeydiyyatsız)'}
        </CardTitle>
        <CardDescription>
          {user ? 'Sifarişinizin təfərrüatlarını daxil edin' : 'Email ünvanınızı daxil edin və sifariş verin'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Input - Yalnız qeydiyyatsız istifadəçilər üçün */}
        {!user && (
          <div className="space-y-2">
            <Label htmlFor="email">Email ünvanı *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onUpdateFormData('email', e.target.value)}
              placeholder="example@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            <p className="text-xs text-muted-foreground">
              Sifarişinizə dair məlumatlar və avtomatik yaradılacaq hesabın şifrəsi bu emailə göndəriləcək
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
                Bu URL üçün aktiv sifariş mövcuddur (Status: {existingOrder.status})
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
              Miqdar {minQuantity} - {maxQuantity.toLocaleString()} aralığında olmalıdır
            </p>
          )}
          <p className="text-sm text-gray-500">
            Min: {minQuantity.toLocaleString()}, Max: {maxQuantity.toLocaleString()}
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

        {/* Price Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Qiymət Təfərrüatları</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Cəmi</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Balance Check - Yalnız qeydiyyatlı istifadəçilər üçün */}
        {user && hasInsufficientBalance && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              Kifayət qədər balans yoxdur. Lazım olan: ${finalPrice.toFixed(2)}, Mövcud: ${(profile?.balance || 0).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={
            placing || 
            (user && hasInsufficientBalance) || 
            (!user && !formData.email) ||
            hasExistingOrder || 
            !formData.url || 
            !formData.quantity || 
            isQuantityInvalid || 
            Object.keys(errors).length > 0
          }
          className="w-full"
        >
          {placing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sifariş verilir...
            </>
          ) : (
            `Sifariş ver - $${finalPrice.toFixed(2)}`
          )}
        </Button>

        {!user && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Sifariş verdikdən sonra sizin üçün avtomatik hesab yaradılacaq və məlumatlar emailə göndəriləcək
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderForm;
