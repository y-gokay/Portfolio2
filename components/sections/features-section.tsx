"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

function TypeTester() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.5 : 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <motion.span
        className="font-serif text-6xl md:text-8xl text-foreground"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Aa
      </motion.span>
    </div>
  )
}

function LayoutAnimation() {
  const [layout, setLayout] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const layouts = ["grid-cols-2 grid-rows-2", "grid-cols-3 grid-rows-1", "grid-cols-1 grid-rows-3"]

  return (
    <div className="h-full p-4 flex items-center justify-center">
      <motion.div className={`grid ${layouts[layout]} gap-2 w-full max-w-[140px]`} layout>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-primary/20 dark:bg-primary/40 rounded-md min-h-[30px] shadow-sm dark:shadow-md dark:shadow-primary/20"
            layout
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function SpeedIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex gap-2">
        <div className="w-12 h-12 rounded-full bg-primary/20 dark:bg-primary/30 shadow-sm dark:shadow-md dark:shadow-primary/10" />
        <div className="w-12 h-12 rounded-full bg-primary/40 dark:bg-primary/50 shadow-sm dark:shadow-md dark:shadow-primary/15" />
        <div className="w-12 h-12 rounded-full bg-primary/60 dark:bg-primary/70 shadow-sm dark:shadow-md dark:shadow-primary/20" />
        <div className="w-12 h-12 rounded-full bg-primary dark:bg-primary shadow-md dark:shadow-lg dark:shadow-primary/30" />
      </div>
      <span className="text-sm text-muted-foreground dark:text-foreground/70">Color Theory</span>
    </div>
  )
}

export function FeaturesSection() {
  const { t } = useLanguage()
  
  return (
    <section className="bg-background px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-muted-foreground dark:text-foreground/60 text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t.features.label}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Typography Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-xl p-8 min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            data-clickable
          >
            <div className="flex-1">
              <TypeTester />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">{t.features.typography.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-sm mt-1">{t.features.typography.description}</p>
            </div>
          </motion.div>

          {/* Layouts Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-xl p-8 min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <LayoutAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">{t.features.layout.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-sm mt-1">{t.features.layout.description}</p>
            </div>
          </motion.div>

          {/* Speed Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-xl p-8 min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <SpeedIndicator />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">{t.features.color.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-sm mt-1">{t.features.color.description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
