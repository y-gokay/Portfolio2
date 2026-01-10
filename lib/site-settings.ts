export type Language = "tr" | "en";

export interface SiteSettings {
  translations: {
    tr: TranslationSet;
    en: TranslationSet;
  };
  socialLinks: SocialLink[];
  metadata: SiteMetadata;
  heroImages: HeroImages;
  sectionVisibility?: {
    hero: boolean;
    about: boolean;
    portfolio: boolean;
    skills: boolean;
    carousel: boolean;
    research: boolean;
    awards: boolean;
    contact: boolean;
  };
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
  about?: {
    title: string;
    story: {
      title: string;
      content: string;
    };
    approach: {
      title: string;
      content: string;
    };
    interests: {
      title: string;
      items: string[];
    };
  };
  skills?: {
    title: string;
    expertise: {
      title: string;
    };
    tools: {
      title: string;
      categories: {
        design: {
          title: string;
          items: string[];
        };
        prototyping: {
          title: string;
          items: string[];
        };
        development: {
          title: string;
          items: string[];
        };
      };
    };
  };
  research?: {
    title: string;
    subtitle: string;
  };
  resume?: {
    title: string;
    download: string;
    experience: {
      title: string;
    };
    education: {
      title: string;
    };
    summary: {
      title: string;
    };
  };
  awards?: {
    title: string;
    subtitle: string;
    awards: string;
    exhibitions: string;
    achievements: string;
  };
  navigation?: {
    home: string;
    about: string;
    portfolio: string;
    skills: string;
    research: string;
    resume: string;
    awards: string;
    contact: string;
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

