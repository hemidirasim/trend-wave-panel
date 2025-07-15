
import { useLanguage } from '@/contexts/LanguageContext';

// API stringlərini tərcümə etmək üçün utility funksiyalar
export const translateApiString = (apiString: string, t: (key: string) => string): string => {
  if (!apiString) return '';
  
  const lowerString = apiString.toLowerCase().trim();
  
  // Başlama vaxtı tərcümələri
  if (lowerString.includes('instant') || lowerString.includes('immediate') || lowerString === '0') {
    return t('service.api.instant');
  }
  
  if (lowerString.includes('0-1') && lowerString.includes('hour')) {
    return t('service.api.0-1hour');
  }
  
  if (lowerString.includes('1-6') && lowerString.includes('hour')) {
    return t('service.api.1-6hours');
  }
  
  if (lowerString.includes('6-12') && lowerString.includes('hour')) {
    return t('service.api.6-12hours');
  }
  
  if (lowerString.includes('12-24') && lowerString.includes('hour')) {
    return t('service.api.12-24hours');
  }
  
  if (lowerString.includes('1-3') && lowerString.includes('day')) {
    return t('service.api.1-3days');
  }
  
  if (lowerString.includes('3-7') && lowerString.includes('day')) {
    return t('service.api.3-7days');
  }
  
  if (lowerString.includes('slow') && lowerString.includes('start')) {
    return t('service.api.slowstart');
  }
  
  if (lowerString.includes('fast') && lowerString.includes('start')) {
    return t('service.api.faststart');
  }
  
  if (lowerString.includes('normal') && lowerString.includes('start')) {
    return t('service.api.normalstart');
  }
  
  // Sürət tərcümələri
  if (lowerString.includes('per') && lowerString.includes('day')) {
    const match = lowerString.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?day/);
    if (match) {
      const amount = match[1].replace(/,/g, '');
      return `${parseInt(amount).toLocaleString()} ${t('service.api.perday')}`;
    }
  }
  
  if (lowerString.includes('per') && lowerString.includes('hour')) {
    const match = lowerString.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
    if (match) {
      const amount = match[1].replace(/,/g, '');
      return `${parseInt(amount).toLocaleString()} ${t('service.api.perhour')}`;
    }
  }
  
  // Ümumi rəqəm və zaman tərcümələri
  if (lowerString.includes('hour')) {
    const match = lowerString.match(/(\d+)\s*hour/);
    if (match) {
      const hours = parseInt(match[1]);
      return `${hours} ${t('service.api.hour')} ${t('service.api.within')}`;
    }
  }
  
  if (lowerString.includes('day')) {
    const match = lowerString.match(/(\d+)\s*day/);
    if (match) {
      const days = parseInt(match[1]);
      return `${days} ${t('service.api.day')} ${t('service.api.within')}`;
    }
  }
  
  if (lowerString.includes('minute') || lowerString.includes('min')) {
    const match = lowerString.match(/(\d+)\s*(minute|min)/);
    if (match) {
      const minutes = parseInt(match[1]);
      return `${minutes} ${t('service.api.minute')} ${t('service.api.within')}`;
    }
  }
  
  // Əgər heç bir uyğunluq tapılmasa, orijinal stringi qaytarırıq
  return apiString;
};

// Hook formasında istifadə üçün
export const useApiStringTranslator = () => {
  const { t } = useLanguage();
  
  return {
    translateStartTime: (startTime?: string) => translateApiString(startTime || '', t),
    translateSpeed: (speed?: string) => translateApiString(speed || '', t)
  };
};
