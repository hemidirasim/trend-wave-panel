import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/AdminLayout';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  balance: number;
  created_at: string;
  roles?: Array<{
    role: 'admin' | 'moderator' | 'user';
  }>;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'moderator' | 'user'>('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine users with their roles
      const usersWithRoles = profilesData.map(user => ({
        ...user,
        roles: rolesData.filter(role => role.user_id === user.id)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      toast({
        title: "Xəta",
        description: "İstifadəçilər yüklənmədi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    try {
      // Check if user already has this role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', selectedUser.id)
        .eq('role', newRole)
        .single();

      if (existingRole) {
        toast({
          title: "Məlumat",
          description: "İstifadəçi artıq bu rola malikdir"
        });
        return;
      }

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: newRole
        });

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Rol əlavə edildi"
      });

      setRoleDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Rol əlavə edilmədi",
        variant: "destructive"
      });
    }
  };

  const handleRoleRemove = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Rol silindi"
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Rol silinmədi",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      default: return 'İstifadəçi';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">İstifadəçilər</h1>
            <p className="text-muted-foreground">İstifadəçiləri və rolları idarə edin</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="İstifadəçi axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center">Yüklənir...</div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold">{user.full_name || 'Ad yoxdur'}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Balans:</span>
                        <span className="font-medium">{user.balance} AZN</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Qeydiyyat:</span>
                        <span className="text-sm">
                          {new Date(user.created_at).toLocaleDateString('az-AZ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Rollar:</span>
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((roleData, index) => (
                            <Badge 
                              key={index} 
                              variant={getRoleBadgeVariant(roleData.role)}
                              className="cursor-pointer hover:bg-destructive/80"
                              onClick={() => handleRoleRemove(user.id, roleData.role)}
                              title="Rolu silmək üçün klik edin"
                            >
                              {getRoleText(roleData.role)} ×
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">İstifadəçi</Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setRoleDialogOpen(true);
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Rol Əlavə Et
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Role Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rol Əlavə Et</DialogTitle>
              <DialogDescription>
                {selectedUser?.email} üçün yeni rol seçin
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={newRole} onValueChange={(value: 'admin' | 'moderator' | 'user') => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">İstifadəçi</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                  Ləğv Et
                </Button>
                <Button onClick={handleRoleUpdate}>
                  Əlavə Et
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}