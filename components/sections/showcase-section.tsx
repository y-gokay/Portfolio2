"use client";

import { useState } from "react";
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { PortfolioModal } from "@/components/portfolio-modal";
import { portfolioItems, PortfolioItem } from "@/lib/portfolio-data";

export function ShowcaseSection() {
  const { t, language } = useLanguage();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [100, -100]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [150, -150]
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [80, -80]
  );

  const yValues = [y1, y2, y3];

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Show first 3 portfolio items
  const displayItems = portfolioItems.slice(0, 3);

  return (
    <>
      <section
        id="showcase"
        ref={containerRef}
        className="bg-background px-6 py-32 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-muted-foreground dark:text-foreground/60 text-sm uppercase tracking-widest mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.showcase.label}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden group cursor-pointer dark:border dark:border-primary/20 dark:shadow-lg dark:shadow-primary/10"
                style={{ y: yValues[i] }}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0 0 0 0)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-clickable
              >
                <motion.div
                  className="w-full h-full relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={item.image}
                    alt={item.title[language]}
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={85}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 dark:from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-white/80 dark:text-white/90 uppercase tracking-wider block mb-1">
                    {item.category[language]}
                  </span>
                  <h3 className="text-xl font-serif text-white">
                    {item.title[language]}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
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
