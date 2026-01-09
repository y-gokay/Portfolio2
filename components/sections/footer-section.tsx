"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ContactForm } from "@/components/contact-form"
import { SocialLinks } from "@/components/social-links"

export function FooterSection() {
  const { t } = useLanguage()
  
  return (
    <footer id="contact" className="relative bg-background px-6 py-24 overflow-hidden">
      {/* Gradient blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-300 via-purple-200 to-lime-200 dark:from-purple-600/40 dark:via-purple-500/30 dark:to-lime-400/30 opacity-40 dark:opacity-50 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Form */}
          <div>
            <motion.h3
              className="text-3xl md:text-4xl font-serif mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t.footer.contact.title}
            </motion.h3>
            <ContactForm />
          </div>

          {/* Contact info and Social Links */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif mb-4 text-foreground">İletişim</h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${t.footer.contact.email}`}
                  className="block text-foreground hover:text-primary dark:hover:text-primary/80 transition-colors"
                  data-clickable
                >
                  {t.footer.contact.email}
                </a>
                <p className="text-muted-foreground dark:text-foreground/60">{t.footer.contact.role}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-serif mb-4 text-foreground">Sosyal Medya</h3>
              <SocialLinks />
            </motion.div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground dark:text-foreground/60 text-sm">{t.footer.copyright}</p>
          <nav className="flex flex-wrap gap-6">
            {t.footer.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-muted-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground transition-colors text-sm"
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
