
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

  // Load settings on component mount - now available for ALL users
  useEffect(() => {
    loadSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔥 SettingsContext: Received settings update event:', event.detail);
      setSettings(prev => ({ ...prev, ...event.detail }));
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  const loadSettings = async () => {
    console.log('🔥 SettingsContext: Loading settings from database for all users');
    try {
      setLoading(true);
      
      // Use public access to read admin settings - no auth required for reading
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['service_fee', 'base_fee']);

      if (error) {
        console.error('🔥 SettingsContext: Error loading settings:', error);
        // If there's an error (like RLS blocking), use default values
        console.log('🔥 SettingsContext: Using default settings due to error');
        setSettings({ service_fee: 0, base_fee: 0 });
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = { service_fee: 0, base_fee: 0 };
        
        data.forEach((item) => {
          const key = item.setting_key as keyof Settings;
          let value = item.setting_value;
          
          // Parse the value correctly
          if (typeof value === 'number') {
            newSettings[key] = value;
          } else if (typeof value === 'string') {
            const numValue = parseFloat(value);
            newSettings[key] = isNaN(numValue) ? 0 : numValue;
          } else {
            const numValue = parseFloat(String(value));
            newSettings[key] = isNaN(numValue) ? 0 : numValue;
          }
        });
        
        console.log('🔥 SettingsContext: Loaded settings from database for all users:', newSettings);
        setSettings(newSettings);
      } else {
        console.log('🔥 SettingsContext: No settings found in database, using defaults');
        setSettings({ service_fee: 0, base_fee: 0 });
      }
    } catch (error) {
      console.error('🔥 SettingsContext: Error loading settings:', error);
      // Fallback to default values
      setSettings({ service_fee: 0, base_fee: 0 });
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

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: newSettings }));

      // Reload settings to ensure consistency
      await loadSettings();
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
