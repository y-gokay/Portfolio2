"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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
  // Always initialize with "tr" to avoid hydration mismatch
  // We'll update it from localStorage after mount on client-side
  const [language, setLanguageState] = useState<Language>("tr");
  const [mounted, setMounted] = useState(false);
  const [kvTranslations, setKvTranslations] = useState<SiteSettings["translations"] | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Read language from localStorage after mount (client-side only)
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language | null;
      if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
        setLanguageState(savedLanguage);
        document.documentElement.lang = savedLanguage;
      } else {
        document.documentElement.lang = "tr";
      }
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

  // Update HTML lang attribute when language changes (only after mount)
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // Merge KV translations with static translations to ensure all fields are present
  // This ensures that even if KV translations are incomplete, we have fallbacks
  const getMergedTranslations = (): typeof translations => {
    if (!kvTranslations) {
      return translations;
    }

    // Deep merge: use static translations as base, then merge KV translations on top
    // This ensures all new fields (like navigation) are always present from static translations
    // Only override fields that exist in KV translations and are not undefined
    const mergeTranslations = (staticTrans: typeof translations.tr, kvTrans?: typeof translations.tr) => {
      if (!kvTrans || Object.keys(kvTrans).length === 0) {
        return staticTrans;
      }

      // Merge: static first, then KV (but only if KV has the property)
      const merged = { ...staticTrans };
      
      // Only override properties that exist in KV and are not undefined/null
      Object.keys(kvTrans).forEach((key) => {
        const kvValue = (kvTrans as any)[key];
        if (kvValue !== undefined && kvValue !== null) {
          // For nested objects, merge recursively
          if (typeof kvValue === 'object' && !Array.isArray(kvValue) && typeof (staticTrans as any)[key] === 'object') {
            (merged as any)[key] = {
              ...((staticTrans as any)[key] || {}),
              ...kvValue,
            };
          } else {
            (merged as any)[key] = kvValue;
          }
        }
      });

      return merged;
    };

    const merged: typeof translations = {
      tr: mergeTranslations(translations.tr, kvTranslations.tr),
      en: mergeTranslations(translations.en, kvTranslations.en),
    };

    // Ensure navigation is always present (from static translations)
    if (!merged.tr.navigation) {
      merged.tr.navigation = translations.tr.navigation;
    }
    if (!merged.en.navigation) {
      merged.en.navigation = translations.en.navigation;
    }

    return merged;
  };

  // Use useMemo to avoid recalculating on every render
  const translationsToUse = useMemo(() => getMergedTranslations(), [kvTranslations]);

  // Always provide context, even before mount
  // Use useMemo to avoid recreating the value object on every render
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translationsToUse[language] || translations[language],
    }),
    [language, translationsToUse]
  );

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
