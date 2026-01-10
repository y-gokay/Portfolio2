"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";
import { SiteSettings } from "@/lib/site-settings";
import { defaultSiteSettings } from "@/lib/default-site-settings";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.tr;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with saved language from localStorage or default to Turkish
  const getInitialLanguage = (): Language => {
    if (typeof window === "undefined") return "tr";
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      return savedLanguage;
    }
    return "tr";
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [mounted, setMounted] = useState(false);
  const [kvTranslations, setKvTranslations] = useState<SiteSettings["translations"] | null>(null);

  useEffect(() => {
    setMounted(true);
    // Set initial HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }

    // Fetch translations from KV
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data?.translations) {
          setKvTranslations(result.data.translations);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch translations from KV:", error);
      });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      // Update HTML lang attribute immediately
      document.documentElement.lang = lang;
    }
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // Use translations from KV if available, otherwise fallback to static
  const translationsToUse = kvTranslations || translations;

  // Always provide context, even before mount
  const value = {
    language,
    setLanguage,
    t: translationsToUse[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
