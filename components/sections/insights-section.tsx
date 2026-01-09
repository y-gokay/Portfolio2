"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PortfolioModal } from "@/components/portfolio-modal";
import { PortfolioItem } from "@/lib/portfolio-data";
import { usePortfolio } from "@/hooks/use-portfolio";

export function InsightsSection() {
  const { t, language } = useLanguage();
  const { portfolioItems, loading, error } = usePortfolio();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (loading) {
    return (
      <section id="projects" className="bg-background px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-muted-foreground dark:text-foreground/60 text-sm uppercase tracking-widest mb-8">
            {t.insights.label}
          </div>
          <div className="divide-y divide-border dark:divide-border/50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-6">
                <div className="h-6 w-32 bg-secondary dark:bg-surface rounded animate-pulse mb-2" />
                <div className="h-8 w-64 bg-secondary dark:bg-surface rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="bg-background px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="projects"
        className="bg-background px-6 py-24"
        onMouseMove={handleMouseMove}
      >
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-muted-foreground dark:text-foreground/60 text-sm uppercase tracking-widest mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.insights.label}
          </motion.p>

          <div className="divide-y divide-border dark:divide-border/50">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="group flex items-center justify-between py-6 relative cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleItemClick(item)}
                whileHover={{ paddingLeft: 16, paddingRight: 16 }}
                data-clickable
              >
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground dark:text-foreground/60 uppercase tracking-wider">
                    {item.category[language]}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mt-1 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {item.title[language]}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground dark:text-foreground/60 group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Floating hover image */}
          <AnimatePresence>
            {hoveredIndex !== null && portfolioItems[hoveredIndex] && (
              <motion.div
                className="fixed pointer-events-none z-50 w-[200px] md:w-[300px] rounded-lg overflow-hidden shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/30 hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePosition.x + 20,
                  y: mousePosition.y - 100,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={portfolioItems[hoveredIndex].image || "/placeholder.svg"}
                  alt={portfolioItems[hoveredIndex].title[language]}
                  width={300}
                  height={200}
                  className="w-full h-auto"
                  quality={85}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <PortfolioModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
