
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
        return `${hours} ${t('service.hours')} ${t('service.withinHours')}`;
      }
    }
    
    if (lowerTime.includes('day')) {
      const match = lowerTime.match(/(\d+)\s*day/);
      if (match) {
        const days = parseInt(match[1]);
        return `${days} ${t('service.days')} ${t('service.withinDays')}`;
      }
    }
    
    if (lowerTime.includes('minute') || lowerTime.includes('min')) {
      const match = lowerTime.match(/(\d+)\s*(minute|min)/);
      if (match) {
        const minutes = parseInt(match[1]);
        return `${minutes} ${t('service.minutes')} ${t('service.withinMinutes')}`;
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
      className="p-3 hover:bg-accent/10 data-[highlighted]:bg-accent/10 cursor-pointer border-b border-border/50 last:border-b-0"
    >
      <div className="w-full space-y-3">
        {/* Başlıq və qiymət */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-5 text-foreground">
              {service.public_name}
            </h4>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-bold text-primary text-base">
              ${calculateDisplayPrice(service)}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              1000 {t('service.priceFor')}
            </div>
          </div>
        </div>
        
        {/* Xidmət təfərrüatları */}
        <div className="space-y-1.5">
          {service.amount_minimum && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full flex-shrink-0"></div>
              <span>
                {t('service.minimumOrder')}: <span className="font-medium">{parseInt(service.amount_minimum).toLocaleString()}</span> {t('service.units')}
              </span>
            </div>
          )}
          
          {service.start_time && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <span>
                {t('service.startTime')}: <span className="font-medium">{formatStartTime(service.start_time)}</span>
              </span>
            </div>
          )}
          
          {service.speed && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>
                {t('service.speed')}: <span className="font-medium">{formatSpeed(service.speed)}</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Təsvir */}
        {service.description && service.description.trim() && (
          <div className="border-t border-border/30 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>
        )}
      </div>
    </SelectItem>
  );
};
