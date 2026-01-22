"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSiteSettings } from "@/hooks/use-site-settings"
import { defaultSiteSettings } from "@/lib/default-site-settings"

export function ManifestoSection() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const clipPath = useTransform(scrollYProgress, [0.2, 0.6], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
  
  const titleLines = t.manifesto.title.split("\n")
  
  // Get CV URL from KV or fallback to default
  const cvUrl = settings?.cvUrl || defaultSiteSettings.cvUrl || "/cv.pdf"
  const hasCv = cvUrl && cvUrl.trim() !== "" && cvUrl !== "/cv.pdf"

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
          className="mt-8 sm:mt-12 md:mt-16 space-y-8 sm:space-y-10 max-w-4xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.5 }}
        >
          {/* Professional Story */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif text-foreground">
              {t.about.story.title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground dark:text-foreground/70 leading-relaxed">
              {t.about.story.content}
            </p>
          </div>

          {/* Approach */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif text-foreground">
              {t.about.approach.title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground dark:text-foreground/70 leading-relaxed">
              {t.about.approach.content}
            </p>
          </div>

          {/* Interests */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif text-foreground">
              {t.about.interests.title}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {t.about.interests.items.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-sm sm:text-base text-muted-foreground dark:text-foreground/70"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CV Download Button - Only show if CV is uploaded */}
          {hasCv && (
            <motion.div
              className="mt-8 sm:mt-10 md:mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.8 }}
            >
              <a
                href={cvUrl}
                download
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary/90 transition-colors shadow-sm dark:shadow-lg dark:shadow-primary/20 font-medium text-sm sm:text-base"
                onClick={(e) => {
                  // Eğer URL bir external URL ise, yeni sekmede aç
                  if (cvUrl.startsWith("http")) {
                    e.preventDefault();
                    window.open(cvUrl, "_blank");
                    return;
                  }
                  // Eğer PDF dosyası yoksa, resume sayfasına yönlendir
                  fetch(cvUrl, { method: "HEAD" })
                    .then((res) => {
                      if (!res.ok) {
                        e.preventDefault();
                        window.location.href = "/resume";
                      }
                    })
                    .catch(() => {
                      e.preventDefault();
                      window.location.href = "/resume";
                    });
                }}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.resume.download}</span>
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
