import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onClose: () => void;
}

export const LoginForm = ({ onClose }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  // Form validation - both fields must be filled
  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (!error) {
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // Error notification is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Hesaba Giriş</CardTitle>
        <CardDescription className="text-sm">
          E-posta ve şifrenizi girerek hesabınıza giriş yapın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-sm">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-sm">Şifre</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9"
              autoComplete="current-password"
            />
          </div>
          <div className="text-right">
            <Link
              to="/reset-password"
              className="text-sm text-primary hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>
          <Button 
            type="submit" 
            className="w-full h-9" 
            disabled={isLoading || !isFormValid}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Giriş Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};