"use client";

import { useLanguage } from "@/contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageToggleProps {
  isInHeader?: boolean;
}

export function LanguageToggle({ isInHeader = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  // Header içinde gösterim için
  if (isInHeader) {
    return (
      <button
        className="relative w-9 h-9 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        onClick={toggleLanguage}
        aria-label={`Switch to ${language === "tr" ? "English" : "Türkçe"}`}
        title={`Switch to ${language === "tr" ? "English" : "Türkçe"}`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            className="text-xs font-bold text-foreground uppercase tracking-wide"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {language === "tr" ? "EN" : "TR"}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }

  // Fixed position - Mobile için
  return (
    <motion.button
      className="fixed top-16 sm:top-20 right-14 sm:right-16 md:hidden z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all shadow-lg dark:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === "tr" ? "English" : "Türkçe"}`}
      title={`Switch to ${language === "tr" ? "English" : "Türkçe"}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-clickable
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide"
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {language === "tr" ? "EN" : "TR"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
