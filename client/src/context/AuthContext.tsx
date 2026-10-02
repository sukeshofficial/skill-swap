import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '@/api/authApi';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  googleId?: string;
  age?: number;
  createdAt: string;   // ISO date string from MongoDB timestamps
  updatedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Re-fetch the session (useful after login / logout). */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | undefined>(undefined);

// ──────────────────────────────────────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.checkAuthStatus();
      if (data.isAuthenticated && data.user) {
        setUser(data.user as AuthUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      // 401 means not logged in — not a crash
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Run once on mount — this handles the post-Google-OAuth redirect to /dashboard
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        refresh: checkSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
