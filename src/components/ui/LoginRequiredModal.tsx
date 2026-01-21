"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-white/60 p-6 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white">
               <Lock className="h-6 w-6" />
             </div>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-slate-800">
            {t.nav.signIn}
          </h3>
          
          <p className="mb-6 text-sm text-slate-500">
            {t.common.loginRequired}
          </p>
          
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
            >
              {t.common.cancel}
            </button>
            <Link
              href="/sign-in"
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              {t.nav.signIn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
