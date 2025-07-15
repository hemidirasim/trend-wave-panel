import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  service_fee: number; // Faiz (məs. 10 = 10%)
  base_fee: number; // Standart qiymət (məs. 0.50 USD)
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  applyServiceFee: (basePrice: number) => number;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    service_fee: 0,
    base_fee: 0
  });
  const [loading, setLoading] = useState(true);

  // Load settings on component mount and set up real-time refresh
  useEffect(() => {
    loadSettings();
    
    // Set up interval to refresh settings every 30 seconds to ensure fresh data
    const interval = setInterval(loadSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSettings = async () => {
    console.log('🔥 SettingsContext: Loading settings from database');
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['service_fee', 'base_fee']);

      if (error && error.code !== 'PGRST116') {
        console.error('🔥 SettingsContext: Error loading settings:', error);
        // Even if there's an error, continue with defaults to prevent blocking
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = { service_fee: 0, base_fee: 0 };
        
        data.forEach((item) => {
          const key = item.setting_key as keyof Settings;
          let value = item.setting_value;
          
          if (typeof value === 'number') {
            newSettings[key] = value;
          } else if (typeof value === 'string') {
            newSettings[key] = parseFloat(value) || 0;
          } else {
            newSettings[key] = parseFloat(String(value)) || 0;
          }
        });
        
        console.log('🔥 SettingsContext: Loaded settings from database:', newSettings);
        setSettings(newSettings);
      } else {
        console.log('🔥 SettingsContext: No settings found in database, using defaults');
        // Keep default values (0, 0)
      }
    } catch (error) {
      console.error('🔥 SettingsContext: Error loading settings:', error);
      // Keep default values and continue
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    console.log('🔥 SettingsContext: updateSettings called with:', newSettings);
    
    try {
      const settingsToUpdate = Object.entries(newSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert(setting, { onConflict: 'setting_key' });

        if (error) {
          console.error(`🔥 SettingsContext: Error saving ${setting.setting_key} to database:`, error);
          return;
        }
      }

      console.log('🔥 SettingsContext: Successfully saved settings to database:', newSettings);

      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        console.log('🔥 SettingsContext: Updated local state:', updated);
        return updated;
      });
    } catch (error) {
      console.error('🔥 SettingsContext: Error in updateSettings:', error);
    }
  };

  const applyServiceFee = (basePrice: number): number => {
    // Əvvəlcə standart qiymət əlavə et
    const priceWithBaseFee = basePrice + settings.base_fee;
    
    // Sonra faiz tətbiq et
    const feeAmount = (priceWithBaseFee * settings.service_fee) / 100;
    const result = priceWithBaseFee + feeAmount;
    
    console.log('🔥 SettingsContext: applyServiceFee called:', {
      basePrice,
      baseFee: settings.base_fee,
      priceWithBaseFee,
      serviceFeePercentage: settings.service_fee,
      feeAmount,
      result
    });
    
    return result;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, applyServiceFee, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
