
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationProvider';
import { Loader2, Zap, ArrowLeft } from 'lucide-react';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // URL-də access_token varsa, şifrə yeniləmə addımına keç
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setStep('password');
    }
  }, [searchParams]);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Xəta',
          message: 'Email göndərilmədi. Zəhmət olmasa yenidən cəhd edin.',
        });
        throw error;
      }

      addNotification({
        type: 'success',
        title: 'Email göndərildi',
        message: 'Şifrə yeniləmə linki email ünvanınıza göndərildi',
        duration: 7000,
      });
    } catch (error) {
      console.error('Reset email error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Xəta',
        message: 'Şifrələr uyğun gəlmir',
      });
      return;
    }

    const passwordStrength = validatePasswordStrength(newPassword);
    if (passwordStrength.score < 3) {
      addNotification({
        type: 'error',
        title: 'Zəif şifrə',
        message: 'Zəhmət olmasa daha güclü şifrə seçin',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Xəta',
          message: 'Şifrə yenilənmədi. Zəhmət olmasa yenidən cəhd edin.',
        });
        throw error;
      }

      addNotification({
        type: 'success',
        title: 'Şifrə yeniləndi',
        message: 'Şifrəniz uğurla yeniləndi',
      });

      // Yeni şifrə ilə daxil ol
      setTimeout(() => {
        navigate('/dashboard');
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
            <span className="text-2xl font-bold">SocialBoost</span>
          </div>
          <p className="text-muted-foreground">
            {step === 'email' ? 'Şifrənizi unutmusunuz?' : 'Yeni şifrə təyin edin'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              {step === 'password' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('email')}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <CardTitle>
                  {step === 'email' ? 'Şifrə Yeniləmə' : 'Yeni Şifrə'}
                </CardTitle>
                <CardDescription>
                  {step === 'email'
                    ? 'Email ünvanınızı daxil edin və sizə şifrə yeniləmə linki göndərəcəyik'
                    : 'Yeni və güclü şifrə təyin edin'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Şifrə yeniləmə linki göndər
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
            ) : (
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
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
