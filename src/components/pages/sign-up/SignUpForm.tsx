"use client";

import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "./useSignUp";

// Password strength check component
function PasswordCheck({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-emerald-600' : 'text-slate-400'}`}>
      <div className={`h-4 w-4 rounded-full flex items-center justify-center transition-colors ${valid ? 'bg-emerald-500' : 'bg-slate-200'}`}>
        {valid && <Check className="h-2.5 w-2.5 text-white" />}
      </div>
      {text}
    </div>
  );
}

export function SignUpForm() {
  const {
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
    t,
    tCommon,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  } = useSignUp();

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-300/40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-amber-100/30 to-orange-200/30 blur-3xl" />
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
            <p className="text-slate-500 text-sm">
              {t.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                {t.username}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white/60 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white/60 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/60 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicators */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <PasswordCheck valid={passwordValidation.hasMinLength} text={t.minLength} />
                  <PasswordCheck valid={passwordValidation.hasUppercase} text={t.hasUppercase} />
                  <PasswordCheck valid={passwordValidation.hasNumber} text={t.hasNumber} />
                  <PasswordCheck valid={passwordValidation.passwordsMatch} text={t.passwordsMatch} />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/60 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
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

            {/* Terms */}
            <p className="text-xs text-center text-slate-500">
              {t.terms}{" "}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                {t.termsLink}
              </Link>{" "}
              {t.and}{" "}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                {t.privacyLink}
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 px-4 text-sm text-slate-500">{tCommon.or}</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-slate-600">
            {t.hasAccount}{" "}
            <Link
              href="/sign-in"
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              {t.signInLink}
            </Link>
          </p>
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
