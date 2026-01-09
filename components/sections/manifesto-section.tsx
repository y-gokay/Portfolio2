"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export function ManifestoSection() {
  const { t, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const clipPath = useTransform(scrollYProgress, [0.2, 0.6], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
  
  const titleLines = t.manifesto.title.split("\n")

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center bg-background px-6 py-32"
    >
      <div className="max-w-5xl mx-auto relative">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-center text-foreground/10 dark:text-foreground/5">
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </h2>

        {/* Gradient mask reveal text */}
        <motion.h2
          className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-center bg-linear-to-r from-purple-700 via-purple-400 to-purple-700 dark:from-purple-500 dark:via-lilac dark:to-purple-500 bg-clip-text text-transparent"
          style={{ clipPath }}
        >
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </motion.h2>
        
        <motion.p
          className="mt-12 text-lg md:text-xl text-muted-foreground dark:text-foreground/70 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {t.manifesto.description}
        </motion.p>

        {/* Additional About Info */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <h3 className="text-xl font-serif mb-4 text-foreground">
              {language === "tr" ? "Eğitim" : "Education"}
            </h3>
            <p className="text-muted-foreground dark:text-foreground/70">
              {language === "tr"
                ? "Grafik Tasarım bölümünde lisans eğitimi alıyorum. Tipografi, görsel iletişim ve dijital tasarım alanlarında kendimi geliştiriyorum."
                : "I'm pursuing a bachelor's degree in Graphic Design. I'm developing myself in typography, visual communication, and digital design."}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif mb-4 text-foreground">
              {language === "tr" ? "Yaklaşım" : "Approach"}
            </h3>
            <p className="text-muted-foreground dark:text-foreground/70">
              {language === "tr"
                ? "Her projede yaratıcılık ve işlevselliği birleştirerek, anlamlı ve etkileyici tasarımlar oluşturmayı hedefliyorum."
                : "I aim to create meaningful and impactful designs by combining creativity and functionality in every project."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
