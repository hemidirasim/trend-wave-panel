
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email ünvanı daxil edin'),
  phone: z.string().min(10, 'Telefon nömrəsi ən azı 10 simvol olmalıdır'),
  service: z.string().min(1, 'Xidmət seçin'),
  message: z.string().min(10, 'Mesaj ən azı 10 simvol olmalıdır'),
});

interface ConsultationDialogProps {
  children: React.ReactNode;
  serviceName?: string;
}

export function ConsultationDialog({ children, serviceName }: ConsultationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: serviceName || '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', values);
      
      toast({
        title: "Müraciətiniz göndərildi!",
        description: "Tezliklə sizinlə əlaqə saxlayacağıq.",
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Xəta baş verdi",
        description: "Zəhmət olmasa yenidən cəhd edin.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Xidmət seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="smm">SMM Xidməti</SelectItem>
                      <SelectItem value="google-ads">Google Reklamları</SelectItem>
                      <SelectItem value="youtube-ads">YouTube Reklamları</SelectItem>
                      <SelectItem value="seo">SEO Xidməti</SelectItem>
                      <SelectItem value="logo">Loqo Hazırlanması</SelectItem>
                      <SelectItem value="web">Sayt Hazırlanması</SelectItem>
                      <SelectItem value="tv-radio">TV/Radio Reklam</SelectItem>
                      <SelectItem value="facebook-ads">Facebook/Instagram Reklam</SelectItem>
                      <SelectItem value="social-media">Sosial Media Engagement</SelectItem>
                      <SelectItem value="other">Digər</SelectItem>
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
              <Button type="submit" className="w-full" size="lg">
                Məsləhət Tələb Et
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
    </Dialog>
  );
}
