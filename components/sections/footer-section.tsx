"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ContactForm } from "@/components/contact-form"
import { SocialLinks } from "@/components/social-links"

export function FooterSection() {
  const { t, language } = useLanguage()
  
  return (
    <footer id="contact" className="relative bg-background px-4 sm:px-6 py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Gradient blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-300 via-purple-200 to-lime-200 dark:from-purple-600/40 dark:via-purple-500/30 dark:to-lime-400/30 opacity-40 dark:opacity-50 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto pt-16 sm:pt-20 md:pt-16 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 mb-10 sm:mb-12 md:mb-16">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif mb-3 sm:mb-4 md:mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {t.footer.contact.title}
            </motion.h3>
            <ContactForm />
          </div>

          {/* Contact info and Social Links */}
          <div className="space-y-5 sm:space-y-6 md:space-y-8 order-1 lg:order-2 pt-0 sm:pt-4 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif mb-2.5 sm:mb-3 md:mb-4 text-foreground">
                {t.footer.contact.title === "İletişim" ? "İletişim" : "Contact"}
              </h3>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <a
                  href={`mailto:${t.footer.contact.email}`}
                  className="block text-sm sm:text-base text-foreground hover:text-primary dark:hover:text-primary/80 transition-colors break-all sm:break-words"
                  data-clickable
                >
                  {t.footer.contact.email}
                </a>
                <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/60 leading-relaxed">
                  {t.footer.contact.role}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif mb-2.5 sm:mb-3 md:mb-4 text-foreground">
                {language === "tr" ? "Sosyal Medya" : "Social Media"}
              </h3>
              <SocialLinks />
            </motion.div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/60 text-center md:text-left">
            {t.footer.copyright}
          </p>
          <nav className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-end">
            {t.footer.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground transition-colors"
                data-clickable
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
