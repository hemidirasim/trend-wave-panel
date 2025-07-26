import { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { supabase } from '@/integrations/supabase/client';
interface SignupFormProps {
  onClose: () => void;
}
export const SignupForm = ({
  onClose
}: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState('');
  const [emailCheckError, setEmailCheckError] = useState('');
  const {
    signUp
  } = useAuth();
  const {
    addNotification
  } = useNotification();
  const { t } = useLanguage();

  // Email existence check function
  const checkEmailExists = useCallback(async (emailToCheck: string) => {
    const trimmedEmail = emailToCheck?.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setEmailStatus('idle');
      return false;
    }
    try {
      // Use the database function to check email existence with correct parameter name
      const {
        data,
        error
      } = await supabase.rpc('check_email_exists', {
        email_param: trimmedEmail
      });
      if (error) {
        console.error('Email check error:', error);
        setEmailCheckError(t('auth.emailCheckError'));
        return false;
      }

      // Data returns true if email exists
      return data;
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailCheckError(t('auth.emailCheckError'));
      return false;
    }
  }, [addNotification]);

  // Debounced email validation
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailStatus('idle');
      setEmailExistsError('');
      setEmailCheckError('');
      return;
    }
    const timeoutId = setTimeout(async () => {
      setCheckingEmail(true);
      setEmailStatus('checking');
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailStatus('taken');
        setEmailExistsError(t('auth.emailTaken'));
      } else {
        setEmailStatus('available');
        setEmailExistsError('');
      }
      setCheckingEmail(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [email, checkEmailExists]);

  // Form validation
  const formValidation = useMemo(() => {
    const passwordStrength = validatePasswordStrength(password);
    const isEmailValid = email.length > 0 && email.includes('@');
    const isPasswordValid = passwordStrength.score >= 3;
    const isNameValid = fullName.trim().length >= 3;
    return {
      isValid: isEmailValid && isPasswordValid && isNameValid && !checkingEmail && emailStatus !== 'taken',
      emailValid: isEmailValid,
      passwordValid: isPasswordValid,
      nameValid: isNameValid
    };
  }, [email, password, fullName, checkingEmail, emailStatus]);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailExistsError('');
    if (!formValidation.isValid) {
      addNotification({
        type: 'error',
        title: t('auth.formError'),
        message: t('auth.formErrorMessage')
      });
      return;
    }
    setIsLoading(true);
    try {
      // Final check for email existence before signup
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setEmailExistsError(t('auth.emailTaken'));
        addNotification({
          type: 'error',
          title: t('auth.signupError'),
          message: t('auth.emailTaken')
        });
        setIsLoading(false);
        return;
      }

      // Additional password strength validation
      const passwordStrength = validatePasswordStrength(password);
      if (passwordStrength.score < 3) {
        addNotification({
          type: 'error',
          title: t('auth.weakPassword'),
          message: t('auth.weakPasswordMessage')
        });
        setIsLoading(false);
        return;
      }
      const {
        error
      } = await signUp(email, password, fullName);
      if (error) {
        if (error.message?.includes('already') || error.message?.includes('exists')) {
        setEmailExistsError(t('auth.emailTaken'));
          addNotification({
            type: 'error',
            title: t('auth.signupError'),
            message: t('auth.emailTaken')
          });
        } else {
          addNotification({
            type: 'error',
            title: t('auth.signupError'),
            message: error.message || t('auth.signupGeneralError')
          });
        }
      } else {
        // Only reset form and close dialog on successful signup
        setEmail('');
        setPassword('');
        setFullName('');
        setEmailExistsError('');
        setEmailStatus('idle');
        onClose();
      }
    } catch (error) {
      console.error('Signup error:', error);
      addNotification({
        type: 'error',
        title: t('auth.generalError'),
        message: t('auth.signupGeneralError')
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, fullName, signUp, onClose, addNotification, formValidation.isValid, checkEmailExists]);
  return <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t('auth.signupTitle')}</CardTitle>
        <CardDescription className="text-sm">
          {t('aut.signupDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-sm">{t('auth.fullName')}</Label>
            <Input id="signup-name" type="text" placeholder={t('auth.fullNamePlaceholder')} value={fullName} onChange={e => setFullName(e.target.value)} className="h-9" autoComplete="name" />
            {fullName.length > 0 && fullName.trim().length < 3 && <p className="text-sm text-red-500">{t('auth.nameRequirement')}</p>}
            {fullName.trim().length >= 3 && <p className="text-sm text-green-600">{t('auth.nameValid')}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm">{t('auth.email')}</Label>
            <div className="relative">
              <Input id="signup-email" type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="h-9 pr-10" autoComplete="email" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {checkingEmail && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {emailStatus === 'available' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {emailStatus === 'taken' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            {emailStatus === 'available' && <p className="text-sm text-green-600">{t('auth.emailAvailable')}</p>}
            {(emailStatus === 'taken' || emailExistsError) && <p className="text-sm text-red-500">{t('auth.emailTaken')}</p>}
            {emailCheckError && <p className="text-sm text-red-500">{emailCheckError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm">{t('auth.password')}</Label>
            <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-9" autoComplete="new-password" />
            <PasswordStrengthIndicator password={password} showRequirements={password.length > 0} />
          </div>
          
          <Button type="submit" className="w-full h-9" disabled={isLoading || !formValidation.isValid}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth.signupButton')}
          </Button>
        </form>
      </CardContent>
    </Card>;
};