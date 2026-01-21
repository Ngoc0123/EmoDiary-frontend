"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtp } from "./useVerifyOtp";

export function VerifyOtpForm() {
  const {
    otp,
    setOtp,
    email,
    error,
    isLoading,
    isResending,
    timeLeft,
    canResend,
    t,
    tCommon,
    handleSubmit,
    handleResend,
  } = useVerifyOtp();

  if (!email) {
    // Basic fallback if accessed without email
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8">
          <h1 className="text-xl font-bold mb-4">Invalid Access</h1>
          <p className="mb-4">No email provided for verification.</p>
          <Link href="/sign-up" className="text-emerald-600 hover:underline">
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-300/40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 blur-3xl" />
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 border border-white/60 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 mb-4">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {t.title}
            </h1>
            <p className="text-slate-500 text-sm px-4">
              {t.subtitle}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <CheckCircle2 className="h-3 w-3" />
              {t.emailSentTo} {email}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Field */}
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                {t.code}
              </label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder={t.codePlaceholder}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                className="text-center text-lg tracking-widest h-14 rounded-xl bg-white/60 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t.submit}
                  <ArrowRight className="h-5 w-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Resend Section */}
          <div className="mt-8 text-center">
            <div className="text-sm text-slate-500">
              {canResend ? (
                <p>{t.resendReady}</p>
              ) : (
                <p>
                  {t.resendIn} <span className="font-medium text-slate-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </p>
              )}
            </div>
            
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
                ${canResend 
                  ? 'text-emerald-600 hover:text-emerald-700' 
                  : 'text-slate-400 cursor-not-allowed'
                }`}
            >
              {isResending ? (
                <div className="h-3 w-3 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <RotateCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
              )}
              {t.resend}
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            {tCommon.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
