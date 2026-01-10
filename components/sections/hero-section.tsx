"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { defaultSiteSettings } from "@/lib/default-site-settings";

export function HeroSection() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScattered, setHasScattered] = useState(false);
  
  // Get hero images from KV or fallback to default
  const heroImages = settings?.heroImages || defaultSiteSettings.heroImages;
  const images = [heroImages.image1, heroImages.image2, heroImages.image3];
  
  const [isMobile, setIsMobile] = useState(false);
  const [image1Position, setImage1Position] = useState({
    x: -80,
    y: 0,
    rotate: -8,
  });
  const [image2Position, setImage2Position] = useState({
    x: 0,
    y: 0,
    rotate: 0,
  });
  const [image3Position, setImage3Position] = useState({
    x: 80,
    y: 0,
    rotate: 8,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Responsive kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll ile otomatik dağılma (sadece bir kez, geri birleşmez)
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const dragLimit = isMobile ? 200 : 400;
    
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Scroll %30'u geçtiyse ve henüz dağılmadıysa
      if (latest > 0.3 && !hasScattered) {
        setHasScattered(true);
        setImage1Position({ x: dragLimit, y: 0, rotate: 15 });
        setImage2Position({ x: -dragLimit, y: 0, rotate: -15 });
        // image3 zaten arka planda kalıyor
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, hasScattered, prefersReducedMotion, isMobile]);

  // Responsive image sizes and positions
  const imageOffset = isMobile ? 40 : 80;
  const dragLimit = isMobile ? 200 : 400;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6 py-16 sm:py-24"
    >
      {/* Stacked images */}
      <div className="relative flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl mx-auto px-4">
        <div className="relative flex items-center justify-center w-full min-h-[300px] h-[300px] sm:min-h-[400px] sm:h-[400px] md:min-h-[500px] md:h-[500px] lg:min-h-[600px] lg:h-[600px]">
          {/* First Image - Draggable to Right */}
          <motion.div
            className={`absolute w-[140px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 z-10 ${
              prefersReducedMotion ? "cursor-default" : "cursor-grab active:cursor-grabbing"
            }`}
            initial={{
              clipPath: "inset(100% 0 0 0)",
              x: -imageOffset,
              y: 0,
              rotate: prefersReducedMotion ? 0 : -8,
            }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image1Position.x,
              y: image1Position.y,
              rotate: prefersReducedMotion ? 0 : image1Position.rotate,
            }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            drag={prefersReducedMotion || isMobile ? false : "x"}
            dragConstraints={{ left: -dragLimit, right: dragLimit }}
            dragElastic={0.2}
            whileDrag={prefersReducedMotion ? {} : {
              scale: 1.05,
              zIndex: 20,
              rotate: image1Position.rotate + 5,
            }}
            onDragEnd={(event, info) => {
              if (prefersReducedMotion || isMobile) return;
              // Sağa doğru sürüklendiğinde
              if (info.offset.x > 50) {
                setImage1Position({ x: dragLimit, y: 0, rotate: 15 });
                setHasScattered(true);
              } else if (info.offset.x < -50) {
                if (!hasScattered) {
                  setImage1Position({ x: -imageOffset, y: 0, rotate: -8 });
                }
              } else {
                if (!hasScattered) {
                  setImage1Position({ x: -imageOffset, y: 0, rotate: -8 });
                }
              }
            }}
            style={{ zIndex: 10 }}
          >
            <Image
              src={images[0] || "/placeholder.svg"}
              alt="Portfolio showcase 1"
              width={320}
              height={427}
              className="w-full h-full object-cover pointer-events-none"
              priority
              quality={90}
            />
          </motion.div>

          {/* Second Image - Center, Draggable to Left */}
          <motion.div
            className={`relative w-[140px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 z-20 ${
              prefersReducedMotion ? "cursor-default" : "cursor-grab active:cursor-grabbing"
            }`}
            initial={{ clipPath: "inset(100% 0 0 0)", x: 0, y: 0, rotate: 0 }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image2Position.x,
              y: image2Position.y,
              rotate: prefersReducedMotion ? 0 : image2Position.rotate,
            }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag={prefersReducedMotion || isMobile ? false : "x"}
            dragConstraints={{ left: -dragLimit, right: dragLimit }}
            dragElastic={0.2}
            whileDrag={prefersReducedMotion ? {} : {
              scale: 1.05,
              zIndex: 20,
              rotate: image2Position.rotate - 5,
            }}
            onDragEnd={(event, info) => {
              if (prefersReducedMotion || isMobile) return;
              // Sola doğru sürüklendiğinde
              if (info.offset.x < -50) {
                setImage2Position({ x: -dragLimit, y: 0, rotate: -15 });
                setHasScattered(true);
              } else if (info.offset.x > 50) {
                if (!hasScattered) {
                  setImage2Position({ x: 0, y: 0, rotate: 0 });
                }
              } else {
                if (!hasScattered) {
                  setImage2Position({ x: 0, y: 0, rotate: 0 });
                }
              }
            }}
            style={{ zIndex: 20 }}
          >
            <Image
              src={images[1] || "/placeholder.svg"}
              alt="Portfolio showcase 2"
              width={320}
              height={427}
              className="w-full h-full object-cover pointer-events-none"
              priority
              quality={90}
            />
          </motion.div>

          {/* Third Image - Static Background */}
          <motion.div
            className="absolute w-[140px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 z-0 opacity-70 sm:opacity-80"
            initial={{ clipPath: "inset(100% 0 0 0)", x: imageOffset, y: 0, rotate: prefersReducedMotion ? 0 : 8 }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image3Position.x,
              y: image3Position.y,
              rotate: prefersReducedMotion ? 0 : image3Position.rotate,
            }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 0 }}
          >
            <Image
              src={images[2] || "/placeholder.svg"}
              alt="Portfolio showcase 3"
              width={320}
              height={427}
              className="w-full h-full object-cover"
              priority
              quality={90}
            />
          </motion.div>
        </div>

        {/* Name and subtitle below images */}
        <motion.div
          className="flex flex-col items-center justify-center pointer-events-none z-10 mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif text-center text-foreground leading-tight break-words">
            {t.hero.name}
          </h1>
          <em className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground/80 mt-1 sm:mt-2 text-center break-words px-2">
            {t.hero.subtitle}
          </em>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-0.5 sm:gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/60 dark:text-foreground/70" />
          <ChevronDown
            className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/40 dark:text-foreground/50 -mt-2 sm:-mt-3"
            style={{ opacity: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
