
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/components/NotificationProvider';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Add notifications for auth events
        if (event === 'SIGNED_IN' && session?.user) {
          addNotification({
            type: 'success',
            title: 'Uğurla daxil oldunuz!',
            message: `Xoş gəlmisiniz, ${session.user.email}`,
          });
        } else if (event === 'SIGNED_OUT') {
          addNotification({
            type: 'info',
            title: 'Hesabdan çıxdınız',
            message: 'Təhlükəsiz şəkildə çıxış edildi',
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [addNotification]);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth state before sign in
      await supabase.auth.signOut({ scope: 'global' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        addNotification({
          type: 'error',
          title: 'Giriş xətası',
          message: error.message.includes('Invalid login credentials') 
            ? 'Email və ya şifrə yanlışdır' 
            : 'Giriş zamanı xəta baş verdi',
        });
        throw error;
      }
      
      if (data.user) {
        // Check if user is admin and redirect accordingly
        setTimeout(async () => {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', data.user.id)
              .eq('role', 'admin')
              .single();
            
            if (roleData) {
              window.location.href = '/admin';
            } else {
              window.location.href = '/dashboard';
            }
          } catch (error) {
            // If role check fails, redirect to dashboard
            window.location.href = '/dashboard';
          }
        }, 1000); // Wait for notification to show
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
          }
        }
      });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Qeydiyyat xətası',
          message: error.message.includes('User already registered')
            ? 'Bu email artıq qeydiyyatdan keçib'
            : 'Qeydiyyat zamanı xəta baş verdi',
        });
        throw error;
      }

      if (data.user) {
        addNotification({
          type: 'success',
          title: 'Qeydiyyat uğurla tamamlandı!',
          message: 'Email təsdiqləməsi üçün poçtunuzu yoxlayın',
          duration: 7000,
        });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up localStorage first
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 1000); // Wait for notification to show
    } catch (error) {
      console.error('Sign out error:', error);
      addNotification({
        type: 'error',
        title: 'Çıxış xətası',
        message: 'Çıxış zamanı xəta baş verdi',
      });
      // Force page reload even if sign out fails
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
