"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Download, Calendar, MapPin, Building } from "lucide-react";
import { LenisProvider } from "@/components/lenis-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { StickyHeader } from "@/components/sticky-header";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { FooterSection } from "@/components/sections/footer-section";
import { useResume } from "@/hooks/use-resume";

export default function ResumePage() {
  const { t, language } = useLanguage();
  const { resumeData, loading, error } = useResume();

  const handleDownloadCV = () => {
    if (resumeData?.cvUrl) {
      const cvUrl = resumeData.cvUrl[language] || resumeData.cvUrl.tr || resumeData.cvUrl.en;
      if (cvUrl) {
        window.open(cvUrl, "_blank");
      } else {
        // Fallback: try to download from /cv.pdf
        window.open("/cv.pdf", "_blank");
      }
    } else {
      // Fallback: try to download from /cv.pdf
      window.open("/cv.pdf", "_blank");
    }
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <LenisProvider>
          <StickyHeader />
          <ScrollProgress />
          <main id="main-content" className="bg-background pt-20 sm:pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
              <div className="text-center py-12">
                <p className="text-muted-foreground dark:text-foreground/70">
                  {language === "tr" ? "Yükleniyor..." : "Loading..."}
                </p>
              </div>
            </div>
          </main>
          <BackToTop />
        </LenisProvider>
      </ErrorBoundary>
    );
  }

  if (error || !resumeData) {
    return (
      <ErrorBoundary>
        <LenisProvider>
          <StickyHeader />
          <ScrollProgress />
          <main id="main-content" className="bg-background pt-20 sm:pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
              <div className="text-center py-12">
                <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
                  {error || (language === "tr" ? "Resume verisi bulunamadı." : "Resume data not found.")}
                </p>
              </div>
            </div>
          </main>
          <BackToTop />
        </LenisProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LenisProvider>
        <StickyHeader />
        <ScrollProgress />
        <main id="main-content" className="bg-background pt-20 sm:pt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
            {/* Header */}
            <motion.div
              className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                  {t.resume.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
                  {t.resume.summary.title}
                </p>
              </div>
              <button
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary/90 transition-colors shadow-sm dark:shadow-lg dark:shadow-primary/20"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">
                  {t.resume.download}
                </span>
              </button>
            </motion.div>

            {/* Summary */}
            <motion.section
              className="mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
                {t.resume.summary.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground dark:text-foreground/70 leading-relaxed">
                {resumeData.summary[language]}
              </p>
            </motion.section>

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <motion.section
                className="mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">
                  {t.resume.experience.title}
                </h2>
                <div className="space-y-6 sm:space-y-8">
                  {resumeData.experience.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg sm:text-xl text-foreground mb-1 sm:mb-2">
                            {item.title[language]}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Building className="w-4 h-4" />
                              <span>{item.company[language]}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location[language]}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-primary font-medium flex-shrink-0">
                          <Calendar className="w-4 h-4" />
                          <span>{item.period[language]}</span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed">
                        {item.description[language]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <motion.section
                className="mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">
                  {t.resume.education.title}
                </h2>
                <div className="space-y-6 sm:space-y-8">
                  {resumeData.education.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex-1">
                          <h3 className="font-serif text-lg sm:text-xl text-foreground mb-1 sm:mb-2">
                            {item.degree[language]}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Building className="w-4 h-4" />
                              <span>{item.institution[language]}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location[language]}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-primary font-medium flex-shrink-0">
                          <Calendar className="w-4 h-4" />
                          <span>{item.period[language]}</span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed">
                        {item.description[language]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">
                  {t.skills.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {resumeData.skills.map((skillCategory, index) => (
                    <motion.div
                      key={skillCategory.id}
                      className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <h3 className="font-serif text-lg sm:text-xl text-foreground mb-4 sm:mb-6">
                        {skillCategory.category[language]}
                      </h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {skillCategory.items.map((skill, skillIndex) => (
                          <li
                            key={skillIndex}
                            className="flex items-center text-sm sm:text-base text-muted-foreground dark:text-foreground/70"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Contact Section */}
          <FooterSection />
        </main>
        <BackToTop />
      </LenisProvider>
    </ErrorBoundary>
  );
}
