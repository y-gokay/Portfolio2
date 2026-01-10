"use client";

import { useState, useRef, useEffect } from "react";
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
  
  // Responsive item width calculation
  const getItemWidth = () => {
    if (typeof window === "undefined") return 280;
    if (window.innerWidth < 640) return 280; // Mobile
    if (window.innerWidth < 768) return 320; // Small tablet
    return 400; // Desktop
  };
  
  const [itemWidth, setItemWidth] = useState(280);
  
  useEffect(() => {
    const updateWidth = () => setItemWidth(getItemWidth());
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  
  // Duplicate items for seamless loop (3 copies for smooth infinite scroll)
  const duplicatedItems = portfolioItems.length > 0 
    ? [...portfolioItems, ...portfolioItems, ...portfolioItems]
    : [];
  
  const gap = 24; // gap-6 = 1.5rem = 24px
  const singleSetWidth = portfolioItems.length > 0 ? portfolioItems.length * (itemWidth + gap) : itemWidth + gap;

  // Helper function to wrap position for seamless infinite loop
  const wrapPosition = (pos: number): number => {
    if (singleSetWidth <= 0) return pos;
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
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 md:mb-12">
          <div className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-foreground dark:text-foreground text-center sm:text-left">
            {t.carousel.title}
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="shrink-0 w-[260px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[240px] md:h-[300px] rounded-lg sm:rounded-xl bg-secondary/20 dark:bg-surface/20 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error || portfolioItems.length === 0) {
    return (
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-primary-foreground dark:text-foreground">{error || "Portfolio verisi bulunamadı"}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 md:mb-12">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-foreground dark:text-foreground text-center sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {t.carousel.title}
          </motion.h2>
        </div>

        <div 
          ref={containerRef}
          className="relative overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-x pinch-zoom" }}
        >
          <motion.div
            className="flex gap-4 sm:gap-6 py-4 will-change-transform"
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
                className="shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl cursor-pointer select-none"
                style={{ width: itemWidth, height: itemWidth * 0.75 }}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: isDragging ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                data-clickable
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title[language]}
                  width={itemWidth}
                  height={itemWidth * 0.75}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                  quality={85}
                  draggable={false}
                  sizes={`(max-width: 640px) ${itemWidth}px, (max-width: 768px) ${itemWidth}px, ${itemWidth}px`}
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
