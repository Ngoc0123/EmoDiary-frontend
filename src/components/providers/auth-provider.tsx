"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { fetchMeApi, logoutApi, User } from "@/components/providers/userService";

// Auth context state type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = "emodia-user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
            try {
                setUserState(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  // Wrapper for setUser to sync with localStorage
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (typeof window !== 'undefined') {
        if (newUser) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }
  }, []);

  const fetchUser = useCallback(async () => {
    // This is now explicitly for refreshing, not auto-check on every load
    try {
        const userData = await fetchMeApi();
        setUser(userData);
    } catch {
        // If fetch fails (e.g. 401), we might want to clear user?
        // Let handling of 401 be done by the unauthorized listener.
        // But if it's just a network error, maybe keep the stale user?
        // safest is to do nothing or let the global error handler catch 401.
        // If we want to be strict: 
        // setUser(null); 
    }
  }, [setUser]);

  // Removed auto-fetch useEffect to prevent bottleneck


  // Listen for unauthorized event to force logout
  useEffect(() => {
    const handleUnauthorized = () => {
        setUser(null);
        // Explicitly redirect to login
        window.location.href = '/sign-in';
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
     // This function is for context compatibility, but actual login logic is in useSignIn.
     // If used, it should align. However, useSignIn navigates directly.
     // We can offer a refreshUser method instead or keep this generic.
     // For now, let's make it refresh the user.
     await fetchUser();
  }, [fetchUser]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
     // Similar to login, logic is in components.
     await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
        await logoutApi();
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        setUser(null);
        // Optional: window.location.href = '/sign-in' or similar
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refreshUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
