
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  platform: string | null;
  category: string;
  active: boolean;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

export const ServiceSelector = ({ services, selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const { applyServiceFee, loading: settingsLoading } = useSettings();

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const getDisplayPrice = (basePrice: number | null) => {
    if (!basePrice || settingsLoading) return basePrice?.toFixed(2) || '0.00';
    
    const finalPrice = applyServiceFee(basePrice);
    return finalPrice.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Xidmət Seçin</h2>
        <p className="text-muted-foreground">
          Ehtiyacınıza uyğun sosial media xidmətini seçin
        </p>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryServices.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base line-clamp-2">
                      {service.name}
                    </CardTitle>
                    {service.platform && (
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {service.platform}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {service.description && (
                    <CardDescription className="text-sm mb-3 line-clamp-2">
                      {service.description}
                    </CardDescription>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-primary">
                        ${getDisplayPrice(service.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        1000 ədəd üçün
                      </span>
                    </div>
                    <Button
                      variant={selectedService?.id === service.id ? "default" : "outline"}
                      size="sm"
                    >
                      {selectedService?.id === service.id ? 'Seçilib' : 'Seç'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
