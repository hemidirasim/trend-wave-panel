
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
    console.log('🔥 useServiceNames: Looking for match for API service:', apiServiceName);
    console.log('🔥 useServiceNames: Available custom names:', customNames.map(c => c.api_service_name));
    
    // First try exact match
    let customName = customNames.find(
      item => item.api_service_name.toLowerCase() === apiServiceName.toLowerCase()
    );
    
    if (customName) {
      console.log('🔥 useServiceNames: Found exact match:', customName.api_service_name, '->', customName.custom_name);
      return customName.custom_name;
    }
    
    // Then try contains match - API service name contains the database name
    customName = customNames.find(
      item => apiServiceName.toLowerCase().includes(item.api_service_name.toLowerCase())
    );
    
    if (customName) {
      console.log('🔥 useServiceNames: Found contains match:', customName.api_service_name, 'in', apiServiceName);
      // Replace the matched part with custom name
      const result = apiServiceName.replace(
        new RegExp(customName.api_service_name, 'gi'), 
        customName.custom_name
      );
      console.log('🔥 useServiceNames: Replaced result:', result);
      return result;
    }
    
    // Finally try reverse contains - database name contains API service name
    customName = customNames.find(
      item => item.api_service_name.toLowerCase().includes(apiServiceName.toLowerCase())
    );
    
    if (customName) {
      console.log('🔥 useServiceNames: Found reverse contains match:', apiServiceName, 'in', customName.api_service_name);
      return customName.custom_name;
    }
    
    console.log('🔥 useServiceNames: No match found for:', apiServiceName);
    return apiServiceName;
  };

  return {
    customNames,
    loading,
    getCustomServiceName
  };
};
