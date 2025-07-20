
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ServiceGroup {
  api_service_name: string;
  translations: {
    az: string;
    tr: string;
  };
  ids: {
    az?: string;
    tr?: string;
  };
}

export const ServiceNamesManager = () => {
  const { toast } = useToast();
  const [customNames, setCustomNames] = useState<ServiceCustomName[]>([]);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);
  
  const [formData, setFormData] = useState({
    api_service_name: '',
    custom_name_az: '',
    custom_name_tr: ''
  });

  useEffect(() => {
    fetchCustomNames();
  }, []);

  const fetchCustomNames = async () => {
    try {
      const { data, error } = await supabase
        .from('service_custom_names')
        .select('*')
        .order('api_service_name', { ascending: true });

      if (error) throw error;
      
      setCustomNames(data || []);
      groupServicesByName(data || []);
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

  const groupServicesByName = (data: ServiceCustomName[]) => {
    const groups: { [key: string]: ServiceGroup } = {};
    
    data.forEach(item => {
      if (!groups[item.api_service_name]) {
        groups[item.api_service_name] = {
          api_service_name: item.api_service_name,
          translations: { az: '', tr: '' },
          ids: {}
        };
      }
      
      groups[item.api_service_name].translations[item.language_code as 'az' | 'tr'] = item.custom_name;
      groups[item.api_service_name].ids[item.language_code as 'az' | 'tr'] = item.id;
    });
    
    setServiceGroups(Object.values(groups));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.api_service_name.trim() || !formData.custom_name_az.trim() || !formData.custom_name_tr.trim()) {
      toast({
        title: "Xəta",
        description: "Bütün sahələri doldurun",
        variant: "destructive"
      });
      return;
    }

    try {
      const languages = [
        { code: 'az', name: formData.custom_name_az },
        { code: 'tr', name: formData.custom_name_tr }
      ];

      if (editingGroup) {
        // Update existing entries
        for (const lang of languages) {
          const existingId = editingGroup.ids[lang.code as 'az' | 'tr'];
          
          if (existingId) {
            // Update existing record
            const { error } = await supabase
              .from('service_custom_names')
              .update({
                api_service_name: formData.api_service_name.trim(),
                custom_name: lang.name.trim()
              })
              .eq('id', existingId);
            
            if (error) throw error;
          } else {
            // Insert new record for this language
            const { error } = await supabase
              .from('service_custom_names')
              .insert([{
                api_service_name: formData.api_service_name.trim(),
                language_code: lang.code,
                custom_name: lang.name.trim()
              }]);
            
            if (error) throw error;
          }
        }
        
        toast({
          title: "Uğurlu",
          description: "Xidmət adı yeniləndi"
        });
      } else {
        // Create new entries for both languages
        const insertData = languages.map(lang => ({
          api_service_name: formData.api_service_name.trim(),
          language_code: lang.code,
          custom_name: lang.name.trim()
        }));
        
        const { error } = await supabase
          .from('service_custom_names')
          .insert(insertData);
        
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
          ? "Bu xidmət adı artıq mövcuddur" 
          : "Əməliyyat uğursuz oldu",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (group: ServiceGroup) => {
    setEditingGroup(group);
    setFormData({
      api_service_name: group.api_service_name,
      custom_name_az: group.translations.az,
      custom_name_tr: group.translations.tr
    });
    setDialogOpen(true);
  };

  const handleDelete = async (group: ServiceGroup) => {
    if (!confirm('Bu xidmət adını silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('service_custom_names')
        .delete()
        .eq('api_service_name', group.api_service_name);

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
    setEditingGroup(null);
    setFormData({
      api_service_name: '',
      custom_name_az: '',
      custom_name_tr: ''
    });
  };

  if (loading) {
    return <div className="text-center">Yüklənir...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Xidmət Adları</h2>
          <p className="text-muted-foreground">API-dən gələn xidmət adlarını hər iki dil üçün özelleştirin</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ad Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Xidmət Adını Redaktə Et' : 'Yeni Xidmət Adı Əlavə Et'}
              </DialogTitle>
              <DialogDescription>
                API-dən gələn uzun adı hər iki dil üçün qısa və anlaşılan adla əvəz edin
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="api_service_name">API Xidmət Adı (Açar Söz)</Label>
                <Input
                  id="api_service_name"
                  value={formData.api_service_name}
                  onChange={(e) => setFormData({ ...formData, api_service_name: e.target.value })}
                  placeholder="Instagram Likes - [Instant Start]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  API-dən gələn xidmət adının açar hissəsini daxil edin
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="custom_name_az">Azərbaycanca Ad</Label>
                  <Input
                    id="custom_name_az"
                    value={formData.custom_name_az}
                    onChange={(e) => setFormData({ ...formData, custom_name_az: e.target.value })}
                    placeholder="Dərhal"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="custom_name_tr">Türkçe Ad</Label>
                  <Input
                    id="custom_name_tr"
                    value={formData.custom_name_tr}
                    onChange={(e) => setFormData({ ...formData, custom_name_tr: e.target.value })}
                    placeholder="Hemen"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingGroup ? 'Yenilə' : 'Əlavə Et'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {serviceGroups.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Hələ heç bir özel xidmət adı əlavə edilməyib
            </CardContent>
          </Card>
        ) : (
          serviceGroups.map((group) => (
            <Card key={group.api_service_name}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      API Açar Sözü: {group.api_service_name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Azərbaycanca
                        </span>
                        <p className="font-semibold text-primary mt-1">{group.translations.az}</p>
                      </div>
                      <div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Türkçe
                        </span>
                        <p className="font-semibold text-primary mt-1">{group.translations.tr}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(group)}
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
