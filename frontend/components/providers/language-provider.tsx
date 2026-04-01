"use client";

import {
  getTranslation,
  LANGUAGE_STORAGE_KEY,
  Language,
  TranslationKey,
  TranslationSection,
} from "@/lib/i18n/translations";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: <S extends TranslationSection>(
    section: S,
    key: TranslationKey<S>,
  ) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
};

const coerceLanguage = (value: string | null | undefined): Language => {
  return value === "hi" ? "hi" : "en";
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const localLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return coerceLanguage(localLanguage);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((previous) => (previous === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback(
    <S extends TranslationSection>(
      section: S,
      key: TranslationKey<S>,
    ): string => {
      return getTranslation(language, section, key);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, t, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
