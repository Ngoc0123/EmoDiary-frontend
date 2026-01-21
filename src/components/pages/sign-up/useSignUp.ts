"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { signUpApi } from "./signUpService";
import { ApiError } from "@/components/http_request";

export interface UseSignUpReturn {
  // Form state
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
  const { t } = useLanguage();
  
  // Form state
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
    if (!email || !password || !confirmPassword) {
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
      await signUpApi({ email, password });
      
      // Navigate to verify otp page with email param
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.data?.detail === "The user with this email already exists in the system.") {
          setError("This email is already registered. Please sign in instead.");
        } else if (err.data?.detail) {
           setError(err.data.detail);
        } else {
           setError(t.signUp.errorFailed);
        }
      } else {
        setError(t.signUp.errorFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, passwordValidation.hasMinLength, router, t.signUp]);

  return {
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
