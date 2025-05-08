import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // Supabase client
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔄 Restore user session on load
  useEffect(() => {
    const session = supabase.auth.session();
    if (session?.user) {
      setUser(session.user);
      setUserId(session.user.id);
      setIsLoggedIn(true);
    }

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setUserId(session.user.id);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setUserId(null);
          setIsLoggedIn(false);
        }

      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  // 🔐 Login
  const login = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    setUser(user);
    setUserId(user?.id || null);
    setIsLoggedIn(true);

  };

  // 🧑‍🎓 Signup
  const signup = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(user);
    setUserId(user?.id || null);
    setIsLoggedIn(true);

  };

  // 🔐 Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsLoggedIn(false);
  };

  // 🔁 Reset password (via magic link)
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
      redirectTo: "https://your-app-url.com/reset-password", // update to your app URL
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ user, userId, isLoggedIn, login, signup, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔍 Hook to access context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
