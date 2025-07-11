
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  service_fee: number; // Changed from commission_rate to service_fee
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  applyServiceFee: (basePrice: number) => number;
  loading: boolean; // Add loading state
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    service_fee: 0 // Default service fee is 0 dollars
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    console.log('🔥 SettingsContext: Loading settings from localStorage');
    try {
      const savedSettings = localStorage.getItem('admin_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        console.log('🔥 SettingsContext: Parsed settings from localStorage:', parsed);
        
        // Handle migration from old commission_rate to new service_fee
        if (parsed.commission_rate !== undefined && parsed.service_fee === undefined) {
          parsed.service_fee = 0; // Default to 0 for migration
          delete parsed.commission_rate;
        }
        
        setSettings(prev => {
          const updated = { ...prev, ...parsed };
          console.log('🔥 SettingsContext: Updated settings state:', updated);
          return updated;
        });
      } else {
        console.log('🔥 SettingsContext: No saved settings found in localStorage');
      }
    } catch (error) {
      console.error('🔥 SettingsContext: Error parsing saved settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    console.log('🔥 SettingsContext: updateSettings called with:', newSettings);
    
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('🔥 SettingsContext: Setting new state:', updated);
      
      try {
        localStorage.setItem('admin_settings', JSON.stringify(updated));
        console.log('🔥 SettingsContext: Saved to localStorage:', updated);
      } catch (error) {
        console.error('🔥 SettingsContext: Error saving to localStorage:', error);
      }
      
      return updated;
    });
  };

  const applyServiceFee = (basePrice: number): number => {
    const result = basePrice + settings.service_fee;
    console.log('🔥 SettingsContext: applyServiceFee called:', {
      basePrice,
      serviceFee: settings.service_fee,
      result
    });
    return result;
  };

  // Add a listener for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_settings' && e.newValue) {
        console.log('🔥 SettingsContext: Storage changed, reloading settings');
        loadSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
