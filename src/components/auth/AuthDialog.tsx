import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const isMobile = useIsMobile();

  // Reset to login tab when dialog closes
  useEffect(() => {
    if (!open) {
      setActiveTab('login');
    }
  }, [open]);

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
          <TabsTrigger value="signup">Kayıt</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <LoginForm onClose={() => onOpenChange(false)} />
        </TabsContent>

        <TabsContent value="signup" className="mt-4">
          <SignupForm onClose={() => onOpenChange(false)} />
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
            <SheetTitle>Giriş ve Kayıt</SheetTitle>
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
          <DialogTitle>Giriş ve Kayıt</DialogTitle>
        </DialogHeader>
        <AuthContent />
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;