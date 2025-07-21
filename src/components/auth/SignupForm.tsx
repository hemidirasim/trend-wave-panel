import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationProvider';
import { Loader2 } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

interface SignupFormProps {
  onClose: () => void;
}

export const SignupForm = ({ onClose }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signUp } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password strength validation
    const passwordStrength = validatePasswordStrength(password);
    if (passwordStrength.score < 3) {
      addNotification({
        type: 'error',
        title: 'Zəif şifrə',
        message: 'Zəhmət olmasa daha güclü şifrə seçin (ən azı 3/5 bal)',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (!error) {
        onClose();
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (error) {
      // Error notification is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  }, [email, password, fullName, signUp, onClose, addNotification]);


  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Yeni Hesab</CardTitle>
        <CardDescription className="text-sm">
          Yeni hesab yaratmaq üçün məlumatlarınızı daxil edin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-sm">Ad Soyad</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Ad Soyad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm">Şifrə</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-9"
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator 
              password={password} 
              showRequirements={password.length > 0} 
            />
          </div>
          <Button type="submit" className="w-full h-9" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Qeydiyyatdan keç
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};