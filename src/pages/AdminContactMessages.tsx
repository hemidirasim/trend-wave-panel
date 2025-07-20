
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Eye, Check, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Mesajları yükləyərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));
      
      toast.success('Mesaj statusu yeniləndi');
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Status yenilənərkən xəta baş verdi');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      toast.success('Mesaj silindi');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Mesaj silinərkən xəta baş verdi');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Yeni</Badge>;
      case 'read':
        return <Badge variant="secondary">Oxunub</Badge>;
      case 'replied':
        return <Badge variant="default">Cavablandı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Əlaqə Mesajları</h1>
            <p className="text-muted-foreground">
              Saytdan gələn bütün əlaqə mesajlarını idarə edin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span className="font-semibold">{messages.length} mesaj</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mesajlar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mövzu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead>Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>
                      {format(new Date(message.created_at), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMessage(message);
                                if (message.status === 'new') {
                                  updateMessageStatus(message.id, 'read');
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Mesaj Detalları</DialogTitle>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Ad:</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email:</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Mövzu:</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.subject}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Mesaj:</label>
                                  <div className="mt-2 p-4 bg-muted rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>Göndərilmə tarixi: {format(new Date(selectedMessage.created_at), 'dd.MM.yyyy HH:mm')}</span>
                                  {getStatusBadge(selectedMessage.status)}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {message.status !== 'replied' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, 'replied')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {messages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Mail className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Hələ heç bir mesaj yoxdur</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
