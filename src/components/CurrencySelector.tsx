
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { DollarSign } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'AZN' : 'USD');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCurrency}
      className="flex items-center gap-2"
    >
      <DollarSign className="h-4 w-4" />
      <span className="font-semibold">{currency}</span>
    </Button>
  );
};
