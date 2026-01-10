"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export function StickyHeader() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Ensure client-side only rendering for navigation links to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Use default translations until mounted to ensure SSR/client match
  const navLinks = mounted ? [
    { label: t.navigation?.home || "Ana Sayfa", href: "/#main-content" },
    { label: t.navigation?.about || "Hakkımda", href: "/#about" },
    { label: t.navigation?.skills || "Yetenekler", href: "/#skills" },
    { label: t.navigation?.portfolio || "Portföy", href: "/#portfolio" },
    { label: t.navigation?.research || "Projelerim", href: "/#research" },
    { label: t.navigation?.awards || "Ödüller & Sergiler", href: "/#awards" },
    { label: t.navigation?.resume || "Özgeçmiş", href: "/resume" },
    { label: t.navigation?.contact || "İletişim", href: "/#contact" },
  ] : [
    { label: "Ana Sayfa", href: "/#main-content" },
    { label: "Hakkımda", href: "/#about" },
    { label: "Yetenekler", href: "/#skills" },
    { label: "Portföy", href: "/#portfolio" },
    { label: "Projelerim", href: "/#research" },
    { label: "Ödüller & Sergiler", href: "/#awards" },
    { label: "Özgeçmiş", href: "/resume" },
    { label: "İletişim", href: "/#contact" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("/#")) {
      // Handle navigation to home page sections
      if (typeof window !== "undefined") {
        const hash = href.split("#")[1];
        if (window.location.pathname === "/") {
          const element = document.querySelector(`#${hash}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          window.location.href = href;
        }
      }
    } else {
      // External route navigation
      if (typeof window !== "undefined") {
        window.location.href = href;
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 dark:bg-background/90 backdrop-blur-md border-b border-border dark:border-border/50 shadow-sm dark:shadow-lg dark:shadow-black/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <a
            href="#main-content"
            className="font-serif text-lg sm:text-xl text-foreground hover:text-primary dark:hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            İpek Kökdemir
          </a>

          {/* Desktop Navigation + Toggle Buttons */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-sm text-muted-foreground dark:text-foreground/70 hover:text-foreground dark:hover:text-foreground transition-colors relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}

            {/* Desktop Toggle Buttons - Header içinde */}
            <div className="flex items-center gap-2 ml-2 lg:ml-4 pl-3 lg:pl-4 border-l border-border dark:border-border/50">
              <ThemeToggle isInHeader={true} />
              <LanguageToggle isInHeader={true} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="block text-muted-foreground dark:text-foreground/70 hover:text-foreground dark:hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}
