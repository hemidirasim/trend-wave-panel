
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, DollarSign, Wallet, AlertTriangle, ShoppingCart, Loader2 } from 'lucide-react';
import { Service } from '@/types/api';

interface OrderSummaryProps {
  selectedService: Service | null;
  quantity: string;
  calculatedPrice: number;
  serviceFeePercentage: number;
  baseFee: number;
  userBalance?: number;
  balanceLoading?: boolean;
  onBalanceTopUp?: () => void;
  showBalanceTopUp?: boolean;
  BalanceTopUpComponent?: React.ReactNode;
  // Order form props
  formData?: {
    serviceId: string;
    url: string;
    quantity: string;
    additionalParams: Record<string, any>;
  };
  errors?: Record<string, string>;
  placing?: boolean;
  onUpdateFormData?: (field: string, value: any) => void;
  onUpdateAdditionalParam?: (paramName: string, value: any) => void;
  onPlaceOrder?: () => void;
}

export function OrderSummary({
  selectedService,
  quantity,
  calculatedPrice,
  serviceFeePercentage,
  baseFee,
  userBalance = 0,
  balanceLoading = false,
  onBalanceTopUp,
  showBalanceTopUp = false,
  BalanceTopUpComponent,
  formData,
  errors = {},
  placing = false,
  onUpdateFormData,
  onUpdateAdditionalParam,
  onPlaceOrder
}: OrderSummaryProps) {
  const quantityNum = parseInt(quantity) || 0;
  const totalPrice = calculatedPrice;
  const hasInsufficientBalance = userBalance < totalPrice && totalPrice > 0;

  // Validate quantity against service limits
  const minQuantity = parseInt(selectedService?.amount_minimum) || 1;
  const maxQuantity = parseInt(selectedService?.prices?.[0]?.maximum) || 10000;
  const isQuantityInvalid = formData ? (parseInt(formData.quantity) || 0) < minQuantity || (parseInt(formData.quantity) || 0) > maxQuantity : false;

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Wallet className="h-5 w-5 mr-2" />
            Balans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mövcud balans:</span>
              <div className="flex items-center space-x-2">
                {balanceLoading ? (
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <Badge variant={userBalance > 0 ? "default" : "secondary"} className="text-lg font-semibold">
                    ${userBalance.toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
            
            {userBalance === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Balansınız 0-dır</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Sifariş vermək üçün balansınızı artırın
                </p>
                <div className="mt-2">
                  {BalanceTopUpComponent}
                </div>
              </div>
            )}

            {hasInsufficientBalance && userBalance > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Kifayət qədər balans yoxdur</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ${(totalPrice - userBalance).toFixed(2)} çatışmır
                </p>
                <div className="mt-2">
                  {BalanceTopUpComponent}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Sifariş Xülasəsi
          </CardTitle>
          <CardDescription>Qiymət hesablaması</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedService && quantityNum > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Xidmət:</span>
                  <span className="font-medium">{selectedService.public_name}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Miqdar:</span>
                  <span className="font-medium">{quantityNum.toLocaleString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cəmi:</span>
                <Badge variant="default" className="text-lg font-bold px-3 py-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {totalPrice.toFixed(2)}
                </Badge>
              </div>
              
              {selectedService.amount_minimum && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <strong>Minimum:</strong> {parseInt(selectedService.amount_minimum).toLocaleString()}
                  {selectedService.prices?.[0]?.maximum && (
                    <span className="ml-2">
                      <strong>Maksimum:</strong> {parseInt(selectedService.prices[0].maximum).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Xidmət və miqdar seçin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Form Card - Only show when service is selected */}
      {selectedService && formData && onUpdateFormData && onUpdateAdditionalParam && onPlaceOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Sifariş Məlumatları
            </CardTitle>
            <CardDescription>Sifarişinizin təfərrüatlarını daxil edin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="sidebar-url">URL *</Label>
              <Input
                id="sidebar-url"
                value={formData.url}
                onChange={(e) => onUpdateFormData('url', e.target.value)}
                placeholder={selectedService?.example || "https://example.com"}
                className={errors.url ? 'border-red-500' : ''}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="sidebar-quantity">Miqdar *</Label>
              <Input
                id="sidebar-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => onUpdateFormData('quantity', e.target.value)}
                min={minQuantity}
                max={maxQuantity}
                step={parseInt(selectedService?.amount_increment) || 1}
                className={`${errors.quantity ? 'border-red-500' : ''} ${isQuantityInvalid ? 'border-red-500' : ''}`}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
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
            {selectedService?.params?.map((param) => (
              <div key={param.field_name} className="space-y-2">
                <Label htmlFor={`sidebar-${param.field_name}`}>
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
                    id={`sidebar-${param.field_name}`}
                    value={formData.additionalParams[param.field_name] || ''}
                    onChange={(e) => onUpdateAdditionalParam(param.field_name, e.target.value)}
                    placeholder={param.field_placeholder}
                    className={errors[param.field_name] ? 'border-red-500' : ''}
                  />
                ) : (
                  <Input
                    id={`sidebar-${param.field_name}`}
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

            {/* Order Button */}
            <Button 
              onClick={onPlaceOrder}
              disabled={
                placing || 
                hasInsufficientBalance || 
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
                `Sifariş ver - $${totalPrice.toFixed(2)}`
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
