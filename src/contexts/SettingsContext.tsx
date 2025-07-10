
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  service_fee: number; // Changed from commission_rate to service_fee
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  applyServiceFee: (basePrice: number) => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    service_fee: 0 // Default service fee is 0 dollars
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Handle migration from old commission_rate to new service_fee
        if (parsed.commission_rate !== undefined && parsed.service_fee === undefined) {
          parsed.service_fee = 0; // Default to 0 for migration
          delete parsed.commission_rate;
        }
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('admin_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const applyServiceFee = (basePrice: number): number => {
    return basePrice + settings.service_fee;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, applyServiceFee }}>
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
