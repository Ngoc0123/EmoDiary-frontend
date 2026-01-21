"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { signInApi } from "./signInService";
import { ApiError } from "@/components/http_request";

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
  const { refreshUser } = useAuth();
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
      // The API response type is technically void currently in our service, change if needed.
      // But assuming request.post returns whatever the body is.
      await signInApi({ email, password });
      
      // Update the user context after successful login
      await refreshUser();
      
      // If the API returns user data, we should use it. 
      // For now, we assume cookie is set. 
      // We might need to fetch user profile separately if login doesn't return it.
      // Or we can manually set user email context if needed.
      
      // Navigate to home
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          const detail = err.data?.detail;
          if (detail === "Incorrect email or password") {
            setError(t.signIn.errorFailed); // Or specific message
          } else if (detail === "User is not verified") {
            // Redirect to verify-otp
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            return;
          } else if (detail === "Inactive user") {
             setError("Your account is inactive. Please contact support.");
          } else if (detail) {
             setError(detail);
          } else {
             setError(t.signIn.errorFailed);
          }
        } else {
           setError(t.signIn.errorFailed);
        }
      } else {
        setError(t.signIn.errorFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router, t.signIn]);

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
