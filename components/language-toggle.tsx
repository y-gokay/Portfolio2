"use client";

import { useLanguage } from "@/contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  return (
    <motion.button
      className="fixed top-4 right-16 md:top-6 md:right-20 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all shadow-lg dark:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-clickable
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          className="text-base md:text-lg font-bold text-foreground"
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {language === "tr" ? "🇹🇷" : "🇪🇳"}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
