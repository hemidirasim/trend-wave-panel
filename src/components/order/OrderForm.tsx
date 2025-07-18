
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
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Service } from '@/types/api';
import { apiClient } from '@/utils/apiClient';
import { calculatePrice } from '@/utils/priceCalculator';
import { validateUrl } from '@/utils/urlValidator';

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
  const [profile, setProfile] = useState<any>(null);
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(false);

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
        .eq('user_id', user?.id)
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

  const handlePlaceOrder = async () => {
    try {
      // Double-check for existing orders before placing
      if (formData.url && service?.platform) {
        const { data: existingOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user?.id)
          .eq('link', formData.url)
          .eq('platform', service.platform)
          .in('status', ['pending', 'processing', 'in_progress', 'active', 'running']);

        if (existingOrders && existingOrders.length > 0) {
          toast.error('Bu URL üçün aktiv sifariş mövcuddur');
          return;
        }
      }

      console.log('Placing order with service:', service);
      console.log('Form data:', formData);

      // Place the order via API
      const orderResponse = await apiClient.placeOrder(
        formData.serviceId,
        formData.url,
        parseInt(formData.quantity),
        formData.additionalParams
      );

      console.log('Order API response:', orderResponse);

      // Extract external_order_id from the response - use the correct property name
      let externalOrderId = null;
      if (orderResponse) {
        externalOrderId = orderResponse.id_service_submission || null;
      }

      console.log('Extracted external_order_id:', externalOrderId);

      // Save order to database with external_order_id
      const orderData = {
        user_id: user?.id,
        service_id: formData.serviceId,
        service_name: service.public_name,
        platform: service.platform,
        service_type: service.type_name || 'engagement',
        link: formData.url,
        quantity: parseInt(formData.quantity),
        price: calculatedPrice,
        status: 'pending',
        external_order_id: externalOrderId
      };

      console.log('Saving order to database with data:', orderData);

      const { data: insertedOrder, error: insertError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error('Sifarişi yadda saxlamaq mümkün olmadı');
      }

      console.log('Order saved successfully:', insertedOrder);

      // Update user balance
      if (profile) {
        const newBalance = (profile.balance || 0) - calculatedPrice;
        const { error: balanceError } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('id', user?.id);

        if (balanceError) {
          console.error('Balance update error:', balanceError);
        } else {
          console.log('Balance updated successfully. New balance:', newBalance);
        }
      }

      toast.success('Sifariş uğurla verildi!');
      onPlaceOrder();

    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Sifariş verərkən xəta baş verdi');
    }
  };

  const hasInsufficientBalance = profile && calculatedPrice > (profile.balance || 0);
  const hasExistingOrder = !!existingOrder;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sifariş Məlumatları</CardTitle>
        <CardDescription>
          Sifarişinizin təfərrüatlarını daxil edin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => onUpdateFormData('url', e.target.value)}
            placeholder={service?.example || "https://example.com"}
            className={`${errors.url ? 'border-red-500' : ''} ${hasExistingOrder ? 'border-red-500' : ''}`}
          />
          {errors.url && (
            <p className="text-sm text-red-500">{errors.url}</p>
          )}
          {checkingExisting && (
            <p className="text-sm text-gray-500">Mövcud sifarişlər yoxlanılır...</p>
          )}
          {hasExistingOrder && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                Bu URL üçün artıq aktiv sifariş mövcuddur (Status: {existingOrder.status})
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Miqdar *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => onUpdateFormData('quantity', e.target.value)}
            min={service?.amount_minimum || 1}
            max={service?.prices?.[0]?.maximum || 10000}
            step={service?.amount_increment || 1}
            className={errors.quantity ? 'border-red-500' : ''}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity}</p>
          )}
          <p className="text-sm text-gray-500">
            Min: {service?.amount_minimum || 1}, Max: {service?.prices?.[0]?.maximum || 10000}
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

        {/* Balance Check */}
        {hasInsufficientBalance && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              Balansınız kifayət etmir. Lazım olan: ${calculatedPrice.toFixed(2)}, Mövcud: ${(profile?.balance || 0).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {/* Order Button */}
        <Button 
          onClick={handlePlaceOrder}
          disabled={
            placing || 
            hasInsufficientBalance || 
            hasExistingOrder ||
            !formData.url || 
            !formData.quantity ||
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
            `Sifariş ver - $${calculatedPrice.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
