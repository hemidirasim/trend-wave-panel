
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceInfoProps {
  serviceDescription: string | null;
  loading: boolean;
}

export function ServiceInfo({ serviceDescription, loading }: ServiceInfoProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label className="flex items-center text-base font-medium">
        <Info className="h-4 w-4 mr-2" />
        {t('order.serviceInfo')}
        {loading && (
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
        )}
      </Label>
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('order.serviceInfoLoading')}
              </div>
            ) : serviceDescription ? (
              <div className="whitespace-pre-line">
                {serviceDescription}
              </div>
            ) : (
              <span className="italic text-muted-foreground">
                {t('order.serviceInfoNotAvailable')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
