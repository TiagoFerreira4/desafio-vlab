import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as authApi from "./auth-api";
import type { LoginInput, RegisterInput, User } from "./types";

const TOKEN_STORAGE_KEY = "coursesphere.token";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    storeToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authApi.getProfile(token);

        if (isMounted) {
          setUser(profile.user);
        }
      } catch {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [logout, token]);

  const handleLogin = useCallback(
    async (input: LoginInput) => {
      const response = await authApi.login(input);
      persistSession(response.token, response.user);
    },
    [persistSession],
  );

  const handleRegister = useCallback(
    async (input: RegisterInput) => {
      const response = await authApi.register(input);
      persistSession(response.token, response.user);
    },
    [persistSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login: handleLogin,
      register: handleRegister,
      logout,
    }),
    [handleLogin, handleRegister, isLoading, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
