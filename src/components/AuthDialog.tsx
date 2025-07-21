
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/components/NotificationProvider';
import { Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();
  const { addNotification } = useNotification();
  const isMobile = useIsMobile();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (!error) {
        onOpenChange(false);
        // Clear form fields
        setLoginEmail('');
        setLoginPassword('');
      }
    } catch (error) {
      // Error notification is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifrə gücünü yoxla
    const passwordStrength = validatePasswordStrength(signupPassword);
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
      const { error } = await signUp(signupEmail, signupPassword, signupFullName);
      if (!error) {
        onOpenChange(false);
        // Clear form fields
        setSignupEmail('');
        setSignupPassword('');
        setSignupFullName('');
      }
    } catch (error) {
      // Error notification is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const AuthContent = () => (
    <div className="w-full">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Zap className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold">hitloyal</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Giriş</TabsTrigger>
          <TabsTrigger value="signup">Qeydiyyat</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Hesaba Giriş</CardTitle>
              <CardDescription className="text-sm">
                Email və şifrənizi daxil edərək hesabınıza daxil olun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm">Şifrə</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="text-right">
                  <Link
                    to="/reset-password"
                    className="text-sm text-primary hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Şifrəmi unutdum
                  </Link>
                </div>
                <Button type="submit" className="w-full h-9" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Daxil ol
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Yeni Hesab</CardTitle>
              <CardDescription className="text-sm">
                Yeni hesab yaratmaq üçün məlumatlarınızı daxil edin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm">Ad Soyad</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Ad Soyad"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Şifrə</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="h-9"
                  />
                  {signupPassword && (
                    <PasswordStrengthIndicator password={signupPassword} />
                  )}
                </div>
                <Button type="submit" className="w-full h-9" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Qeydiyyatdan keç
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="h-[95vh] overflow-y-auto p-6"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Giriş və Qeydiyyat</SheetTitle>
          </SheetHeader>
          <AuthContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto z-[60] p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Giriş və Qeydiyyat</DialogTitle>
        </DialogHeader>
        <AuthContent />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
