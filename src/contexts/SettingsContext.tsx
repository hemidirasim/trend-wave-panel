
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  service_fee: number;
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
    service_fee: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    console.log('🔥 SettingsContext: Loading settings from database');
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'service_fee')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('🔥 SettingsContext: Error loading settings:', error);
        return;
      }

      if (data) {
        const serviceFee = parseFloat(String(data.setting_value)) || 0;
        console.log('🔥 SettingsContext: Loaded service_fee from database:', serviceFee);
        
        setSettings(prev => {
          const updated = { ...prev, service_fee: serviceFee };
          console.log('🔥 SettingsContext: Updated settings state:', updated);
          return updated;
        });
      } else {
        console.log('🔥 SettingsContext: No service_fee setting found in database, using default: 0');
      }
    } catch (error) {
      console.error('🔥 SettingsContext: Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    console.log('🔥 SettingsContext: updateSettings called with:', newSettings);
    
    try {
      if (newSettings.service_fee !== undefined) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert({
            setting_key: 'service_fee',
            setting_value: newSettings.service_fee.toString()
          }, { onConflict: 'setting_key' });

        if (error) {
          console.error('🔥 SettingsContext: Error saving service_fee to database:', error);
          return;
        }

        console.log('🔥 SettingsContext: Successfully saved service_fee to database:', newSettings.service_fee);
      }

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
    // Service fee-ni faiz olaraq tətbiq et (məsələn: 10 = 10%)
    const feeMultiplier = 1 + (settings.service_fee / 100);
    const result = basePrice * feeMultiplier;
    console.log('🔥 SettingsContext: applyServiceFee called:', {
      basePrice,
      serviceFeePercent: settings.service_fee,
      feeMultiplier: feeMultiplier,
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
