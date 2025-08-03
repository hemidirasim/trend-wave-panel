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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
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
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq(user ? 'user_id' : 'email', user ? user.id : guestEmail)
        .eq('link', formData.url)
        .eq('platform', service.platform)
        .in('status', ['pending', 'processing', 'in_progress', 'active', 'running'])
        .order('created_at', { ascending: false })
        .limit(1);

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

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateRandomName = () => {
    const names = ['Müştəri', 'İstifadəçi', 'Alıcı', 'Ziyarətçi'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return `${randomName}${randomNumber}`;
  };

  const handlePlaceOrder = async () => {
    console.log('🚀 handlePlaceOrder called with final price:', finalPrice);

    // Clear any existing toasts before starting
    toast.dismiss();
    
    try {
      // Validate email for guest users
      if (!user && !guestEmail) {
        toast.error('Email ünvanı daxil edin');
        return;
      }

      // Check email format
      if (!user && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        toast.error('Düzgün email ünvanı daxil edin');
        return;
      }

      // Validate URL
      if (!formData.url) {
        toast.error('URL daxil edin');
        return;
      }

      // Validate URL format for the platform
      if (!validateUrl(service.platform, formData.url)) {
        toast.error('URL formatı düzgün deyil. Düzgün URL daxil edin.');
        return;
      }

      // Validate quantity
      if (!formData.quantity || parseInt(formData.quantity) <= 0) {
        toast.error('Miqdar daxil edin');
        return;
      }

      // Double-check for existing orders before placing
      if (formData.url && service?.platform) {
        console.log('🔍 Checking for existing orders...');
        const { data: existingOrders } = await supabase
          .from('orders')
          .select('*')
          .eq(user ? 'user_id' : 'email', user ? user.id : guestEmail)
          .eq('link', formData.url)
          .eq('platform', service.platform)
          .in('status', ['pending', 'processing', 'in_progress', 'active', 'running']);

        if (existingOrders && existingOrders.length > 0) {
          console.log('🚫 Existing order found, aborting');
          toast.error('Bu URL üçün aktiv sifariş mövcuddur');
          return;
        }
      }

      console.log('📤 Placing order via API...');
      
      // Place the order via API FIRST
      const orderResponse = await apiClient.placeOrder(
        formData.serviceId, 
        formData.url, 
        parseInt(formData.quantity), 
        formData.additionalParams
      );
      
      console.log('📥 API Response received:', orderResponse);

      // Check if order was successful
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

      // Check for valid submission ID
      if (!orderResponse.id_service_submission) {
        console.log('❌ No submission ID received');
        toast.error('Sifariş ID alınmadı. Yenidən cəhd edin.');
        return;
      }

      console.log('✅ Order API call successful!');
      console.log('✅ Submission ID:', orderResponse.id_service_submission);

      const externalOrderId = orderResponse.id_service_submission;

      // For guest users, create account and save order
      if (!user) {
        console.log('👤 Processing guest order for email:', guestEmail);
        
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', guestEmail)
          .single();
        
        let userId;
        let isNewUser = !existingUser;
        
        if (existingUser) {
          // User exists, just use their ID
          userId = existingUser.id;
          console.log('✅ Using existing user:', userId);
          
          // Save order to database for existing user
          const orderData = {
            user_id: userId,
            email: guestEmail,
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

          console.log('💾 Saving order for existing user to database with final price:', finalPrice);
          
          const { data: insertedOrder, error: insertError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

          if (insertError) {
            console.error('❌ Database insert error:', insertError);
            toast.error('Sifarişi yadda saxlamaq mümkün olmadı');
            return;
          }

          console.log('✅ Order saved for existing user:', insertedOrder);

          // Send order info email to existing user
          try {
            await supabase.functions.invoke('send-account-email', {
              body: {
                email: guestEmail,
                password: null, // No password for existing users
                orderDetails: {
                  serviceName: service.public_name,
                  quantity: parseInt(formData.quantity),
                  price: finalPrice,
                  link: formData.url
                },
                isExistingUser: true
              }
            });
            
            console.log('✅ Order notification email sent to existing user');
          } catch (emailError) {
            console.error('❌ Error sending email:', emailError);
          }
          
        } else {
          // Create new user account
          const password = generateRandomPassword();
          const fullName = generateRandomName();
          
          const { data: newUser, error: signUpError } = await supabase.auth.signUp({
            email: guestEmail,
            password: password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: { full_name: fullName }
            }
          });
          
          if (signUpError) {
            console.error('❌ Error creating account:', signUpError);
            toast.error('Hesab yaradılmadı. Yenidən cəhd edin.');
            return;
          }
          
          userId = newUser.user?.id;
          console.log('✅ New account created:', userId);

          // Save order to database for new user
          const orderData = {
            user_id: userId,
            email: guestEmail,
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

          console.log('💾 Saving new user order to database with final price:', finalPrice);
          
          const { data: insertedOrder, error: insertError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

          if (insertError) {
            console.error('❌ Database insert error:', insertError);
            toast.error('Sifarişi yadda saxlamaq mümkün olmadı');
            return;
          }

          console.log('✅ New user order saved to database:', insertedOrder);

          // Send account credentials via email for new user
          try {
            await supabase.functions.invoke('send-account-email', {
              body: {
                email: guestEmail,
                password: password,
                orderDetails: {
                  serviceName: service.public_name,
                  quantity: parseInt(formData.quantity),
                  price: finalPrice,
                  link: formData.url
                },
                isExistingUser: false
              }
            });
            
            console.log('✅ Account credentials email sent to new user');
          } catch (emailError) {
            console.error('❌ Error sending email:', emailError);
          }
        }

      } else {
        // For registered users - existing logic
        const orderData = {
          user_id: user.id,
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
        
        console.log('💾 Saving registered user order to database with final price:', finalPrice);
        
        const { data: insertedOrder, error: insertError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (insertError) {
          console.error('❌ Database insert error:', insertError);
          toast.error('Sifarişi yadda saxlamaq mümkün olmadı');
          return;
        }

        console.log('✅ Order saved to database:', insertedOrder);

        // Update user balance
        if (profile) {
          const newBalance = (profile.balance || 0) - finalPrice;
          const { error: balanceError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.id);

          if (balanceError) {
            console.error('❌ Balance update error:', balanceError);
            toast.error('Balansı yeniləmək mümkün olmadı');
            return;
          } else {
            console.log('✅ Balance updated successfully. New balance:', newBalance);
          }
        }
      }

      // Show success message and redirect
      console.log('🎉 Order completed successfully!');
      toast.success(user ? 'Sifariş uğurla verildi!' : 'Sifariş verildi! Hesab məlumatları emailə göndərildi.');

      setTimeout(() => {
        navigate(user ? '/dashboard' : '/');
      }, 1500);

    } catch (error: any) {
      console.error('❌ Order placement error:', error);

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

  // Sadə validation yoxlaması - yalnız əsas sahələri yoxlayır
  const isFormValid = () => {
    // Qeydiyyatlı istifadəçilər üçün email tələb olunmur
    if (!user && !guestEmail) return false;
    
    // URL yoxlama
    if (!formData.url) return false;
    
    // Miqdar yoxlama
    if (!formData.quantity || parseInt(formData.quantity) <= 0) return false;
    
    // Xidmət seçimi yoxlama
    if (!formData.serviceId) return false;
    
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
        {/* Guest Email Input - only for non-logged users */}
        {!user && (
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email ünvanı *</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="email@example.com"
              className={!guestEmail ? 'border-red-500' : ''}
            />
            {!guestEmail && (
              <p className="text-sm text-red-500">Email ünvanı vacibdir</p>
            )}
            <p className="text-sm text-gray-500">
              Əgər bu email ilə hesabınız varsa, sifarişlə bağlı məlumat göndəriləcək. Yoxdursa, avtomatik hesab yaradılacaq.
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

        {/* Price Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t('order.priceDetails')}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>{t('order.total')}</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Balance Check - only for registered users */}
        {hasInsufficientBalance && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {t('order.insufficientBalance')}. Lazım olan: ${finalPrice.toFixed(2)}, Mövcud: ${(profile?.balance || 0).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Button - sadələşdirilmiş şərtlər */}
        <Button
          onClick={handlePlaceOrder}
          disabled={placing || !isFormValid() || hasInsufficientBalance || hasExistingOrder}
          className="w-full"
        >
          {placing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('order.placing')}
            </>
          ) : (
            `${t('order.placeOrder')} - $${finalPrice.toFixed(2)}`
          )}
        </Button>

        {/* Debug məlumatı - inkişaf mərhələsində köməklik üçün */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded">
            Debug: Form valid: {isFormValid() ? 'Bəli' : 'Xeyr'} | 
            Email: {user ? 'Qeydiyyatlı' : (guestEmail ? 'Var' : 'Yox')} | 
            URL: {formData.url ? 'Var' : 'Yox'} | 
            Quantity: {formData.quantity || 'Yox'} | 
            Service: {formData.serviceId ? 'Seçilib' : 'Seçilməyib'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderForm;
