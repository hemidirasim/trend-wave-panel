
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-recovery`,
      });

      if (error) {
        toast.error('Email göndərilmədi. Zəhmət olmasa yenidən cəhd edin.');
        throw error;
      }

      toast.success('Şifrə yeniləmə linki email ünvanınıza göndərildi');
    } catch (error) {
      console.error('Reset email error:', error);
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
          <p className="text-muted-foreground">Şifrənizi unutmusunuz?</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şifrə Yeniləmə</CardTitle>
            <CardDescription>
              Email ünvanınızı daxil edin və sizə şifrə yeniləmə linki göndərəcəyik
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
