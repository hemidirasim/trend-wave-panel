
import React, { createContext, useContext, useEffect, useState } from 'react';
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth state cleanup utility
const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear localStorage auth keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear specific auth tokens
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('supabase.auth.refresh_token');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up...');
        cleanupAuthState();
      }
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        addNotification({
          type: 'error',
          title: 'Giriş xətası',
          message: error.message,
        });
        return { error };
      }

      // No success notification - user will see they're logged in

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      addNotification({
        type: 'error',
        title: 'Xəta',
        message: 'Giriş zamanı xəta baş verdi',
      });
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
          data: fullName ? { full_name: fullName } : undefined,
        },
      });

      if (error) {
        let errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered') ||
            error.message.includes('already exists')) {
          errorMessage = 'Bu email ünvanı artıq qeydiyyatdan keçmişdir. Giriş etməyi yoxlayın.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email ünvanı düzgün deyil';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Şifrə çox zəifdir';
        }
        
        addNotification({
          type: 'error',
          title: 'Qeydiyyat xətası',
          message: errorMessage,
        });
        return { error };
      }

      if (data.user) {
        addNotification({
          type: 'success',
          title: 'Qeydiyyat uğurludur',
          message: 'Hesabınız uğurla yaradıldı',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      addNotification({
        type: 'error',
        title: 'Xəta',
        message: 'Qeydiyyat zamanı xəta baş verdi',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Error signing out:', error);
        addNotification({
          type: 'error',
          title: 'Çıxış xətası',
          message: 'Çıxış zamanı xəta baş verdi',
        });
      }
      
      // Force page refresh to ensure clean state
      window.location.href = '/';
      
    } catch (error) {
      console.error('Sign out error:', error);
      addNotification({
        type: 'error',
        title: 'Xəta',
        message: 'Çıxış zamanı xəta baş verdi',
      });
      // Force refresh even on error
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
