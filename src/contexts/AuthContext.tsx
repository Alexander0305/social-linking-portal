
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  signInWithGoogle, 
  signInWithFacebook,
  resetPassword,
  updatePassword
} from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { createNotification, updateUserProfile } from '@/services/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signInWithFacebook: () => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (password: string) => Promise<{ data: any; error: any }>;
  updateProfile: (updates: Record<string, any>) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // If this is a new sign-up, create a profile entry
          if (event === 'SIGNED_IN') {
            // Could check and create profile if needed
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    checkUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    
    if (result.error) {
      toast({
        title: "Authentication error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    
    return result;
  };

  const handleSignUp = async (email: string, password: string, userData: Record<string, any>) => {
    setLoading(true);
    const result = await signUp(email, password, userData);
    setLoading(false);
    
    if (result.error) {
      toast({
        title: "Registration error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    }
    
    return result;
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await signOut();
    setLoading(false);
    
    if (result.error) {
      toast({
        title: "Sign out error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
    
    return result;
  };

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    
    if (result.error) {
      toast({
        title: "Authentication error",
        description: result.error.message,
        variant: "destructive",
      });
    }
    
    return result;
  };

  const handleSignInWithFacebook = async () => {
    const result = await signInWithFacebook();
    
    if (result.error) {
      toast({
        title: "Authentication error",
        description: result.error.message,
        variant: "destructive",
      });
    }
    
    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);
    
    if (result.error) {
      toast({
        title: "Password reset error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
    }
    
    return result;
  };

  const handleUpdatePassword = async (password: string) => {
    const result = await updatePassword(password);
    
    if (result.error) {
      toast({
        title: "Password update error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    }
    
    return result;
  };

  const handleUpdateProfile = async (updates: Record<string, any>) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const result = await updateUserProfile(user.id, updates);
    
    if (result.error) {
      toast({
        title: "Profile update error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
    
    return result;
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithFacebook: handleSignInWithFacebook,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
