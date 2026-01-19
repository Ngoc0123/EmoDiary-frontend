"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { signInApi } from "./signInService";

export interface UseSignInReturn {
  // Form state
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  error: string;
  isLoading: boolean;
  
  // Translations
  t: ReturnType<typeof useLanguage>['t']['signIn'];
  tCommon: ReturnType<typeof useLanguage>['t']['common'];
  
  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePassword: () => void;
}

export function useSignIn(): UseSignInReturn {
  const router = useRouter();
  const { setUser } = useAuth();
  const { t } = useLanguage();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError(t.signIn.errorRequired);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await signInApi({ email, password });
      
      // Update auth context with user data
      setUser(response.user);
      
      // Navigate to home
      router.push("/");
    } catch (err) {
      setError(t.signIn.errorFailed);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, setUser, router, t.signIn.errorRequired, t.signIn.errorFailed]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    t: t.signIn,
    tCommon: t.common,
    handleSubmit,
    togglePassword,
  };
}
