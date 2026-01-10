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
        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-foreground"
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
    <div className="h-full p-2 sm:p-4 flex items-center justify-center">
      <motion.div className={`grid ${layouts[layout]} gap-1.5 sm:gap-2 w-full max-w-[100px] sm:max-w-[120px] md:max-w-[140px]`} layout>
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-primary/20 dark:bg-primary/40 rounded-md min-h-[24px] sm:min-h-[28px] md:min-h-[30px] shadow-sm dark:shadow-md dark:shadow-primary/20"
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
    <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4">
      <div className="flex gap-1.5 sm:gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/20 dark:bg-primary/30 shadow-sm dark:shadow-md dark:shadow-primary/10" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/40 dark:bg-primary/50 shadow-sm dark:shadow-md dark:shadow-primary/15" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary/60 dark:bg-primary/70 shadow-sm dark:shadow-md dark:shadow-primary/20" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary dark:bg-primary shadow-md dark:shadow-lg dark:shadow-primary/30" />
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/70">Color Theory</span>
    </div>
  )
}

export function FeaturesSection() {
  const { t } = useLanguage()
  
  return (
    <section id="skills" className="bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-muted-foreground dark:text-foreground/60 text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {t.skills.title}
        </motion.p>

        {/* Expertise Areas */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-6 sm:mb-8">
            {t.skills.expertise.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {/* Typography Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8 min-h-[240px] sm:min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5"
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
            <div className="mt-3 sm:mt-4">
              <h3 className="font-serif text-lg sm:text-xl text-foreground">{t.features.typography.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">{t.features.typography.description}</p>
            </div>
          </motion.div>

          {/* Layouts Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8 min-h-[240px] sm:min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <LayoutAnimation />
            </div>
            <div className="mt-3 sm:mt-4">
              <h3 className="font-serif text-lg sm:text-xl text-foreground">{t.features.layout.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">{t.features.layout.description}</p>
            </div>
          </motion.div>

          {/* Speed Card */}
          <motion.div
            className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8 min-h-[240px] sm:min-h-[280px] flex flex-col shadow-sm dark:shadow-lg dark:shadow-primary/5 sm:col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <SpeedIndicator />
            </div>
            <div className="mt-3 sm:mt-4">
              <h3 className="font-serif text-lg sm:text-xl text-foreground">{t.features.color.title}</h3>
              <p className="text-muted-foreground dark:text-foreground/70 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">{t.features.color.description}</p>
            </div>
          </motion.div>
        </div>

        {/* Tools Section - Direct list without title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* All Tools - Combined list without categories */}
            {[
              ...t.skills.tools.categories.design.items,
              ...t.skills.tools.categories.prototyping.items,
              ...t.skills.tools.categories.development.items,
            ]
              .filter((tool, index, self) => self.indexOf(tool) === index) // Remove duplicates
              .map((tool, index) => (
                <motion.div
                  key={index}
                  className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-center text-center min-h-[60px] sm:min-h-[80px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {tool}
                  </span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
