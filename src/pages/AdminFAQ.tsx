
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/AdminLayout';
import { Badge } from '@/components/ui/badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminFAQ() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [faqItems, setFAQItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order_index: 0,
    active: true
  });

  useEffect(() => {
    if (user) {
      fetchFAQItems();
    }
  }, [user]);

  const fetchFAQItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFAQItems((data || []) as FAQItem[]);
    } catch (error) {
      toast({
        title: "Xəta",
        description: "FAQ məlumatları yüklənmədi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        category: formData.category || null
      };

      if (editingItem) {
        const { error } = await supabase
          .from('faq_items')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "FAQ məlumatı yeniləndi"
        });
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert([itemData]);
        
        if (error) throw error;
        
        toast({
          title: "Uğurlu",
          description: "FAQ məlumatı əlavə edildi"
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchFAQItems();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Əməliyyat uğursuz oldu",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu FAQ məlumatını silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "FAQ məlumatı silindi"
      });
      
      fetchFAQItems();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "FAQ məlumatı silinmədi",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || '',
      order_index: item.order_index,
      active: item.active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      category: '',
      order_index: 0,
      active: true
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Giriş Tələb Olunur</CardTitle>
            <CardDescription>Admin panelinə daxil olmaq üçün giriş edin</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">FAQ</h1>
            <p className="text-muted-foreground">Tez-tez verilən sualları idarə edin</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Sual
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Sualı Redaktə Et' : 'Yeni Sual Əlavə Et'}
                </DialogTitle>
                <DialogDescription>
                  FAQ məlumatlarını daxil edin
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="question">Sual</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="answer">Cavab</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Kateqoriya</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Məsələn: Ümumi, Ödəniş, Xidmətlər"
                  />
                </div>
                
                <div>
                  <Label htmlFor="order_index">Sıralama</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Aktiv</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Ləğv Et
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Yenilə' : 'Əlavə Et'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center">Yüklənir...</div>
        ) : (
          <div className="grid gap-4">
            {faqItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{item.question}</h3>
                        <Badge variant={item.active ? "default" : "secondary"}>
                          {item.active ? 'Aktiv' : 'Deaktiv'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.answer}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Kateqoriya: {item.category || 'Ümumi'}</span>
                        <span>Sıra: {item.order_index}</span>
                      </div>
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
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
