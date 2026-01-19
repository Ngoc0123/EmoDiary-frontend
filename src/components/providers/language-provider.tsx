"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Language, Translations, translations } from "@/lib/translations";

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = "emodia-language";

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'vi' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, []);

  // Toggle between Vietnamese and English
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  }, [language, setLanguage]);

  // Get translations for current language
  const t = translations[language];

  // Prevent flash of wrong language
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Hook to get just the translations (shorthand)
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}
