
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
    console.log('🔥 useServiceNames: Looking for custom name for:', apiServiceName);
    console.log('🔥 useServiceNames: Available custom names:', customNames);
    
    // First try exact match
    let customName = customNames.find(
      item => item.api_service_name === apiServiceName
    );
    
    // If no exact match, try partial match (for cases where API name might have extra characters)
    if (!customName) {
      customName = customNames.find(item => {
        const apiLower = apiServiceName.toLowerCase();
        const dbLower = item.api_service_name.toLowerCase();
        return apiLower.includes(dbLower) || dbLower.includes(apiLower);
      });
    }
    
    // If still no match, try to find by key parts of the service name
    if (!customName) {
      customName = customNames.find(item => {
        const apiWords = apiServiceName.toLowerCase().split(/[\s\-\[\]]+/).filter(w => w.length > 2);
        const dbWords = item.api_service_name.toLowerCase().split(/[\s\-\[\]]+/).filter(w => w.length > 2);
        
        // Check if at least 50% of words match
        const matchingWords = apiWords.filter(word => 
          dbWords.some(dbWord => dbWord.includes(word) || word.includes(dbWord))
        );
        
        return matchingWords.length >= Math.ceil(apiWords.length * 0.5);
      });
    }
    
    const result = customName ? customName.custom_name : apiServiceName;
    console.log('🔥 useServiceNames: Final result:', {
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
