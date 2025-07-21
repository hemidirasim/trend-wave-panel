
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        // Set flag to show login notification only once
        sessionStorage.setItem('just_logged_in', 'true');
      }

      if (event === 'SIGNED_OUT') {
        // Clear any auth-related session storage
        sessionStorage.removeItem('just_logged_in');
        // Force page reload to clear any cached data
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [addNotification]);

  const signIn = async (email: string, password: string) => {
    try {
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

      if (data.user) {
        addNotification({
          type: 'success',
          title: 'Uğurlu giriş',
          message: 'Hesabınıza uğurla daxil oldunuz',
        });
      }

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
        addNotification({
          type: 'error',
          title: 'Qeydiyyat xətası',
          message: error.message,
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
      
      // Clear any session storage first
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        addNotification({
          type: 'error',
          title: 'Çıxış xətası',
          message: 'Çıxış zamanı xəta baş verdi',
        });
        throw error;
      }

      console.log('Sign out successful');
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Uğurla çıxış',
        message: 'Hesabınızdan uğurla çıxış etdiniz',
      });

      // Force reload to clear all state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear local state and redirect
      setUser(null);
      setSession(null);
      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
