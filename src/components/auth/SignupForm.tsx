import { useState, useCallback, useMemo, useEffect } from 'react';
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
    const trimmedEmail = emailToCheck?.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setEmailStatus('idle');
      return;
    }

    setCheckingEmail(true);
    setEmailStatus('checking');

    try {
      console.log('Starting email check for:', trimmedEmail);
      
      // Check profiles table for existing email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', trimmedEmail);

      console.log('Profile query result:', { 
        profileData, 
        profileError,
        dataLength: profileData?.length
      });

      // Check auth.users table by attempting to sign up with the email (this will fail if email exists)
      // We'll try a different approach - check if signup would fail
      let emailExistsInAuth = false;
      
      try {
        // Try to sign up with a dummy password to check if email exists
        // This will return an error if email already exists
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: 'dummy_password_for_check_only',
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });
        
        console.log('SignUp test result:', signUpError);
        
        // If error contains "already been registered" or similar, email exists
        if (signUpError && (
          signUpError.message.includes('already been registered') ||
          signUpError.message.includes('already exists') ||
          signUpError.message.includes('User already registered')
        )) {
          emailExistsInAuth = true;
          console.log('Email exists in auth.users:', trimmedEmail);
        }
      } catch (authError) {
        console.log('Auth check error (might be normal):', authError);
      }

      // Handle profile query errors
      if (profileError) {
        console.error('Profile email check error:', profileError);
        setEmailStatus('idle');
        return;
      }

      // Check if email exists in either profiles table or auth.users
      const emailExistsInProfiles = profileData && Array.isArray(profileData) && profileData.length > 0;
      const emailExists = emailExistsInProfiles || emailExistsInAuth;
      
      console.log('Final email check result:', {
        emailExists,
        emailExistsInProfiles,
        emailExistsInAuth,
        profileDataLength: profileData?.length
      });

      if (emailExists) {
        console.log('Email is taken:', trimmedEmail);
        setEmailStatus('taken');
      } else {
        console.log('Email is available:', trimmedEmail);
        setEmailStatus('available');
      }
      
    } catch (error) {
      console.error('Email check failed with exception:', error);
      setEmailStatus('idle');
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Debounced email validation using useEffect
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailStatus('idle');
      return;
    }

    setEmailStatus('idle'); // Reset while waiting
    
    const timeoutId = setTimeout(() => {
      checkEmailExists(email);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [email, checkEmailExists]);

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
                onChange={(e) => setEmail(e.target.value)}
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
