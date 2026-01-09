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

const images = [
  "/minimal-architecture-portfolio-with-clean-lines.jpg",
  "/fashion-photography-editorial-black-and-white.jpg",
  "/modern-ui-design-portfolio-mockup.jpg",
];

export function HeroSection() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScattered, setHasScattered] = useState(false);
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

  // Scroll ile otomatik dağılma (sadece bir kez, geri birleşmez)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Scroll %30'u geçtiyse ve henüz dağılmadıysa
      if (latest > 0.3 && !hasScattered) {
        setHasScattered(true);
        setImage1Position({ x: 400, y: 0, rotate: 15 });
        setImage2Position({ x: -400, y: 0, rotate: -15 });
        // image3 zaten arka planda kalıyor
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, hasScattered]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 py-24"
    >
      {/* Stacked images */}
      <div className="relative flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* First Image - Draggable to Right */}
          <motion.div
            className="absolute w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 cursor-grab active:cursor-grabbing z-10"
            initial={{
              clipPath: "inset(100% 0 0 0)",
              x: -80,
              y: 0,
              rotate: -8,
            }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image1Position.x,
              y: image1Position.y,
              rotate: image1Position.rotate,
            }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: -400, right: 400 }}
            dragElastic={0.2}
            whileDrag={{
              scale: 1.05,
              zIndex: 20,
              rotate: image1Position.rotate + 5,
            }}
            onDragEnd={(event, info) => {
              // Sağa doğru sürüklendiğinde
              if (info.offset.x > 50) {
                setImage1Position({ x: 400, y: 0, rotate: 15 });
                setHasScattered(true); // Manuel dağılma da işaretle
              } else if (info.offset.x < -50) {
                // Sola geri döndüğünde - sadece henüz scroll ile dağılmadıysa
                if (!hasScattered) {
                  setImage1Position({ x: -80, y: 0, rotate: -8 });
                }
              } else {
                // Yeterince sürüklenmediyse - sadece henüz scroll ile dağılmadıysa geri dön
                if (!hasScattered) {
                  setImage1Position({ x: -80, y: 0, rotate: -8 });
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
            className="relative w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 cursor-grab active:cursor-grabbing z-20"
            initial={{ clipPath: "inset(100% 0 0 0)", x: 0, y: 0, rotate: 0 }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image2Position.x,
              y: image2Position.y,
              rotate: image2Position.rotate,
            }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: -400, right: 400 }}
            dragElastic={0.2}
            whileDrag={{
              scale: 1.05,
              zIndex: 20,
              rotate: image2Position.rotate - 5,
            }}
            onDragEnd={(event, info) => {
              // Sola doğru sürüklendiğinde
              if (info.offset.x < -50) {
                setImage2Position({ x: -400, y: 0, rotate: -15 });
                setHasScattered(true); // Manuel dağılma da işaretle
              } else if (info.offset.x > 50) {
                // Sağa geri döndüğünde - sadece henüz scroll ile dağılmadıysa
                if (!hasScattered) {
                  setImage2Position({ x: 0, y: 0, rotate: 0 });
                }
              } else {
                // Yeterince sürüklenmediyse - sadece henüz scroll ile dağılmadıysa geri dön
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
            className="absolute w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20 z-0"
            initial={{ clipPath: "inset(100% 0 0 0)", x: 80, y: 0, rotate: 8 }}
            animate={{
              clipPath: "inset(0 0 0 0)",
              x: image3Position.x,
              y: image3Position.y,
              rotate: image3Position.rotate,
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
          className="flex flex-col items-center justify-center pointer-events-none z-10 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-center text-foreground">
            {t.hero.name}
          </h1>
          <em className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-foreground/80 mt-2">
            {t.hero.subtitle}
          </em>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.span
          className="text-xs text-muted-foreground dark:text-foreground/60 uppercase tracking-wider font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        ></motion.span>
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-foreground/60 dark:text-foreground/70" />
          <ChevronDown
            className="w-6 h-6 text-foreground/40 dark:text-foreground/50 -mt-3"
            style={{ opacity: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
