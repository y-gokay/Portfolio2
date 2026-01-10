export type Language = "tr" | "en";

export interface SiteSettings {
  translations: {
    tr: TranslationSet;
    en: TranslationSet;
  };
  socialLinks: SocialLink[];
  metadata: SiteMetadata;
  heroImages: HeroImages;
}

export interface TranslationSet {
  hero: {
    name: string;
    subtitle: string;
  };
  manifesto: {
    title: string;
    description: string;
  };
  features: {
    label: string;
    typography: {
      title: string;
      description: string;
    };
    layout: {
      title: string;
      description: string;
    };
    color: {
      title: string;
      description: string;
    };
  };
  showcase: {
    label: string;
  };
  carousel: {
    title: string;
  };
  insights: {
    label: string;
  };
  footer: {
    links: Array<{ label: string; href: string }>;
    contact: {
      title: string;
      email: string;
      role: string;
    };
    copyright: string;
  };
  modal: {
    videoError: string;
    retry: string;
  };
}

export interface SocialLink {
  id: string;
  name: string;
  icon: "instagram" | "youtube" | "linkedin" | "email" | "twitter" | "facebook" | "github";
  href: string;
  ariaLabel: {
    tr: string;
    en: string;
  };
  enabled: boolean;
  order: number;
}

export interface SiteMetadata {
  title: {
    default: string;
    template: string;
  };
  description: string;
  keywords: string[];
  author: string;
  siteName: string;
  ogImage: string;
  twitterHandle: string;
  twitterImage: string;
}

export interface HeroImages {
  image1: string; // Left/First image
  image2: string; // Center/Second image
  image3: string; // Background/Third image
}

