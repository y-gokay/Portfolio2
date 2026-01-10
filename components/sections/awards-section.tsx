"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { Award, Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";
import { AwardExhibitionModal } from "@/components/award-exhibition-modal";

type AwardItem = {
  id: number;
  title: string;
  organization: string;
  year: string;
  category: string;
  description?: string;
};

type ExhibitionItem = {
  id: number;
  title: string;
  location: string;
  year: string;
  description?: string;
};

export function AwardsSection() {
  const { t, language } = useLanguage();
  const [showAllAwards, setShowAllAwards] = useState(false);
  const [showAllExhibitions, setShowAllExhibitions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: AwardItem | ExhibitionItem; type: "award" | "exhibition" } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample awards data - this should come from a data source in production
  const awards: AwardItem[] = [
    {
      id: 1,
      title: language === "tr" ? "En İyi Tasarım Öğrencisi Ödülü" : "Best Design Student Award",
      organization: language === "tr" ? "Üniversite Grafik Tasarım Bölümü" : "University Graphic Design Department",
      year: "2024",
      category: "academic",
      description: language === "tr" 
        ? "Grafik tasarım bölümünde akademik başarı ve yaratıcı çalışmalarım nedeniyle bu ödüle layık görüldüm." 
        : "I was awarded this prize for my academic achievements and creative work in the graphic design department.",
    },
    {
      id: 2,
      title: language === "tr" ? "Tipografi Yarışması Birincilik" : "Typography Competition First Place",
      organization: language === "tr" ? "Ulusal Tasarım Festivali" : "National Design Festival",
      year: "2023",
      category: "competition",
      description: language === "tr" 
        ? "Tipografi alanındaki yaratıcı yaklaşımım ve teknik yetkinliğim ile birincilik ödülünü kazandım." 
        : "I won first place with my creative approach and technical competence in typography.",
    },
    {
      id: 3,
      title: language === "tr" ? "Yılın Genç Tasarımcısı" : "Young Designer of the Year",
      organization: language === "tr" ? "Yerel Tasarım Derneği" : "Local Design Association",
      year: "2023",
      category: "recognition",
    },
    {
      id: 4,
      title: language === "tr" ? "Yaratıcı Tasarım Ödülü" : "Creative Design Award",
      organization: language === "tr" ? "Dijital Tasarım Ajansı" : "Digital Design Agency",
      year: "2022",
      category: "competition",
      description: language === "tr" 
        ? "Yaratıcı ve yenilikçi tasarım çalışmalarım nedeniyle bu ödüle layık görüldüm." 
        : "I was awarded this prize for my creative and innovative design work.",
    },
    {
      id: 5,
      title: language === "tr" ? "En İyi Portföy Tasarımı" : "Best Portfolio Design",
      organization: language === "tr" ? "Web Tasarım Yarışması" : "Web Design Competition",
      year: "2022",
      category: "competition",
    },
  ];

  const exhibitions: ExhibitionItem[] = [
    {
      id: 1,
      title: language === "tr" ? "Öğrenci Tasarım Sergisi" : "Student Design Exhibition",
      location: language === "tr" ? "Üniversite Galerisi, İstanbul" : "University Gallery, Istanbul",
      year: "2024",
      description: language === "tr" 
        ? "Öğrenci çalışmalarının sergilendiği bu etkinlikte, tipografi ve görsel iletişim projelerim yer aldı." 
        : "My typography and visual communication projects were featured in this event showcasing student work.",
    },
    {
      id: 2,
      title: language === "tr" ? "Genç Tasarımcılar Buluşması" : "Young Designers Meetup",
      location: language === "tr" ? "Modern Sanat Müzesi, Ankara" : "Modern Art Museum, Ankara",
      year: "2023",
      description: language === "tr" 
        ? "Genç tasarımcıların eserlerinin sergilendiği bu etkinlikte, marka kimliği tasarımlarım sergilendi." 
        : "My brand identity designs were exhibited in this event showcasing works by young designers.",
    },
    {
      id: 3,
      title: language === "tr" ? "Dijital Tasarım Fuarı" : "Digital Design Fair",
      location: language === "tr" ? "Tasarım Merkezi, İzmir" : "Design Center, Izmir",
      year: "2023",
    },
    {
      id: 4,
      title: language === "tr" ? "Tipografi Sergisi" : "Typography Exhibition",
      location: language === "tr" ? "Sanat Galerisi, Bursa" : "Art Gallery, Bursa",
      year: "2022",
    },
  ];

  const handleItemClick = (item: AwardItem | ExhibitionItem, type: "award" | "exhibition") => {
    setSelectedItem({ item, type });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const displayedAwards = showAllAwards ? awards : awards.slice(0, 3);
  const displayedExhibitions = showAllExhibitions ? exhibitions : exhibitions.slice(0, 3);

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
                onClick={() => handleItemClick(award, "award")}
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
          {awards.length > 3 && (
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
                onClick={() => handleItemClick(exhibition, "exhibition")}
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
          {exhibitions.length > 3 && (
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
            title: selectedItem.item.title,
            organization: selectedItem.type === "award" ? (selectedItem.item as AwardItem).organization : undefined,
            location: selectedItem.type === "exhibition" ? (selectedItem.item as ExhibitionItem).location : undefined,
            year: selectedItem.item.year,
            category: selectedItem.type === "award" ? (selectedItem.item as AwardItem).category : undefined,
            description: selectedItem.item.description,
            type: selectedItem.type,
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
