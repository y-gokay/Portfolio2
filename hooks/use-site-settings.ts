"use client";

import { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/site-settings";
import { defaultSiteSettings } from "@/lib/default-site-settings";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings");
        const result = await response.json();
        if (result.success && result.data) {
          setSettings(result.data);
        } else {
          // Fallback to default settings
          setSettings(defaultSiteSettings);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
        // Fallback to default settings
        setSettings(defaultSiteSettings);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Get section visibility, defaulting to true if not set
  const getSectionVisibility = (sectionKey: keyof SiteSettings["sectionVisibility"]): boolean => {
    if (!settings?.sectionVisibility) return true;
    return settings.sectionVisibility[sectionKey] ?? true;
  };

  return {
    settings,
    loading,
    getSectionVisibility,
  };
}
