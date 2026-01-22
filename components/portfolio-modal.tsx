"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FocusLock from "react-focus-lock";
import { useSwipeable } from "react-swipeable";
import { X, ChevronLeft, ChevronRight, Play, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PortfolioItem, MediaItem } from "@/lib/portfolio-data";

// Dynamic import for ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface PortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PortfolioModal({ item, isOpen, onClose }: PortfolioModalProps) {
  const { t, language } = useLanguage();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Convert legacy format to new media format
  const getMediaItems = (): MediaItem[] => {
    if (!item) return [];

    if (item.media) {
      return item.media;
    }

    // Legacy support: convert images array to media items
    const images = item.images || [item.image];
    const mediaItems: MediaItem[] = images.map((url) => ({
      type: "image",
      url,
    }));

    // Add video if exists (legacy support)
    if (item.video) {
      mediaItems.push({
        type: "video",
        url: item.video,
      });
    }

    return mediaItems;
  };

  const mediaItems = getMediaItems();
  const currentMedia = mediaItems[currentMediaIndex] || null;

  // Focus trap - focus first focusable element when modal opens
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Helper functions (defined before hooks to avoid dependency issues)
  const nextMedia = () => {
    if (!item) return;
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
    setIsPlaying(false);
  };

  const prevMedia = () => {
    if (!item) return;
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
    setIsPlaying(false);
    setVideoError(null);
  };

  // Swipe handlers - must be called before early return
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (mediaItems.length > 1) nextMedia();
    },
    onSwipedRight: () => {
      if (mediaItems.length > 1) prevMedia();
    },
    trackMouse: true,
  });

  // Reset playing state when media changes
  useEffect(() => {
    if (!item || !currentMedia) {
      setIsPlaying(false);
      return;
    }

    if (currentMedia.type === "video") {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentMediaIndex, currentMedia, item]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Arrow keys for navigation (only if multiple media items)
      if (mediaItems.length > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevMedia();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nextMedia();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mediaItems.length, onClose, item]);

  // Focus trap - focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Early return after all hooks
  if (!item || !currentMedia) return null;

  const title = item.title[language];
  const category = item.category[language];
  const description = item.description[language];
  const tags = item.tags[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <FocusLock>
            <motion.div
              ref={modalRef}
              className="fixed inset-0 md:inset-4 lg:inset-8 z-50 mx-auto max-w-7xl overflow-hidden rounded-none md:rounded-2xl bg-background shadow-2xl dark:shadow-primary/20 dark:border dark:border-primary/20"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 dark:bg-background/95 dark:border dark:border-primary/30 backdrop-blur-md text-foreground transition-all hover:bg-accent dark:hover:bg-accent/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background shadow-lg"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex h-full max-h-[95vh] flex-col lg:flex-row overflow-hidden">
                {/* Media Gallery - Left Side (Desktop) / Top (Mobile) */}
                <div
                  {...swipeHandlers}
                  className="relative w-full lg:w-1/2 h-[50vh] lg:h-full shrink-0 bg-secondary dark:bg-secondary/80"
                >
                  <AnimatePresence mode="wait">
                    {currentMedia && currentMedia.type === "image" ? (
                      <motion.div
                        key={`image-${currentMediaIndex}`}
                        className="relative h-full w-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={currentMedia.url}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                          className="object-cover"
                          quality={90}
                          priority={currentMediaIndex === 0}
                        />
                      </motion.div>
                    ) : currentMedia && currentMedia.type === "video" ? (
                      <motion.div
                        key={`video-${currentMediaIndex}`}
                        className="relative h-full w-full bg-black"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute inset-0">
                          {videoError ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                              <p className="text-destructive mb-2">
                                {t.modal?.videoError ||
                                  "Video yüklenirken bir hata oluştu"}
                              </p>
                              <button
                                onClick={() => {
                                  setVideoError(null);
                                  setIsPlaying(true);
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mt-4"
                              >
                                {t.modal?.retry || "Tekrar Dene"}
                              </button>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            <ReactPlayer
                              url={currentMedia.url}
                              playing={isPlaying}
                              controls
                              width="100%"
                              height="100%"
                              className="react-player"
                              light={currentMedia.thumbnail || item.image}
                              playIcon={
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-lg hover:bg-background transition-colors">
                                  <Play
                                    className="h-8 w-8 ml-1"
                                    fill="currentColor"
                                  />
                                </div>
                              }
                              onError={(error: any) => {
                                console.error("Video error:", error);
                                setVideoError(
                                  error?.message || "Video yüklenemedi"
                                );
                                setIsPlaying(false);
                              }}
                              {...({} as any)}
                            />
                          )}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Media Navigation */}
                  {mediaItems.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevMedia();
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 dark:bg-background/95 dark:border dark:border-primary/30 backdrop-blur-md text-foreground transition-all hover:bg-accent dark:hover:bg-accent/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background shadow-lg"
                        aria-label="Previous media"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextMedia();
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 dark:bg-background/95 dark:border dark:border-primary/30 backdrop-blur-md text-foreground transition-all hover:bg-accent dark:hover:bg-accent/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background shadow-lg"
                        aria-label="Next media"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Media Indicators */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
                        {mediaItems.map((media, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentMediaIndex(index);
                            }}
                            className={`h-2.5 rounded-full transition-all relative ${
                              index === currentMediaIndex
                                ? "w-10 bg-foreground dark:bg-primary shadow-md"
                                : "w-2.5 bg-foreground/40 dark:bg-foreground/60 hover:bg-foreground/60 dark:hover:bg-foreground/80"
                            }`}
                            aria-label={`Go to ${media.type} ${index + 1}`}
                          >
                            {media.type === "video" && (
                              <Play className="absolute inset-0 h-full w-full p-0.5 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Content - Right Side (Desktop) / Bottom (Mobile) */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16">
                  <div className="mx-auto max-w-2xl lg:max-w-none">
                    {/* Header - All info visible at once */}
                    <div className="mb-8 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <span className="text-sm uppercase tracking-widest text-muted-foreground dark:text-foreground/60 font-medium">
                          {category}
                        </span>
                        <span className="text-lg font-serif text-foreground/80 dark:text-foreground/70">
                          {item.year}
                        </span>
                      </div>
                      <h2
                        id="modal-title"
                        className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight"
                      >
                        {title}
                      </h2>
                    </div>

                    {/* Description - Larger and more readable */}
                    <div className="mb-10">
                      <p
                        id="modal-description"
                        className="text-xl md:text-2xl leading-relaxed text-muted-foreground dark:text-foreground/80 font-light"
                      >
                        {description}
                      </p>
                    </div>

                    {/* Tags - Larger and more prominent */}
                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 px-6 py-3 text-base text-foreground shadow-sm dark:shadow-md dark:shadow-primary/10 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </FocusLock>
        </>
      )}
    </AnimatePresence>
  );
}
