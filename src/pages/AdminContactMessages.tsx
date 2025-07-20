
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Eye, Trash2, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Əlaqə mesajları yüklənir...');
      
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Mesajları yükləyərkən xəta:', error);
        throw error;
      }

      console.log('Yüklənən mesajlar:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Mesajları yükləyərkən xəta:', error);
      toast({
        title: "Xəta",
        description: "Mesajları yükləyərkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));

      toast({
        title: "Uğurlu",
        description: `Mesaj ${status === 'read' ? 'oxunmuş' : 'cavablanmış'} olaraq işarələndi.`,
      });
    } catch (error) {
      console.error('Status yeniləyərkən xəta:', error);
      toast({
        title: "Xəta",
        description: "Status yeniləyərkən xəta baş verdi.",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Bu mesajı silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      toast({
        title: "Uğurlu",
        description: "Mesaj silindi.",
      });
    } catch (error) {
      console.error('Mesaj silərkən xəta:', error);
      toast({
        title: "Xəta",
        description: "Mesaj silərkən xəta baş verdi.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Yeni</Badge>;
      case 'read':
        return <Badge variant="secondary">Oxunmuş</Badge>;
      case 'replied':
        return <Badge variant="default">Cavablanmış</Badge>;
      default:
        return <Badge variant="outline">Naməlum</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    return messages.filter(msg => msg.status === status).length;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Mesajlar yüklənir...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Əlaqə Mesajları</h1>
          <p className="text-muted-foreground">
            Müştərilərdən gələn mesajları idarə edin
          </p>
        </div>

        {/* Statistika kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ümumi Mesajlar</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yeni Mesajlar</CardTitle>
              <Mail className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{getStatusCount('new')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oxunmuş</CardTitle>
              <Eye className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('read')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cavablanmış</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('replied')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Mesajlar cədvəli */}
        <Card>
          <CardHeader>
            <CardTitle>Mesajlar</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Hələ ki heç bir mesaj yoxdur.</p>
              </div>
            ) : (
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
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                      disabled={selectedMessage.status === 'replied'}
                                    >
                                      Cavablanmış olaraq işarələ
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                                    >
                                      Email ilə cavabla
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

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
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
