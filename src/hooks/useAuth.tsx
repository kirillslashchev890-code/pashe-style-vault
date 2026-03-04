import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const ADMIN_EMAIL = "admin1@gmail.com";
const ADMIN_PASSWORD = "admin1234";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAlreadyRegisteredError = (message: string) =>
    /(already registered|already exists|user already|email.*exists|already been registered)/i.test(message);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      if (isAlreadyRegisteredError(error.message)) {
        return { error: "Аккаунт с этой почтой уже создан. Войдите в существующий аккаунт." };
      }
      return { error: error.message };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    let { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error && email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD && /invalid login credentials/i.test(error.message)) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: { data: { full_name: "Администратор" } },
      });

      if (signUpError && !isAlreadyRegisteredError(signUpError.message)) {
        return { error: signUpError.message };
      }

      const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
      error = retryError ?? null;
    }

    if (error) {
      if (/invalid login credentials/i.test(error.message)) {
        return { error: "Неверный email или пароль" };
      }
      if (/email not confirmed/i.test(error.message)) {
        return { error: "Подтвердите email перед входом. Проверьте почту." };
      }
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
