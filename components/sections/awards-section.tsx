"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Award, Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";
import { AwardExhibitionModal } from "@/components/award-exhibition-modal";
import { useAwards } from "@/hooks/use-awards";
import { AwardItem, ExhibitionItem } from "@/lib/awards-data";

export function AwardsSection() {
  const { t, language } = useLanguage();
  const { awardsData, loading, error } = useAwards();
  const [showAllAwards, setShowAllAwards] = useState(false);
  const [showAllExhibitions, setShowAllExhibitions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: AwardItem | ExhibitionItem; type: "award" | "exhibition" } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (itemId: string, type: "award" | "exhibition") => {
    if (type === "award") {
      const kvAward = awardsData.awards.find(a => a.id === itemId);
      if (kvAward) {
        setSelectedItem({ item: kvAward, type });
        setIsModalOpen(true);
      }
    } else {
      const kvExhibition = awardsData.exhibitions.find(e => e.id === itemId);
      if (kvExhibition) {
        setSelectedItem({ item: kvExhibition, type });
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (loading) {
    return (
      <section
        id="awards"
        className="bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-foreground/70">
              {language === "tr" ? "Yükleniyor..." : "Loading..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Convert KV data format to display format (for rendering)
  const displayAwards = awardsData.awards.map((award) => ({
    id: award.id,
    title: award.title[language],
    organization: award.organization[language],
    year: award.year,
    category: award.category,
    description: award.description ? award.description[language] : undefined,
  }));

  const displayExhibitions = awardsData.exhibitions.map((exhibition) => ({
    id: exhibition.id,
    title: exhibition.title[language],
    location: exhibition.location[language],
    year: exhibition.year,
    description: exhibition.description ? exhibition.description[language] : undefined,
  }));

  if (error || (displayAwards.length === 0 && displayExhibitions.length === 0)) {
    return (
      <section
        id="awards"
        className="bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
              {error || (language === "tr" ? "Henüz ödül veya sergi eklenmemiş." : "No awards or exhibitions added yet.")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayedAwards = showAllAwards ? displayAwards : displayAwards.slice(0, 3);
  const displayedExhibitions = showAllExhibitions ? displayExhibitions : displayExhibitions.slice(0, 3);

  const getAwardIcon = (category: string) => {
    switch (category) {
      case "academic":
        return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />;
      case "competition":
        return <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />;
      default:
        return <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />;
    }
  };

  return (
    <section
      id="awards"
      className="bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <p className="text-muted-foreground dark:text-foreground/60 text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3 text-center sm:text-left">
            {t.awards.title}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 text-center sm:text-left">
            {t.awards.subtitle}
          </p>
        </motion.div>

        {/* Awards */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-6 sm:mb-8">
            {t.awards.awards}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedAwards.map((award, index) => (
              <motion.div
                key={award.id}
                className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8 flex flex-col cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleItemClick(award.id, "award")}
                data-clickable
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getAwardIcon(award.category)}
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {award.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70 mb-2">
                  {award.organization}
                </p>
                <p className="text-xs sm:text-sm text-primary font-medium mt-auto">
                  {award.year}
                </p>
                {award.description && (
                  <p className="text-xs text-muted-foreground dark:text-foreground/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {language === "tr" ? "Detaylar için tıklayın" : "Click for details"}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Show More/Less Button for Awards */}
          {displayAwards.length > 3 && (
            <motion.div
              className="mt-6 sm:mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setShowAllAwards(!showAllAwards)}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 text-foreground rounded-lg sm:rounded-xl hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
              >
                <span className="text-sm sm:text-base font-medium">
                  {showAllAwards 
                    ? (language === "tr" ? "Daha Az Göster" : "Show Less")
                    : (language === "tr" ? "Tümünü Göster" : "Show All")
                  }
                </span>
                {showAllAwards ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Exhibitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-6 sm:mb-8">
            {t.awards.exhibitions}
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {displayedExhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                className="bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 rounded-lg sm:rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ paddingLeft: 24, paddingRight: 24 }}
                onClick={() => handleItemClick(exhibition.id, "exhibition")}
                data-clickable
              >
                <div className="flex-1">
                  <h3 className="font-serif text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {exhibition.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground dark:text-foreground/70">
                    {exhibition.location}
                  </p>
                  {exhibition.description && (
                    <p className="text-xs text-muted-foreground dark:text-foreground/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === "tr" ? "Detaylar için tıklayın" : "Click for details"}
                    </p>
                  )}
                </div>
                <p className="text-sm sm:text-base text-primary font-medium flex-shrink-0">
                  {exhibition.year}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Show More/Less Button for Exhibitions */}
          {displayExhibitions.length > 3 && (
            <motion.div
              className="mt-6 sm:mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setShowAllExhibitions(!showAllExhibitions)}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 text-foreground rounded-lg sm:rounded-xl hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors"
              >
                <span className="text-sm sm:text-base font-medium">
                  {showAllExhibitions 
                    ? (language === "tr" ? "Daha Az Göster" : "Show Less")
                    : (language === "tr" ? "Tümünü Göster" : "Show All")
                  }
                </span>
                {showAllExhibitions ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <AwardExhibitionModal
          item={{
            id: selectedItem.item.id,
            title: selectedItem.item.title[language],
            organization: selectedItem.type === "award" ? (selectedItem.item as AwardItem).organization[language] : undefined,
            location: selectedItem.type === "exhibition" ? (selectedItem.item as ExhibitionItem).location[language] : undefined,
            year: selectedItem.item.year,
            category: selectedItem.type === "award" ? (selectedItem.item as AwardItem).category : undefined,
            description: selectedItem.item.description ? selectedItem.item.description[language] : undefined,
            type: selectedItem.type,
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
