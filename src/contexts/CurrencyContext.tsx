
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { currencyService } from '@/services/CurrencyService';

type Currency = 'USD' | 'AZN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency: Currency) => Promise<number>;
  formatAmount: (amount: number, currency?: Currency) => string;
  exchangeRate: number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1.7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserCurrencyPreference();
    loadExchangeRate();
  }, [user]);

  const loadUserCurrencyPreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_currency')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setCurrencyState((data.preferred_currency as Currency) || 'USD');
      }
    } catch (error) {
      console.error('Error loading currency preference:', error);
    }
  };

  const loadExchangeRate = async () => {
    try {
      const rate = await currencyService.getExchangeRate('USD', 'AZN');
      setExchangeRate(rate);
    } catch (error) {
      console.error('Error loading exchange rate:', error);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ preferred_currency: newCurrency })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error saving currency preference:', error);
      }
    }
  };

  const convertAmount = async (amount: number, fromCurrency: Currency): Promise<number> => {
    if (fromCurrency === currency) {
      return amount;
    }

    setLoading(true);
    try {
      const convertedAmount = await currencyService.convertCurrency(amount, fromCurrency, currency);
      return convertedAmount;
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, targetCurrency?: Currency): string => {
    const curr = targetCurrency || currency;
    return currencyService.formatCurrency(amount, curr);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertAmount,
        formatAmount,
        exchangeRate,
        loading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
