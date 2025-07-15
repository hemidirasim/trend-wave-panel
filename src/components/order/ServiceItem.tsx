
import React from 'react';
import { SelectItem } from '@/components/ui/select';
import { Service } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceItemProps {
  service: Service;
  calculateDisplayPrice: (service: Service, quantity?: number) => string;
}

export const ServiceItem = ({ service, calculateDisplayPrice }: ServiceItemProps) => {
  const { t } = useLanguage();

  const formatStartTime = (startTime?: string) => {
    if (!startTime) return '';
    
    const lowerTime = startTime.toLowerCase();
    
    if (lowerTime.includes('instant') || lowerTime.includes('immediate') || lowerTime === '0') {
      return t('service.instant');
    }
    
    if (lowerTime.includes('hour')) {
      const match = lowerTime.match(/(\d+)\s*hour/);
      if (match) {
        const hours = parseInt(match[1]);
        return `${hours} ${t('service.hours')} ərzində`;
      }
    }
    
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} ${t('service.days')} ərzində`;
      }
    }
    
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} ${t('service.minutes')} ərzində`;
      }
    }
    
    return startTime;
  };

  const formatSpeed = (speed?: string) => {
    if (!speed) return '';
    
    const lowerSpeed = speed.toLowerCase();
    
    if (lowerSpeed.includes('day')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?day/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${parseInt(amount).toLocaleString()} ${t('service.perDay')}`;
      }
    }
    
    if (lowerSpeed.includes('hour')) {
      const match = lowerSpeed.match(/(\d+[,\s]*\d*)\s*(?:per\s*)?hour/);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return `${parseInt(amount).toLocaleString()} ${t('service.perHour')}`;
      }
    }
    
    return speed;
  };

  return (
    <SelectItem 
      value={service.id_service.toString()}
      className="py-3 px-3 hover:bg-accent/50 cursor-pointer"
    >
      <div className="flex flex-col w-full space-y-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 min-w-0 pr-3">
            <h4 className="font-medium text-sm leading-tight text-foreground truncate">
              {service.public_name}
            </h4>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-bold text-primary text-base">
              ${calculateDisplayPrice(service)}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              1000 {t('service.units')} {t('service.priceFor')}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {service.amount_minimum && (
            <span className="flex items-center">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0"></span>
              {t('service.minimumOrder')}: {parseInt(service.amount_minimum).toLocaleString()} {t('service.units')}
            </span>
          )}
          {service.start_time && (
            <span className="flex items-center">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0"></span>
              {formatStartTime(service.start_time)}
            </span>
          )}
          {service.speed && (
            <span className="flex items-center">
              <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2 flex-shrink-0"></span>
              {t('service.speed')}: {formatSpeed(service.speed)}
            </span>
          )}
        </div>
        
        {service.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {service.description}
          </p>
        )}
      </div>
    </SelectItem>
  );
};
