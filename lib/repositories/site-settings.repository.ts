/**
 * Site Settings Repository
 */

import { BaseRepository } from "../core/repository";
import { SiteSettings } from "../site-settings";
import { defaultSiteSettings } from "../default-site-settings";

export class SiteSettingsRepository extends BaseRepository<SiteSettings> {
  protected getKey(): string {
    return "site:settings";
  }

  protected getDefaultValue(): SiteSettings {
    return defaultSiteSettings;
  }

  /**
   * Get site settings with fallback to defaults
   */
  async getSettings(): Promise<SiteSettings> {
    const settings = await this.get();
    // Merge with defaults to ensure all fields exist
    return {
      ...defaultSiteSettings,
      ...settings,
      translations: {
        tr: { ...defaultSiteSettings.translations.tr, ...settings.translations?.tr },
        en: { ...defaultSiteSettings.translations.en, ...settings.translations?.en },
      },
    };
  }

  /**
   * Update specific section of settings
   */
  async updateSection<K extends keyof SiteSettings>(
    section: K,
    data: SiteSettings[K]
  ): Promise<boolean> {
    const current = await this.getSettings();
    return this.set({
      ...current,
      [section]: data,
    });
  }
}
