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
  image: string; // Main thumbnail/image
  media?: MediaItem[]; // Can include both images and videos
  images?: string[]; // Legacy support - will be converted to media
  video?: string; // Legacy support - single video URL
  year: string;
  tags: {
    tr: string[];
    en: string[];
  };
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: {
      tr: "Görsel Hikaye Anlatımı",
      en: "Visual Storytelling",
    },
    category: {
      tr: "Tasarım",
      en: "Design",
    },
    description: {
      tr: "Bu projede, görsel hikaye anlatımının gücünü keşfettim. Tipografi, renk ve kompozisyon kullanarak duygusal bir deneyim yarattım. Her görsel, izleyiciyi farklı bir hikayeye götürüyor.",
      en: "In this project, I explored the power of visual storytelling. I created an emotional experience using typography, color, and composition. Each visual takes the viewer on a different journey.",
    },
    image: "/visual-storytelling-design-article.jpg",
    media: [
      {
        type: "image",
        url: "/visual-storytelling-design-article.jpg",
      },
      {
        type: "image",
        url: "/typography-trends-modern-fonts.jpg",
      },
      {
        type: "image",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Example video URL
        thumbnail: "/personal-branding-digital-marketing.jpg",
      },
    ],
    year: "2024",
    tags: {
      tr: ["Tipografi", "Renk Teorisi", "Kompozisyon"],
      en: ["Typography", "Color Theory", "Composition"],
    },
  },
  {
    id: "2",
    title: {
      tr: "Tipografi Projeleri",
      en: "Typography Projects",
    },
    category: {
      tr: "Tipografi",
      en: "Typography",
    },
    description: {
      tr: "Harflerin gücünü araştırdığım bir seri. Farklı font aileleri ve düzenlemelerle, tipografinin nasıl bir mesajı güçlendirebileceğini gösterdim.",
      en: "A series exploring the power of letters. Through different font families and arrangements, I demonstrated how typography can amplify a message.",
    },
    image: "/typography-trends-modern-fonts.jpg",
    images: [
      "/typography-trends-modern-fonts.jpg",
      "/visual-storytelling-design-article.jpg",
    ],
    year: "2024",
    tags: {
      tr: ["Tipografi", "Düzen", "Tipografi Tasarımı"],
      en: ["Typography", "Layout", "Type Design"],
    },
  },
  {
    id: "3",
    title: {
      tr: "Marka Kimliği Tasarımı",
      en: "Brand Identity Design",
    },
    category: {
      tr: "Marka",
      en: "Brand",
    },
    description: {
      tr: "Modern ve etkileyici bir marka kimliği oluşturdum. Logo tasarımından renk paletine, her detay markanın hikayesini anlatıyor.",
      en: "I created a modern and compelling brand identity. From logo design to color palette, every detail tells the brand's story.",
    },
    image: "/personal-branding-digital-marketing.jpg",
    images: [
      "/personal-branding-digital-marketing.jpg",
      "/visual-storytelling-design-article.jpg",
    ],
    year: "2024",
    tags: {
      tr: ["Marka", "Logo Tasarımı", "Kimlik"],
      en: ["Brand", "Logo Design", "Identity"],
    },
  },
  {
    id: "4",
    title: {
      tr: "Düzen Tasarımı Çalışmaları",
      en: "Layout Design Works",
    },
    category: {
      tr: "Düzen",
      en: "Layout",
    },
    description: {
      tr: "Görsel hiyerarşi ve kompozisyon prensiplerini kullanarak etkili düzenler oluşturdum. Her düzen, içeriği en iyi şekilde sunmak için tasarlandı.",
      en: "I created effective layouts using visual hierarchy and composition principles. Each layout is designed to present content in the best possible way.",
    },
    image: "/modern-architecture-building-exterior-minimal.jpg",
    images: [
      "/modern-architecture-building-exterior-minimal.jpg",
      "/fashion-model-editorial-portrait-dramatic-lighting.jpg",
    ],
    year: "2024",
    tags: {
      tr: ["Düzen", "Kompozisyon", "Görsel Hiyerarşi"],
      en: ["Layout", "Composition", "Visual Hierarchy"],
    },
  },
];
