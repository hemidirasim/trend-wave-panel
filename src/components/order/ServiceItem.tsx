
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
      className="p-0 focus:bg-accent/10 data-[highlighted]:bg-accent/10"
    >
      <div className="w-full p-4 space-y-3">
        {/* Service name and price section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-5 text-foreground line-clamp-2">
              {service.public_name}
            </h4>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-bold text-primary text-lg leading-none">
              ${calculateDisplayPrice(service)}
            </div>
            <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
              1000 {t('service.units')} {t('service.priceFor')}
            </div>
          </div>
        </div>
        
        {/* Service details section */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {service.amount_minimum && (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></div>
              <span>
                {t('service.minimumOrder')}: {parseInt(service.amount_minimum).toLocaleString()} {t('service.units')}
              </span>
            </div>
          )}
          {service.start_time && (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></div>
              <span>{formatStartTime(service.start_time)}</span>
            </div>
          )}
          {service.speed && (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></div>
              <span>{t('service.speed')}: {formatSpeed(service.speed)}</span>
            </div>
          )}
        </div>
        
        {/* Description section */}
        {service.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border pt-2">
            {service.description}
          </p>
        )}
      </div>
    </SelectItem>
  );
};
