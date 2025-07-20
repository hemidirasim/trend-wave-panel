
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { User, Lock, Mail, Save } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  created_at: string;
}

interface AccountSettingsProps {
  profile: Profile | null;
  onProfileUpdate: () => void;
}

const AccountSettings = ({ profile, onProfileUpdate }: AccountSettingsProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const updateProfile = async () => {
    if (!profileData.full_name.trim()) {
      toast.error(t('account.fullNameRequired'));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          email: profileData.email
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error(t('account.profileUpdateError'));
      } else {
        toast.success(t('account.profileUpdated'));
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('account.profileUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!passwordData.new_password.trim() || !passwordData.confirm_password.trim()) {
      toast.error(t('account.passwordRequired'));
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error(t('account.passwordMismatch'));
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error(t('account.passwordMinLength'));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) {
        console.error('Error updating password:', error);
        toast.error(t('account.passwordUpdateError'));
      } else {
        toast.success(t('account.passwordUpdated'));
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('account.passwordUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hesab Ayarları</h2>
        <p className="text-muted-foreground">Hesab məlumatlarınızı idarə edin</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil Məlumatları
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Təhlükəsizlik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Məlumatları
              </CardTitle>
              <CardDescription>
                Hesab məlumatlarınızı yeniləyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('account.fullName')}</Label>
                <Input
                  id="full_name"
                  placeholder="Ad Soyadınızı daxil edin"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email ünvanınız"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Balans</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`$${profile?.balance?.toFixed(2) || '0.00'}`}
                    disabled
                    className="bg-muted"
                  />
                  <Button variant="outline" size="sm">
                    Balans Artır
                  </Button>
                </div>
              </div>

              <Button onClick={updateProfile} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Yenilənir...' : 'Dəyişiklikləri Saxla'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Şifrə Dəyişdirin
              </CardTitle>
              <CardDescription>
                Hesabınızın təhlükəsizliyi üçün güclü şifrə seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">{t('account.newPassword')}</Label>
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Yeni şifrənizi daxil edin"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Şifrəni Təkrar Edin</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Şifrəni təkrar daxil edin"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                />
              </div>

              <Button onClick={updatePassword} disabled={loading} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {loading ? 'Yenilənir...' : 'Şifrəni Yenilə'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
