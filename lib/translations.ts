export type Language = "tr" | "en";

export const translations = {
  tr: {
    hero: {
      name: "İpek Kökdemir",
      subtitle: "Grafik Tasarım",
    },
    manifesto: {
      title: "Yaratıcılıkla\ntasarlanmış hikayeler.",
      description:
        "Grafik tasarım öğrencisi olarak, her projede yeni bir hikaye anlatıyorum. Portföyümde, tipografi, renk teorisi ve görsel iletişim alanlarındaki çalışmalarımı keşfedebilirsiniz.",
    },
    features: {
      label: "Yetenekler",
      typography: {
        title: "Tipografi",
        description: "Harflerle anlam yaratma sanatı.",
      },
      layout: {
        title: "Düzen Tasarımı",
        description: "Görsel hiyerarşi ve kompozisyon.",
      },
      color: {
        title: "Renk Teorisi",
        description: "Duyguları renklerle ifade etme.",
      },
    },
    showcase: {
      label: "Portföy",
    },
    carousel: {
      title: "Yaratıcı çalışmalarım.",
    },
    insights: {
      label: "Projeler",
      projects: [
        {
          title: "Görsel Hikaye Anlatımı",
          category: "Tasarım",
          image: "/visual-storytelling-design-article.jpg",
        },
        {
          title: "Tipografi Projeleri",
          category: "Tipografi",
          image: "/typography-trends-modern-fonts.jpg",
        },
        {
          title: "Marka Kimliği Tasarımı",
          category: "Marka",
          image: "/personal-branding-digital-marketing.jpg",
        },
        {
          title: "Düzen Tasarımı Çalışmaları",
          category: "Düzen",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    footer: {
      links: [
        { label: "Portföy", href: "#showcase" },
        { label: "Hakkında", href: "#about" },
        { label: "İletişim", href: "#contact" },
      ],
      contact: {
        title: "Projeleriniz için benimle iletişime geçin.",
        email: "ipek@example.com",
        role: "Grafik Tasarım Öğrencisi",
      },
      copyright: "© 2025 İpek Kökdemir. Tüm hakları saklıdır.",
    },
    modal: {
      videoError: "Video yüklenirken bir hata oluştu",
      retry: "Tekrar Dene",
    },
  },
  en: {
    hero: {
      name: "İpek Kökdemir",
      subtitle: "Graphic Design",
    },
    manifesto: {
      title: "Stories designed\nwith creativity.",
      description:
        "As a graphic design student, I tell a new story with each project. In my portfolio, you can explore my work in typography, color theory, and visual communication.",
    },
    features: {
      label: "Skills",
      typography: {
        title: "Typography",
        description: "The art of creating meaning with letters.",
      },
      layout: {
        title: "Layout Design",
        description: "Visual hierarchy and composition.",
      },
      color: {
        title: "Color Theory",
        description: "Expressing emotions through colors.",
      },
    },
    showcase: {
      label: "Portfolio",
    },
    carousel: {
      title: "My creative work.",
    },
    insights: {
      label: "Projects",
      projects: [
        {
          title: "Visual Storytelling",
          category: "Design",
          image: "/visual-storytelling-design-article.jpg",
        },
        {
          title: "Typography Projects",
          category: "Typography",
          image: "/typography-trends-modern-fonts.jpg",
        },
        {
          title: "Brand Identity Design",
          category: "Brand",
          image: "/personal-branding-digital-marketing.jpg",
        },
        {
          title: "Layout Design Works",
          category: "Layout",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    footer: {
      links: [
        { label: "Portfolio", href: "#showcase" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
      contact: {
        title: "Get in touch with me for your projects.",
        email: "ipek@example.com",
        role: "Graphic Design Student",
      },
      copyright: "© 2025 İpek Kökdemir. All rights reserved.",
    },
    modal: {
      videoError: "An error occurred while loading the video",
      retry: "Retry",
    },
  },
} as const;

export type Translations = typeof translations.tr;
