
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';
import { Service } from '@/types/api';
import { calculatePrice } from '@/utils/priceCalculator';
import { validateUrl } from '@/utils/urlValidator';
import { AlertCircle, Loader2 } from 'lucide-react';

interface OrderFormProps {
  service: Service;
}

export const OrderForm = ({ service }: OrderFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [quantity, setQuantity] = useState(service.amount_minimum ? parseInt(service.amount_minimum) : 100);
  const [comment, setComment] = useState('');
  const [selectedParams, setSelectedParams] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const price = calculatePrice(service, quantity);
  const minimumQuantity = parseInt(service.amount_minimum || '1');
  const maximumQuantity = service.prices?.[0]?.maximum ? parseInt(service.prices[0].maximum) : 10000;
  const increment = parseInt(service.amount_increment || '1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Sifariş vermək üçün daxil olun');
      return;
    }

    if (!validateUrl(url, service.platform)) {
      toast.error('Yanlış URL formatı');
      return;
    }

    if (quantity < minimumQuantity || quantity > maximumQuantity) {
      toast.error(`Miqdar ${minimumQuantity} ilə ${maximumQuantity} arasında olmalıdır`);
      return;
    }

    try {
      setLoading(true);

      // Check user balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Balans yoxlanılarkən xəta baş verdi');
      }

      if (!profile || profile.balance < price) {
        toast.error('Kifayət qədər balansınız yoxdur');
        return;
      }

      // Place order via API
      const orderResponse = await apiClient.placeOrder(
        service.id_service.toString(),
        url,
        quantity,
        {
          comment: comment || undefined,
          ...selectedParams
        }
      );

      console.log('Order API response:', orderResponse);

      if (orderResponse.status !== 'success' && !orderResponse.id_service_submission) {
        throw new Error(orderResponse.message?.[0]?.message || 'Sifarişin verilməsində xəta baş verdi');
      }

      // Create order record in database with external_order_id
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          service_id: service.id_service.toString(),
          service_name: service.public_name,
          platform: service.platform,
          service_type: service.type_name || 'Unknown',
          link: url,
          quantity: quantity,
          price: price,
          status: 'pending',
          comment: comment || null,
          external_order_id: orderResponse.id_service_submission || null
        });

      if (orderError) {
        console.error('Database order creation error:', orderError);
        throw new Error('Sifariş məlumatlarının saxlanmasında xəta baş verdi');
      }

      // Deduct amount from user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - price })
        .eq('id', user.id);

      if (balanceError) {
        console.error('Balance update error:', balanceError);
        throw new Error('Balans yenilənməsində xəta baş verdi');
      }

      toast.success('Sifarişiniz uğurla verildi!');
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Order submission error:', error);
      toast.error(error.message || 'Sifarişin verilməsində xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (paramName: string, value: string) => {
    setSelectedParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sifariş Ver</CardTitle>
        <CardDescription>
          {service.public_name} xidməti üçün sifariş formu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={service.example || `${service.platform} URL daxil edin`}
              required
            />
            <p className="text-sm text-muted-foreground">
              Məsələn: {service.example}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Miqdar</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || minimumQuantity)}
              min={minimumQuantity}
              max={maximumQuantity}
              step={increment}
              required
            />
            <p className="text-sm text-muted-foreground">
              Minimum: {minimumQuantity}, Maksimum: {maximumQuantity.toLocaleString()}
            </p>
          </div>

          {/* Additional service parameters */}
          {service.params && service.params.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Əlavə Parametrlər</h3>
              {service.params.map((param) => (
                <div key={param.field_name} className="space-y-2">
                  <Label htmlFor={param.field_name}>{param.field_label}</Label>
                  {param.field_type === 'dropdown' && param.options ? (
                    <Select
                      value={selectedParams[param.field_name] || ''}
                      onValueChange={(value) => handleParamChange(param.field_name, value)}
                      required={param.field_validators?.includes('required')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={param.field_placeholder || param.field_label} />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={param.field_name}
                      type="text"
                      value={selectedParams[param.field_name] || ''}
                      onChange={(e) => handleParamChange(param.field_name, e.target.value)}
                      placeholder={param.field_placeholder}
                      required={param.field_validators?.includes('required')}
                    />
                  )}
                  {param.field_descr && (
                    <p className="text-sm text-muted-foreground">{param.field_descr}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment">Qeyd (İstəyə görə)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Əlavə qeydlər..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-semibold">Ümumi Qiymət</p>
              <p className="text-sm text-muted-foreground">
                {quantity.toLocaleString()} × ${(price / quantity).toFixed(4)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${price.toFixed(2)}</p>
            </div>
          </div>

          {service.description && (
            <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Xidmət Təsviri</p>
                <p className="text-sm text-blue-700 mt-1">{service.description}</p>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sifariş verilir...
              </>
            ) : (
              'Sifarişi Ver'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
