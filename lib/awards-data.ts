export type AwardItem = {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  organization: {
    tr: string;
    en: string;
  };
  year: string;
  category: "academic" | "competition" | "recognition" | "other";
  description?: {
    tr: string;
    en: string;
  };
};

export type ExhibitionItem = {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  location: {
    tr: string;
    en: string;
  };
  year: string;
  description?: {
    tr: string;
    en: string;
  };
};

export type AwardsData = {
  awards: AwardItem[];
  exhibitions: ExhibitionItem[];
};
