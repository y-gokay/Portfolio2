export type MediaItem = {
  type: "image" | "video";
  url: string;
  thumbnail?: string; // For video thumbnails
};

export type PortfolioItem = {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  category: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  image: string;
  media?: MediaItem[];
  images?: string[];
  video?: string;
  year: string;
  tags: {
    tr: string[];
    en: string[];
  };
};

export const portfolioItems: PortfolioItem[] = [];
