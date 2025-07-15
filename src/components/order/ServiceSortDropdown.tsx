
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceSortDropdownProps {
  priceFilter: 'low-to-high' | 'high-to-low';
  onPriceFilterChange: (filter: 'low-to-high' | 'high-to-low') => void;
}

export const ServiceSortDropdown = ({ priceFilter, onPriceFilterChange }: ServiceSortDropdownProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={priceFilter} onValueChange={onPriceFilterChange}>
        <SelectTrigger className="w-40 h-9 bg-background border-input">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="low-to-high" className="hover:bg-accent hover:text-accent-foreground">
            {t('service.sortLowToHigh')}
          </SelectItem>
          <SelectItem value="high-to-low" className="hover:bg-accent hover:text-accent-foreground">
            {t('service.sortHighToLow')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
