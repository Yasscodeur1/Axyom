"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  isAuthenticated, 
  getUserData,
  getAuthToken,
  logout as logoutUser,
  type UserData 
} from "@/lib/api/auth";

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = () => {
    if (isAuthenticated()) {
      const userData = getUserData();
      const userToken = getAuthToken();
      setUser(userData);
      setToken(userToken);
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  };

  const refreshUser = () => {
    loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
