import { SiteSettings } from "./site-settings";

export const defaultSiteSettings: SiteSettings = {
  translations: {
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
  },
  socialLinks: [
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      href: "https://instagram.com/ipekkokdemir",
      ariaLabel: {
        tr: "Instagram",
        en: "Instagram",
      },
      enabled: true,
      order: 1,
    },
    {
      id: "youtube",
      name: "Youtube",
      icon: "youtube",
      href: "https://youtube.com/ipekkokdemir",
      ariaLabel: {
        tr: "Youtube",
        en: "Youtube",
      },
      enabled: true,
      order: 2,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "linkedin",
      href: "https://linkedin.com/in/ipekkokdemir",
      ariaLabel: {
        tr: "LinkedIn",
        en: "LinkedIn",
      },
      enabled: true,
      order: 3,
    },
    {
      id: "email",
      name: "Email",
      icon: "email",
      href: "mailto:ipek@example.com",
      ariaLabel: {
        tr: "E-posta gönder",
        en: "Send email",
      },
      enabled: true,
      order: 4,
    },
  ],
  metadata: {
    title: {
      default: "İpek Kökdemir – Grafik Tasarım Portföyü",
      template: "%s | İpek Kökdemir",
    },
    description:
      "Grafik tasarım öğrencisi İpek Kökdemir'in yaratıcı çalışmalarını keşfedin. Tipografi, renk teorisi ve görsel iletişim alanlarındaki projeler.",
    keywords: [
      "grafik tasarım",
      "portfolio",
      "tasarım",
      "tipografi",
      "renk teorisi",
      "görsel iletişim",
      "İpek Kökdemir",
    ],
    author: "İpek Kökdemir",
    siteName: "İpek Kökdemir",
    ogImage: "/og-image.jpg",
    twitterHandle: "@ipekkokdemir",
    twitterImage: "/twitter-image.jpg",
  },
};

