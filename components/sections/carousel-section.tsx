"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { PortfolioModal } from "@/components/portfolio-modal";
import { PortfolioItem } from "@/lib/portfolio-data";
import { usePortfolio } from "@/hooks/use-portfolio";

export function CarouselSection() {
  const { t, language } = useLanguage();
  const { portfolioItems, loading, error } = usePortfolio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const baseX = useMotionValue(0);
  
  // Duplicate items for seamless loop (3 copies for smooth infinite scroll)
  const duplicatedItems = portfolioItems.length > 0 
    ? [...portfolioItems, ...portfolioItems, ...portfolioItems]
    : [];
  const itemWidth = 400; // md:w-[400px]
  const gap = 24; // gap-6 = 1.5rem = 24px
  const singleSetWidth = portfolioItems.length * (itemWidth + gap);

  // Helper function to wrap position for seamless infinite loop
  const wrapPosition = (pos: number): number => {
    if (pos <= -singleSetWidth) {
      return pos + singleSetWidth;
    }
    if (pos > 0) {
      return pos - singleSetWidth;
    }
    return pos;
  };

  // Auto-scroll animation (only when not dragging)
  useAnimationFrame(() => {
    if (!isDragging) {
      const base = baseX.get();
      const scrollSpeed = 0.5;
      let newX = base - scrollSpeed;
      
      // Wrap position for seamless infinite loop
      newX = wrapPosition(newX);
      
      baseX.set(newX);
      x.set(newX);
    }
  });

  const handleItemClick = (item: PortfolioItem) => {
    if (!isDragging) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (loading) {
    return (
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="text-3xl md:text-4xl font-serif text-primary-foreground dark:text-foreground">
            {t.carousel.title}
          </div>
        </div>
        <div className="flex gap-6 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 w-[300px] md:w-[400px] h-[300px] rounded-xl bg-secondary/20 dark:bg-surface/20 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error || portfolioItems.length === 0) {
    return (
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-primary-foreground dark:text-foreground">{error || "Portfolio verisi bulunamadı"}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-serif text-primary-foreground dark:text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t.carousel.title}
          </motion.h2>
        </div>

        <div 
          ref={containerRef}
          className="relative overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          <motion.div
            className="flex gap-6 py-4 will-change-transform"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -Infinity, right: Infinity }}
            dragElastic={0.1}
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={(event, info) => {
              setIsDragging(false);
              // Calculate final position from baseX + total offset
              const finalX = baseX.get() + info.offset.x;
              // Wrap position to stay within one set range for seamless loop
              const wrappedX = wrapPosition(finalX);
              // Update baseX to wrapped position for seamless continuation
              baseX.set(wrappedX);
              x.set(wrappedX);
            }}
            onDrag={(event, info) => {
              // Calculate new position from baseX + current offset
              const newX = baseX.get() + info.offset.x;
              
              // Wrap during drag for seamless infinite feel
              const wrappedX = wrapPosition(newX);
              x.set(wrappedX);
            }}
          >
            {duplicatedItems.map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`}
                className="shrink-0 w-[300px] md:w-[400px] rounded-xl overflow-hidden shadow-2xl cursor-pointer select-none"
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: isDragging ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                data-clickable
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title[language]}
                  width={400}
                  height={300}
                  className="w-full h-auto pointer-events-none"
                  loading="lazy"
                  quality={85}
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
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
