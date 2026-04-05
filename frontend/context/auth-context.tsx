"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api/client";
import { login as loginApi } from "@/lib/api/auth";
import type { LoginRequest } from "@/lib/types";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  /** true after localStorage has been read on the client (avoids false redirects before sync). */
  authReady: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
    setAuthReady(true);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await loginApi(data);
    setAuthToken(res.accessToken);
    setToken(res.accessToken);
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        authReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
