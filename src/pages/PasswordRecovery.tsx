
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { supabase } from '@/integrations/supabase/client';

const PasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // URL-də recovery parametrlərini yoxla
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    console.log('Recovery səhifəsində URL parametrləri:', { accessToken, refreshToken, type });

    // Əgər recovery parametrləri varsa session-u təyin et
    if (accessToken && refreshToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ data, error }) => {
        if (error) {
          console.error('Session təyin edilmədi:', error);
          toast.error('Link etibarsızdır və ya müddəti bitib');
          navigate('/reset-password');
        } else {
          console.log('Recovery səhifəsində session təyin edildi:', data);
        }
      });
    } else {
      // Parametrlərin olmaması normal haldır, sadəcə log et
      console.log('Recovery parametrləri tapılmadı, manuel giriş gözlənilir');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Şifrələr uyğun gəlmir');
      return;
    }

    const passwordStrength = validatePasswordStrength(newPassword);
    if (passwordStrength.score < 3) {
      toast.error('Zəif şifrə: Zəhmət olmasa daha güclü şifrə seçin');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error('Şifrə yenilənmədi. Zəhmət olmasa yenidən cəhd edin.');
        throw error;
      }

      toast.success('Şifrəniz uğurla yeniləndi. İndi daxil ola bilərsiniz.');

      // Daxil olma səhifəsinə yönlət
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">HitLoyal</span>
          </div>
          <p className="text-muted-foreground">Yeni şifrə təyin edin</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şifrə Yeniləmə</CardTitle>
            <CardDescription>
              Yeni və güclü şifrə təyin edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni Şifrə</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {newPassword && (
                  <PasswordStrengthIndicator password={newPassword} />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifrəni Təsdiq Et</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500">Şifrələr uyğun gəlmir</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || newPassword !== confirmPassword}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Şifrəni Yenilə
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/auth')}
                  className="text-sm"
                >
                  Giriş səhifəsinə qayıt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordRecovery;
