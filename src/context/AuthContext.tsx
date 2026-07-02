import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/api/authApi";
import { STORAGE_KEYS } from "@/constants";
import type { LoginCredentials, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function isSessionValid(): boolean {
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiry) return false;
  return Date.now() < Number(expiry);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto-login: restore session on mount if a valid, unexpired token exists.
  useEffect(() => {
    if (isSessionValid()) {
      setUser(readStoredUser());
    } else {
      clearSession();
    }
    setIsInitializing(false);
  }, []);

  // Passive session-expiry watcher: logs the user out client-side the
  // moment their token expires, even without a failed request.
  useEffect(() => {
    if (!user) return;
    const expiry = Number(localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY) ?? 0);
    const msRemaining = expiry - Date.now();
    if (msRemaining <= 0) {
      clearSession();
      setUser(null);
      return;
    }
    const timeout = setTimeout(() => {
      clearSession();
      setUser(null);
    }, msRemaining);
    return () => clearTimeout(timeout);
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoggingIn(true);
    try {
      const { user: loggedInUser, tokens } = await authApi.login(credentials);
      localStorage.setItem(STORAGE_KEYS.TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, String(tokens.expiresAt));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      isLoggingIn,
      login,
      logout,
    }),
    [user, isInitializing, isLoggingIn, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
