
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Service } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

interface OrderFormProps {
  selectedService: Service;
  formData: {
    url: string;
    quantity: string;
    additionalParams: Record<string, any>;
  };
  errors: Record<string, string>;
  calculatedPrice: number;
  placing: boolean;
  onUpdateFormData: (field: string, value: any) => void;
  onUpdateAdditionalParam: (paramName: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OrderForm({
  selectedService,
  formData,
  errors,
  calculatedPrice,
  placing,
  onUpdateFormData,
  onUpdateAdditionalParam,
  onSubmit
}: OrderFormProps) {
  const { user } = useAuth();
  
  const getMaximumAmount = () => {
    if (selectedService.prices && selectedService.prices.length > 0) {
      return parseInt(selectedService.prices[0].maximum);
    }
    return null;
  };

  const maximumAmount = getMaximumAmount();
  const minimumAmount = parseInt(selectedService.amount_minimum);

  const handleQuantityChange = (value: string) => {
    if (!value.trim()) {
      onUpdateFormData('quantity', '');
      return;
    }

    const numericValue = parseInt(value);
    
    if (isNaN(numericValue)) {
      return;
    }

    let adjustedValue = numericValue;

    // Auto-adjust to minimum if below
    if (adjustedValue < minimumAmount) {
      adjustedValue = minimumAmount;
    }

    // Auto-adjust to maximum if above
    if (maximumAmount && adjustedValue > maximumAmount) {
      adjustedValue = maximumAmount;
    }

    onUpdateFormData('quantity', adjustedValue.toString());
  };

  return (
    <>
      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url">Məqsəd URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder={selectedService.example || "https://..."}
          value={formData.url}
          onChange={(e) => onUpdateFormData('url', e.target.value)}
          className={errors.url ? 'border-red-500' : ''}
          disabled={!user}
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
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={(e) => handleQuantityChange(e.target.value)}
          className={errors.quantity ? 'border-red-500' : ''}
          min={minimumAmount}
          max={maximumAmount || undefined}
          step={selectedService.amount_increment}
          disabled={!user}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.quantity}
          </p>
        )}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Minimum: {minimumAmount.toLocaleString()}</p>
          {maximumAmount && (
            <p>Maksimum: {maximumAmount.toLocaleString()}</p>
          )}
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
              onValueChange={(value) => onUpdateAdditionalParam(param.field_name, value)}
              disabled={!user}
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
              onChange={(e) => onUpdateAdditionalParam(param.field_name, e.target.value)}
              className={errors[param.field_name] ? 'border-red-500' : ''}
              disabled={!user}
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
        onClick={onSubmit}
      >
        {placing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sifariş verilir...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Sifariş Ver - ${calculatedPrice.toFixed(2)}
          </>
        )}
      </Button>
    </>
  );
}
