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
      className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center bg-background px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 lg:py-32"
    >
      <div className="max-w-5xl mx-auto relative w-full">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-tight text-center text-foreground/10 dark:text-foreground/5 px-2">
          {titleLines[0]}
          {titleLines[1] && (
            <>
              <br />
              {titleLines[1]}
            </>
          )}
        </h2>

        {/* Gradient mask reveal text */}
        <motion.h2
          className="absolute inset-0 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-tight text-center bg-linear-to-r from-purple-700 via-purple-400 to-purple-700 dark:from-purple-500 dark:via-lilac dark:to-purple-500 bg-clip-text text-transparent px-2"
          style={{ clipPath }}
        >
          {titleLines[0]}
          {titleLines[1] && (
            <>
              <br />
              {titleLines[1]}
            </>
          )}
        </motion.h2>
        
        <motion.p
          className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground dark:text-foreground/70 text-center max-w-2xl mx-auto px-4 sm:px-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3 }}
        >
          {t.manifesto.description}
        </motion.p>

        {/* Additional About Info */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-serif text-foreground">
              {language === "tr" ? "Eğitim" : "Education"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed">
              {language === "tr"
                ? "Grafik Tasarım bölümünde lisans eğitimi alıyorum. Tipografi, görsel iletişim ve dijital tasarım alanlarında kendimi geliştiriyorum."
                : "I'm pursuing a bachelor's degree in Graphic Design. I'm developing myself in typography, visual communication, and digital design."}
            </p>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-serif text-foreground">
              {language === "tr" ? "Yaklaşım" : "Approach"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed">
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
