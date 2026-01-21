"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { verifyOtpApi, resendOtpApi } from "./verifyOtpService";
import { ApiError } from "@/components/http_request";
import { toast } from "sonner";

export interface UseVerifyOtpReturn {
  otp: string;
  setOtp: (otp: string) => void;
  email: string | null;
  error: string;
  isLoading: boolean;
  isResending: boolean;
  timeLeft: number;
  canResend: boolean;
  t: ReturnType<typeof useLanguage>['t']['verifyOtp'];
  tCommon: ReturnType<typeof useLanguage>['t']['common'];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleResend: () => Promise<void>;
}

const RESEND_COOLDOWN = 60; // seconds

export function useVerifyOtp(): UseVerifyOtpReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESEND_COOLDOWN);

  // Timer logic for resend cooldown
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const canResend = timeLeft === 0;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is missing. Please restart the sign-up process."); // Fallback
      return;
    }

    if (!otp || otp.length < 6) {
      setError(t.verifyOtp.errorRequired);
      return;
    }

    setIsLoading(true);
    
    try {
      await verifyOtpApi({ email, code: otp });
      
      toast.success("Verification successful! Please sign in.");
      router.push("/sign-in");
    } catch (err) {
      if (err instanceof ApiError && err.data?.detail) {
         setError(err.data.detail);
      } else {
        setError(t.verifyOtp.errorFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, otp, router, t.verifyOtp]);

  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;
    
    setIsResending(true);
    setError("");

    try {
      await resendOtpApi(email);
      setTimeLeft(RESEND_COOLDOWN);
      toast.success(t.verifyOtp.resendSuccess);
    } catch {
       toast.error(t.verifyOtp.resendFailed);
    } finally {
      setIsResending(false);
    }
  }, [canResend, email, t.verifyOtp]);

  return {
    otp,
    setOtp,
    email,
    error,
    isLoading,
    isResending,
    timeLeft,
    canResend,
    t: t.verifyOtp,
    tCommon: t.common,
    handleSubmit,
    handleResend,
  };
}
