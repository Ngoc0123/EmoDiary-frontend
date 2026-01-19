"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { signUpApi } from "./signUpService";

export interface UseSignUpReturn {
  // Form state
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  error: string;
  isLoading: boolean;
  
  // Password validation
  passwordValidation: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    passwordsMatch: boolean;
  };
  
  // Translations
  t: ReturnType<typeof useLanguage>['t']['signUp'];
  tCommon: ReturnType<typeof useLanguage>['t']['common'];
  
  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
}

export function useSignUp(): UseSignUpReturn {
  const router = useRouter();
  const { setUser } = useAuth();
  const { t } = useLanguage();
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const passwordValidation = useMemo(() => ({
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
  }), [password, confirmPassword]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError(t.signUp.errorRequired);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.signUp.errorPasswordMismatch);
      return;
    }

    if (!passwordValidation.hasMinLength) {
      setError(t.signUp.errorMinLength);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await signUpApi({ username, email, password });
      
      // Update auth context with user data
      setUser(response.user);
      
      // Navigate to home
      router.push("/");
    } catch (err) {
      setError(t.signUp.errorFailed);
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password, confirmPassword, passwordValidation.hasMinLength, setUser, router, t.signUp]);

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isLoading,
    passwordValidation,
    t: t.signUp,
    tCommon: t.common,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  };
}
