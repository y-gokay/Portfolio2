"use client";

import { motion } from "framer-motion";

export function SkipToContent() {
  return (
    <motion.a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      initial={{ opacity: 0, y: -20 }}
      whileFocus={{ opacity: 1, y: 0 }}
    >
      Ana İçeriğe Geç
    </motion.a>
  );
}
