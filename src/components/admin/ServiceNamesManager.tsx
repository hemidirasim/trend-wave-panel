
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ServiceCustomName {
  id: string;
  api_service_name: string;
  language_code: string;
  custom_name: string;
  created_at: string;
  updated_at: string;
}

export const ServiceNamesManager = () => {
  const { toast } = useToast();
  const [customNames, setCustomNames] = useState<ServiceCustomName[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCustomName | null>(null);
  
  const [formData, setFormData] = useState({
    api_service_name: '',
    language_code: 'az',
    custom_name: ''
  });

  useEffect(() => {
    fetchCustomNames();
  }, []);

  const fetchCustomNames = async () => {
    try {
      const { data, error } = await supabase
        .from('service_custom_names')
        .select('*')
        .order('language_code', { ascending: true })
        .order('api_service_name', { ascending: true });

      if (error) throw error;
      setCustomNames(data || []);
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Xidmət adları yüklənmədi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.api_service_name.trim() || !formData.custom_name.trim()) {
      toast({
        title: "Xəta",
        description: "Bütün sahələri doldurun",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('service_custom_names')
          .update({
            api_service_name: formData.api_service_name.trim(),
            language_code: formData.language_code,
            custom_name: formData.custom_name.trim()
          })
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "Xidmət adı yeniləndi"
        });
      } else {
        const { error } = await supabase
          .from('service_custom_names')
          .insert([{
            api_service_name: formData.api_service_name.trim(),
            language_code: formData.language_code,
            custom_name: formData.custom_name.trim()
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "Yeni xidmət adı əlavə edildi"
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchCustomNames();
    } catch (error: any) {
      toast({
        title: "Xəta",
        description: error.message.includes('duplicate') 
          ? "Bu dil üçün xidmət adı artıq mövcuddur" 
          : "Əməliyyat uğursuz oldu",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: ServiceCustomName) => {
    setEditingItem(item);
    setFormData({
      api_service_name: item.api_service_name,
      language_code: item.language_code,
      custom_name: item.custom_name
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu xidmət adını silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('service_custom_names')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Xidmət adı silindi"
      });
      
      fetchCustomNames();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Xidmət adı silinmədi",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      api_service_name: '',
      language_code: 'az',
      custom_name: ''
    });
  };

  const getLanguageName = (code: string) => {
    return code === 'az' ? 'Azərbaycanca' : 'Türkçe';
  };

  if (loading) {
    return <div className="text-center">Yüklənir...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Xidmət Adları</h2>
          <p className="text-muted-foreground">API-dən gələn xidmət adlarını özelleştirin</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ad Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Xidmət Adını Redaktə Et' : 'Yeni Xidmət Adı Əlavə Et'}
              </DialogTitle>
              <DialogDescription>
                API-dən gələn uzun adı qısa və anlaşılan adla əvəz edin
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="api_service_name">API Xidmət Adı</Label>
                <Input
                  id="api_service_name"
                  value={formData.api_service_name}
                  onChange={(e) => setFormData({ ...formData, api_service_name: e.target.value })}
                  placeholder="Instagram Likes - [Instant Start]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  API-dən gələn tam xidmət adını daxil edin
                </p>
              </div>
              
              <div>
                <Label htmlFor="language_code">Dil</Label>
                <Select value={formData.language_code} onValueChange={(value) => setFormData({ ...formData, language_code: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">Azərbaycanca</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="custom_name">Özel Ad</Label>
                <Input
                  id="custom_name"
                  value={formData.custom_name}
                  onChange={(e) => setFormData({ ...formData, custom_name: e.target.value })}
                  placeholder="Like, dərhal"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Göstəriləcək qısa və anlaşılan ad
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Yenilə' : 'Əlavə Et'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {customNames.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Hələ heç bir özel xidmət adı əlavə edilməyib
            </CardContent>
          </Card>
        ) : (
          customNames.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getLanguageName(item.language_code)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-primary">{item.custom_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.api_service_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
