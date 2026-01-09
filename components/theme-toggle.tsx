"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary dark:bg-secondary border-0 dark:border-0 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <Sun className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
      </button>
    )
  }

  return (
    <motion.button
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary dark:bg-surface border border-border dark:border-primary/20 flex items-center justify-center hover:bg-accent dark:hover:bg-primary/20 transition-all shadow-lg dark:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
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
          <Sun className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        ) : (
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        )}
      </motion.div>
    </motion.button>
  )
}
