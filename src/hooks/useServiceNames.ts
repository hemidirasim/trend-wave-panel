
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceCustomName {
  id: string;
  api_service_name: string;
  language_code: string;
  custom_name: string;
}

export const useServiceNames = () => {
  const { language } = useLanguage();
  const [customNames, setCustomNames] = useState<ServiceCustomName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomNames();
  }, [language]);

  const fetchCustomNames = async () => {
    try {
      const { data, error } = await supabase
        .from('service_custom_names')
        .select('*')
        .eq('language_code', language);

      if (error) throw error;
      setCustomNames(data || []);
    } catch (error) {
      console.error('Error fetching custom service names:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomServiceName = (apiServiceName: string): string => {
    const customName = customNames.find(
      item => item.api_service_name === apiServiceName
    );
    
    return customName ? customName.custom_name : apiServiceName;
  };

  return {
    customNames,
    loading,
    getCustomServiceName
  };
};
