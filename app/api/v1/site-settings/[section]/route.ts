/**
 * Site Settings Section API Routes (v1)
 * For managing individual sections (hero, about, skills, etc.)
 */

import { NextRequest } from "next/server";
import { ApiHandler } from "@/lib/core/api-handler";
import { SiteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { SiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repository = new SiteSettingsRepository();

type SectionKey = keyof SiteSettings;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section: sectionName } = await params;
  return ApiHandler.GET(async () => {
    const settings = await repository.getSettings();

    // Handle special cases
    if (sectionName === "hero") {
      return {
        heroImages: settings.heroImages,
        manifesto: {
          tr: settings.translations.tr.manifesto,
          en: settings.translations.en.manifesto,
        },
      };
    }

    if (sectionName === "about") {
      return {
        about: {
          tr: settings.translations.tr.about,
          en: settings.translations.en.about,
        },
      };
    }

    if (sectionName === "skills") {
      return {
        skills: {
          tr: settings.translations.tr.skills,
          en: settings.translations.en.skills,
        },
      };
    }

    if (sectionName === "research") {
      return {
        research: {
          tr: settings.translations.tr.research,
          en: settings.translations.en.research,
        },
      };
    }

    if (sectionName === "contact") {
      return {
        footer: {
          tr: settings.translations.tr.footer,
          en: settings.translations.en.footer,
        },
      };
    }

    const section = sectionName as SectionKey;
    if (!(section in settings)) {
      throw new Error(`Section '${sectionName}' not found`);
    }

    return {
      [section]: settings[section],
    };
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section: sectionName } = await params;
  return ApiHandler.PUT<any>(request, async (data) => {
    const settings = await repository.getSettings();

    // Handle special cases for nested translations
    if (sectionName === "hero") {
      const updated: SiteSettings = {
        ...settings,
        heroImages: data.heroImages || settings.heroImages,
        translations: {
          tr: {
            ...settings.translations.tr,
            manifesto: data.manifesto?.tr || settings.translations.tr.manifesto,
          },
          en: {
            ...settings.translations.en,
            manifesto: data.manifesto?.en || settings.translations.en.manifesto,
          },
        },
      };
      await repository.set(updated);
      return updated;
    }

    if (sectionName === "about") {
      const updated: SiteSettings = {
        ...settings,
        translations: {
          tr: {
            ...settings.translations.tr,
            about: data.about?.tr || settings.translations.tr.about,
          },
          en: {
            ...settings.translations.en,
            about: data.about?.en || settings.translations.en.about,
          },
        },
      };
      await repository.set(updated);
      return updated;
    }

    if (sectionName === "skills") {
      const updated: SiteSettings = {
        ...settings,
        translations: {
          tr: {
            ...settings.translations.tr,
            skills: data.skills?.tr || settings.translations.tr.skills,
          },
          en: {
            ...settings.translations.en,
            skills: data.skills?.en || settings.translations.en.skills,
          },
        },
      };
      await repository.set(updated);
      return updated;
    }

    if (sectionName === "research") {
      const updated: SiteSettings = {
        ...settings,
        translations: {
          tr: {
            ...settings.translations.tr,
            research: data.research?.tr || settings.translations.tr.research,
          },
          en: {
            ...settings.translations.en,
            research: data.research?.en || settings.translations.en.research,
          },
        },
      };
      await repository.set(updated);
      return updated;
    }

    if (sectionName === "contact") {
      const updated: SiteSettings = {
        ...settings,
        translations: {
          tr: {
            ...settings.translations.tr,
            footer: data.footer?.tr || settings.translations.tr.footer,
          },
          en: {
            ...settings.translations.en,
            footer: data.footer?.en || settings.translations.en.footer,
          },
        },
      };
      await repository.set(updated);
      return updated;
    }

    const section = sectionName as SectionKey;
    await repository.updateSection(section, data);

    const updated = await repository.getSettings();
    return updated;
  });
}
