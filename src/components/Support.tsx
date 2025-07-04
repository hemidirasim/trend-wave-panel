
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'normal'
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Biletlər yüklənərkən xəta baş verdi');
      } else {
        setTickets(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Biletlər yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Mesajlar yüklənərkən xəta baş verdi');
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Mesajlar yüklənərkən xəta baş verdi');
    }
  };

  const createTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Başlıq və təsvir sahələri mütləqdir');
      return;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user?.id,
            title: newTicket.title,
            description: newTicket.description,
            priority: newTicket.priority
          }
        ]);

      if (error) {
        console.error('Error creating ticket:', error);
        toast.error('Bilet yaradılarkən xəta baş verdi');
      } else {
        toast.success('Bilet uğurla yaradıldı');
        setNewTicket({ title: '', description: '', priority: 'normal' });
        setIsDialogOpen(false);
        fetchTickets();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Bilet yaradılarkən xəta baş verdi');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) {
      return;
    }

    try {
      const { error } = await supabase
        .from('support_ticket_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            user_id: user?.id,
            message: newMessage,
            is_admin: false
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Mesaj göndərilmədi');
      } else {
        setNewMessage('');
        fetchMessages(selectedTicket.id);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Mesaj göndərilmədi');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-green-600"><Clock className="h-3 w-3 mr-1" />Açıq</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-600"><AlertCircle className="h-3 w-3 mr-1" />İcrada</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-purple-600"><CheckCircle className="h-3 w-3 mr-1" />Həll edildi</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="h-3 w-3 mr-1" />Bağlandı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Təcili</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Yüksək</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-gray-500">Aşağı</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedTicket(null)}>
            ← Geri
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusBadge(selectedTicket.status)}
            {getPriorityBadge(selectedTicket.priority)}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedTicket.title}</CardTitle>
            <CardDescription>
              {formatDate(selectedTicket.created_at)} - {selectedTicket.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.is_admin 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Mesajınızı yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dəstək Mərkəzi</h2>
          <p className="text-muted-foreground">Biletlərinizi idarə edin və yardım alın</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Bilet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Dəstək Bileti</DialogTitle>
              <DialogDescription>
                Probleminizi təsvir edin və dəstək komandamız sizə yardım edəcək
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Başlıq</Label>
                <Input
                  id="title"
                  placeholder="Probleminizin qısa başlığı"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="priority">Prioritet</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Aşağı</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Yüksək</SelectItem>
                    <SelectItem value="urgent">Təcili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Təsvir</Label>
                <Textarea
                  id="description"
                  placeholder="Probleminizi ətraflı izah edin..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={createTicket} className="w-full">
                Bilet Yarat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setSelectedTicket(ticket);
              fetchMessages(ticket.id);
            }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                <CardDescription>
                  {ticket.description.length > 100 
                    ? `${ticket.description.substring(0, 100)}...` 
                    : ticket.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yaradılıb: {formatDate(ticket.created_at)}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Hələ dəstək bileti yoxdur</h3>
              <p className="text-muted-foreground mb-4">
                Probleminiz varsa, yeni bilet yaradın
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Support;
