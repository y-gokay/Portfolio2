"use client";

import { motion, AnimatePresence } from "framer-motion";
import FocusLock from "react-focus-lock";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export type AwardExhibitionItem = {
  id: number;
  title: string;
  organization?: string;
  location?: string;
  year: string;
  category?: string;
  description?: string;
  type: "award" | "exhibition";
};

interface AwardExhibitionModalProps {
  item: AwardExhibitionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AwardExhibitionModal({ item, isOpen, onClose }: AwardExhibitionModalProps) {
  const { language } = useLanguage();

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <FocusLock>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="bg-background dark:bg-surface rounded-lg sm:rounded-xl shadow-xl dark:shadow-2xl dark:border dark:border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="sticky top-0 bg-background dark:bg-surface border-b border-border dark:border-border/50 p-4 sm:p-6 flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                    {item.title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary dark:hover:bg-secondary/80"
                    aria-label={language === "tr" ? "Kapat" : "Close"}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Year */}
                  <div>
                    <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium">
                      {language === "tr" ? "Yıl" : "Year"}
                    </span>
                    <p className="text-base sm:text-lg text-foreground mt-1">{item.year}</p>
                  </div>

                  {/* Organization or Location */}
                  {item.organization && (
                    <div>
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium">
                        {language === "tr" ? "Organizasyon" : "Organization"}
                      </span>
                      <p className="text-base sm:text-lg text-foreground mt-1">{item.organization}</p>
                    </div>
                  )}

                  {item.location && (
                    <div>
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium">
                        {language === "tr" ? "Konum" : "Location"}
                      </span>
                      <p className="text-base sm:text-lg text-foreground mt-1">{item.location}</p>
                    </div>
                  )}

                  {/* Category */}
                  {item.category && (
                    <div>
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium">
                        {language === "tr" ? "Kategori" : "Category"}
                      </span>
                      <p className="text-base sm:text-lg text-foreground mt-1">{item.category}</p>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <div>
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-medium block mb-2">
                        {language === "tr" ? "Açıklama" : "Description"}
                      </span>
                      <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </FocusLock>
        </>
      )}
    </AnimatePresence>
  );
}
