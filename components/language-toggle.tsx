"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  return (
    <motion.button
      className="fixed top-4 right-16 md:top-6 md:right-20 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all shadow-lg dark:shadow-primary/10 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-clickable
    >
      <motion.div
        key={language}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Languages className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
      </motion.div>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {language.toUpperCase()}
      </span>
    </motion.button>
  );
}
