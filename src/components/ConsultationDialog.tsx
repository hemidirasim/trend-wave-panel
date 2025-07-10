import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email ünvanı daxil edin'),
  phone: z.string().min(10, 'Telefon nömrəsi ən azı 10 simvol olmalıdır'),
  service: z.string().min(1, 'Xidmət seçin'),
  message: z.string().min(10, 'Mesaj ən azı 10 simvol olmalıdır'),
});

interface ConsultationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  serviceName?: string;
  children?: React.ReactNode;
}

export function ConsultationDialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, serviceName, children }: ConsultationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      service: serviceName || '',
      message: '',
    },
  });

  // Update service field when serviceName changes
  React.useEffect(() => {
    if (serviceName) {
      form.setValue('service', serviceName);
    }
  }, [serviceName, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Xəta baş verdi",
        description: "Məsləhət sorğusu göndərmək üçün daxil olmalısınız.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          service: values.service,
          message: values.message,
        });

      if (error) throw error;
      
      toast({
        title: "Müraciətiniz göndərildi!",
        description: "Tezliklə sizinlə əlaqə saxlayacağıq.",
      });
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Consultation submission error:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Zəhmət olmasa yenidən cəhd edin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center mb-2">
          Pulsuz Məsləhət Alın
        </DialogTitle>
        <p className="text-muted-foreground text-center">
          Formu doldurun və mütəxəssislərimiz sizinlə əlaqə saxlasın
        </p>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Soyad *</FormLabel>
                <FormControl>
                  <Input placeholder="Adınızı və soyadınızı daxil edin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon nömrəsi *</FormLabel>
                <FormControl>
                  <Input placeholder="+994 XX XXX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maraqlandığınız xidmət *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Xidmət seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SMM Xidməti">SMM Xidməti</SelectItem>
                    <SelectItem value="Google Reklamları">Google Reklamları</SelectItem>
                    <SelectItem value="YouTube Reklamları">YouTube Reklamları</SelectItem>
                    <SelectItem value="SEO Xidməti">SEO Xidməti</SelectItem>
                    <SelectItem value="Loqo Hazırlanması">Loqo Hazırlanması</SelectItem>
                    <SelectItem value="Sayt Hazırlanması">Sayt Hazırlanması</SelectItem>
                    <SelectItem value="TV/Radio Reklam">TV/Radio Reklam</SelectItem>
                    <SelectItem value="Facebook/Instagram Reklam">Facebook/Instagram Reklam</SelectItem>
                    <SelectItem value="Sosial Media Engagement">Sosial Media Engagement</SelectItem>
                    <SelectItem value="Instagram Engagement">Instagram Engagement</SelectItem>
                    <SelectItem value="TikTok Marketinq">TikTok Marketinq</SelectItem>
                    <SelectItem value="YouTube Böyütmə">YouTube Böyütmə</SelectItem>
                    <SelectItem value="Ümumi Məsləhət">Ümumi Məsləhət</SelectItem>
                    <SelectItem value="Digər">Digər</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mesajınız *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Layihəniz haqqında ətraflı məlumat verin..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 pt-4">
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Göndərilir...' : 'Məsləhət Tələb Et'}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">və ya birbaşa əlaqə saxlayın:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>+994 XX XXX XX XX</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>info@hitloyal.com</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );

  // If children are provided, use DialogTrigger pattern
  if (children) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  // Otherwise, use controlled dialog pattern
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {dialogContent}
    </Dialog>
  );
}
