import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationProvider';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onClose: () => void;
}

export const SignupForm = ({ onClose }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const { signUp } = useAuth();
  const { addNotification } = useNotification();

  // Check if email exists in database
  const checkEmailExists = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      setEmailStatus('idle');
      return;
    }

    setCheckingEmail(true);
    setEmailStatus('checking');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', emailToCheck.toLowerCase())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Email check error:', error);
        setEmailStatus('idle');
        return;
      }

      setEmailStatus(data ? 'taken' : 'available');
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailStatus('idle');
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Debounced email validation
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    
    // Clear previous timeout and create new one
    const timeoutId = setTimeout(() => {
      checkEmailExists(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [checkEmailExists]);

  // Form validation
  const formValidation = useMemo(() => {
    const passwordStrength = validatePasswordStrength(password);
    const isEmailValid = email.length > 0 && email.includes('@') && emailStatus === 'available';
    const isPasswordValid = passwordStrength.score >= 3;
    const isNameValid = fullName.trim().length >= 2;
    
    return {
      isValid: isEmailValid && isPasswordValid && isNameValid && !checkingEmail,
      emailValid: isEmailValid,
      passwordValid: isPasswordValid,
      nameValid: isNameValid
    };
  }, [email, emailStatus, password, fullName, checkingEmail]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValidation.isValid) {
      addNotification({
        type: 'error',
        title: 'Form xətası',
        message: 'Zəhmət olmasa bütün tələbləri doldurun',
      });
      return;
    }
    
    // Additional password strength validation
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
  }, [email, password, fullName, signUp, onClose, addNotification, formValidation.isValid]);


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
            <div className="relative">
              <Input
                id="signup-email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                className="h-9 pr-10"
                autoComplete="email"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {checkingEmail && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {emailStatus === 'available' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {emailStatus === 'taken' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            {emailStatus === 'taken' && (
              <p className="text-sm text-red-500">Bu email ünvanı artıq mövcuddur</p>
            )}
            {emailStatus === 'available' && (
              <p className="text-sm text-green-600">Email ünvanı əlçatandır</p>
            )}
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
          <Button 
            type="submit" 
            className="w-full h-9" 
            disabled={isLoading || !formValidation.isValid}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Qeydiyyatdan keç
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};