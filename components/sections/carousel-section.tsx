"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
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
  const duplicatedItems =
    portfolioItems.length > 0
      ? [...portfolioItems, ...portfolioItems, ...portfolioItems]
      : [];

  const gap = 24; // gap-6 = 1.5rem = 24px
  const singleSetWidth =
    portfolioItems.length > 0
      ? portfolioItems.length * (itemWidth + gap)
      : itemWidth + gap;

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

  // Auto-scroll animation (only when not dragging and not paused/hovered, and not showing all)
  useAnimationFrame(() => {
    if (!showAll && !isDragging && !isPaused && hoveredIndex === null) {
      const currentBaseX = baseX.get();
      const scrollSpeed = 0.5;
      let newX = currentBaseX - scrollSpeed;

      // Wrap position for seamless infinite loop
      newX = wrapPosition(newX);

      // Update both baseX and x to keep them in sync
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
          <p className="text-sm sm:text-base text-primary-foreground dark:text-foreground">
            {error || "Portfolio verisi bulunamadı"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-primary dark:bg-primary/20 dark:border-t dark:border-b dark:border-primary/20 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-between gap-4">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary-foreground dark:text-foreground text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {t.carousel.title}
            </motion.h2>
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-background/10 dark:bg-background/20 hover:bg-background/20 dark:hover:bg-background/30 text-primary-foreground dark:text-foreground rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium backdrop-blur-sm border border-primary-foreground/10 dark:border-foreground/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {showAll
                  ? language === "tr"
                    ? "Daha Az Göster"
                    : "Show Less"
                  : language === "tr"
                  ? "Tümünü Gör"
                  : "Show All"}
              </span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showAll ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto px-4 sm:px-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl cursor-pointer select-none group aspect-4/3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-clickable
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title[language]}
                      fill
                      className="object-cover pointer-events-none"
                      loading="lazy"
                      quality={85}
                      draggable={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 dark:from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs text-white/80 dark:text-white/90 uppercase tracking-wider block mb-1">
                        {item.category[language]}
                      </span>
                      <h3 className="text-base sm:text-lg md:text-xl font-serif text-white line-clamp-2">
                        {item.title[language]}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                  dragElastic={0.05}
                  dragMomentum={false}
                  onDragStart={(event, info) => {
                    setIsDragging(true);
                    // Stop auto-scroll by saving current position
                    dragStartXRef.current = baseX.get();
                    // Set x to current baseX to ensure sync
                    x.set(baseX.get());
                  }}
                  onDrag={(event, info) => {
                    // During drag, calculate position from saved start position + drag offset
                    // Don't wrap during drag to allow smooth dragging experience
                    const dragX = dragStartXRef.current + info.offset.x;
                    // Update x directly (baseX stays at dragStartXRef until dragEnd)
                    x.set(dragX);
                  }}
                  onDragEnd={(event, info) => {
                    setIsDragging(false);

                    // Calculate final position after drag
                    const finalX = dragStartXRef.current + info.offset.x;

                    // Wrap position to stay within one set range for seamless infinite loop
                    const wrappedX = wrapPosition(finalX);

                    // Update both baseX and x to the wrapped position
                    // This ensures seamless continuation of auto-scroll after drag
                    baseX.set(wrappedX);
                    x.set(wrappedX);
                  }}
                >
                  {duplicatedItems.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${i}`}
                      className="relative shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl cursor-pointer select-none group"
                      style={{ width: itemWidth, height: itemWidth * 0.75 }}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => {
                        setHoveredIndex(i);
                        setIsPaused(true);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setIsPaused(false);
                      }}
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
                      {/* Hover overlay with title */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 dark:from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-xs text-white/80 dark:text-white/90 uppercase tracking-wider block mb-1">
                          {item.category[language]}
                        </span>
                        <h3 className="text-base sm:text-lg md:text-xl font-serif text-white line-clamp-2">
                          {item.title[language]}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <PortfolioModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
