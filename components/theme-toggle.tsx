"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ThemeToggleProps {
  isInHeader?: boolean;
}

export function ThemeToggle({ isInHeader = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Header içinde gösterim için
  if (isInHeader) {
    return (
      <button
        className="relative w-9 h-9 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {mounted && (
          <motion.div
            initial={false}
            animate={{
              rotate: theme === "dark" ? 0 : 180,
            }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </motion.div>
        )}
      </button>
    )
  }

  // Fixed position - Mobile için
  if (!mounted) {
    return (
      <button
        className="fixed top-16 sm:top-20 right-4 sm:right-6 md:hidden z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary dark:bg-secondary border-0 dark:border-0 flex items-center justify-center shadow-md"
        aria-label="Toggle theme"
      >
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
      </button>
    )
  }

  return (
    <motion.button
      className="fixed top-16 sm:top-20 right-4 sm:right-6 md:hidden z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all shadow-lg dark:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-clickable
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 0 : 180,
        }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        ) : (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        )}
      </motion.div>
    </motion.button>
  )
}
