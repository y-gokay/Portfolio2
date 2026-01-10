"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Linkedin, 
  Mail, 
  YoutubeIcon, 
  Twitter,
  Facebook,
  Github
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { SocialLink as SocialLinkType } from "@/lib/site-settings";

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  ariaLabel: string;
}

const iconMap = {
  instagram: Instagram,
  youtube: YoutubeIcon,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  facebook: Facebook,
  github: Github,
};

export function SocialLinks() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const getSocialLinks = (): SocialLink[] => {
    if (!settings?.socialLinks) {
      // Fallback to default
      return [
        {
          name: "Instagram",
          icon: Instagram,
          href: "https://instagram.com/ipekkokdemir",
          ariaLabel: "Instagram",
        },
        {
          name: "Youtube",
          icon: YoutubeIcon,
          href: "https://youtube.com/ipekkokdemir",
          ariaLabel: "Youtube",
        },
        {
          name: "LinkedIn",
          icon: Linkedin,
          href: "https://linkedin.com/in/ipekkokdemir",
          ariaLabel: "LinkedIn",
        },
        {
          name: "Email",
          icon: Mail,
          href: `mailto:${t.footer.contact.email}`,
          ariaLabel: language === "tr" ? "E-posta gönder" : "Send email",
        },
      ];
    }

    // Filter enabled links and sort by order
    const enabledLinks = settings.socialLinks
      .filter((link) => link.enabled)
      .sort((a, b) => a.order - b.order);

    return enabledLinks.map((link) => {
      const Icon = iconMap[link.icon] || Instagram;
      const href = link.icon === "email" 
        ? `mailto:${settings.translations[language].footer.contact.email}` 
        : link.href;

      return {
        name: link.name,
        icon: Icon,
        href,
        ariaLabel: link.ariaLabel[language] || link.name,
      };
    });
  };

  const socialLinks = getSocialLinks();

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.name !== "Email" ? "_blank" : undefined}
            rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
            aria-label={link.ariaLabel}
            className="p-3 rounded-full bg-secondary dark:bg-secondary/80 dark:border dark:border-primary/20 hover:bg-accent dark:hover:bg-accent/80 transition-colors text-foreground shadow-sm dark:shadow-md dark:shadow-primary/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5" />
          </motion.a>
        );
      })}
    </div>
  );
}
