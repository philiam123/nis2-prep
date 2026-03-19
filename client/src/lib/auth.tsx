import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { apiRequest } from "@/lib/queryClient";

type User = {
  id: number;
  email: string;
  name: string;
  hasPaid: boolean;
  isAdmin: boolean;
  stripeCustomerId: string | null;
  createdAt: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, companyCode?: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        flushSync(() => setUser(data));
      } else {
        flushSync(() => setUser(null));
      }
    } catch {
      flushSync(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await res.json();
    flushSync(() => setUser(data));
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, companyCode?: string) => {
    const body: any = { email, password, name };
    if (companyCode) body.companyCode = companyCode;
    const res = await apiRequest("POST", "/api/auth/register", body);
    const data = await res.json();
    flushSync(() => setUser(data));
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("POST", "/api/auth/logout");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
