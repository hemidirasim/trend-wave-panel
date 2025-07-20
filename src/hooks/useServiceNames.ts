
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
      console.log('🔥 useServiceNames: Fetching custom names for language:', language);
      const { data, error } = await supabase
        .from('service_custom_names')
        .select('*')
        .eq('language_code', language);

      if (error) {
        console.error('🔥 useServiceNames: Error fetching custom names:', error);
        throw error;
      }
      
      console.log('🔥 useServiceNames: Fetched custom names:', data);
      setCustomNames(data || []);
    } catch (error) {
      console.error('Error fetching custom service names:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomServiceName = (apiServiceName: string): string => {
    console.log('🔥 useServiceNames: Looking for contains match for:', apiServiceName);
    console.log('🔥 useServiceNames: Available custom names:', customNames);
    
    // Find custom name where API service name contains the database name
    const customName = customNames.find(
      item => apiServiceName.includes(item.api_service_name)
    );
    
    let result = apiServiceName;
    
    if (customName) {
      // Replace the matched part with custom name
      result = apiServiceName.replace(customName.api_service_name, customName.custom_name);
    }
    
    console.log('🔥 useServiceNames: Result:', {
      input: apiServiceName,
      matched: customName?.api_service_name || 'none',
      output: result
    });
    
    return result;
  };

  return {
    customNames,
    loading,
    getCustomServiceName
  };
};
