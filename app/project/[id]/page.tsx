"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PortfolioItem } from "@/lib/portfolio-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { LenisProvider } from "@/components/lenis-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { StickyHeader } from "@/components/sticky-header";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { portfolioItems, loading } = usePortfolio();
  const [project, setProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (params?.id && portfolioItems.length > 0) {
      const foundProject = portfolioItems.find((item) => item.id === params.id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        // Project not found, redirect to home
        router.push("/#portfolio");
      }
    }
  }, [params?.id, portfolioItems, router]);

  if (loading) {
    return (
      <ErrorBoundary>
        <LenisProvider>
          <StickyHeader />
          <main className="bg-background pt-20 sm:pt-24 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">{t.research.subtitle}</p>
            </div>
          </main>
        </LenisProvider>
      </ErrorBoundary>
    );
  }

  if (!project) {
    return (
      <ErrorBoundary>
        <LenisProvider>
          <StickyHeader />
          <main className="bg-background pt-20 sm:pt-24 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                {language === "tr" ? "Proje bulunamadı" : "Project not found"}
              </p>
              <button
                onClick={() => router.push("/#portfolio")}
                className="mt-4 text-primary hover:underline"
              >
                {language === "tr" ? "Portföye dön" : "Back to portfolio"}
              </button>
            </div>
          </main>
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
            {/* Back Button */}
            <motion.button
              onClick={() => router.push("/#portfolio")}
              className="flex items-center gap-2 text-muted-foreground dark:text-foreground/70 hover:text-foreground dark:hover:text-foreground transition-colors mb-6 sm:mb-8 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">
                {language === "tr" ? "Portföye Dön" : "Back to Portfolio"}
              </span>
            </motion.button>

            {/* Header */}
            <motion.div
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium">
                  {project.category[language]}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6">
                {project.title[language]}
              </h1>
              {project.description && (
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-foreground/70 leading-relaxed max-w-3xl">
                  {project.description[language]}
                </p>
              )}
            </motion.div>

            {/* Main Image */}
            {project.image && (
              <motion.div
                className="mb-8 sm:mb-12 rounded-lg sm:rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src={project.image}
                  alt={project.title[language]}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                  quality={90}
                />
              </motion.div>
            )}

            {/* Project Details */}
            <motion.div
              className="mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {project.year && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/60">
                      {language === "tr" ? "Yıl" : "Year"}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-foreground">{project.year}</p>
                  </div>
                </div>
              )}
              {project.tags && project.tags[language] && project.tags[language].length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-foreground/60 mb-2">
                    {language === "tr" ? "Etiketler" : "Tags"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags[language].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs sm:text-sm bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 text-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Media Gallery */}
            {(project.media || project.images) && (
              <motion.section
                className="mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-6 sm:mb-8">
                  {language === "tr" ? "Proje Görselleri" : "Project Gallery"}
                </h2>
                {project.media && project.media.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {project.media.map((item, index) => (
                      <motion.div
                        key={index}
                        className="rounded-lg sm:rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={`${project.title[language]} - ${index + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-auto"
                            quality={85}
                          />
                        ) : (
                          <div className="relative w-full aspect-video bg-secondary dark:bg-secondary/80">
                            <video
                              src={item.url}
                              controls
                              className="w-full h-full"
                              poster={item.thumbnail}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : project.images && project.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {project.images.map((img, index) => (
                      <motion.div
                        key={index}
                        className="rounded-lg sm:rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Image
                          src={img}
                          alt={`${project.title[language]} - ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto"
                          quality={85}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : null}
              </motion.section>
            )}
          </div>
        </main>
        <BackToTop />
      </LenisProvider>
    </ErrorBoundary>
  );
}
