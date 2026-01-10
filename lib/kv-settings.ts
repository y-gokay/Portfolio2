import { SiteSettings } from "./site-settings";

const SITE_SETTINGS_KEY = "site:settings";

// Upstash Redis client
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Lazy load Redis client to avoid build-time import errors
let kv: any = null;

async function getRedisClient() {
  if (kv !== null) {
    return kv;
  }

  if (!redisUrl || !redisToken) {
    return null;
  }

  try {
    // Dynamic import to avoid build-time errors
    const { Redis } = await import("@upstash/redis");
    kv = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    return kv;
  } catch (error) {
    console.warn("Failed to initialize Redis client:", error);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = await getRedisClient();
  if (!client) {
    console.warn("Redis not configured. Returning null for site settings.");
    return null;
  }
  
  try {
    const settings = await client.get<SiteSettings>(SITE_SETTINGS_KEY);
    return settings;
  } catch (error) {
    console.error("KV get site settings error:", error);
    return null;
  }
}

export async function setSiteSettings(settings: SiteSettings): Promise<boolean> {
  const client = await getRedisClient();
  if (!client) {
    console.error("Redis not configured. Cannot save site settings.");
    return false;
  }
  
  try {
    await client.set(SITE_SETTINGS_KEY, settings);
    return true;
  } catch (error) {
    console.error("KV set site settings error:", error);
    return false;
  }
}

export async function updateSiteSettings(partialSettings: Partial<SiteSettings>): Promise<boolean> {
  if (!kv) {
    console.error("Redis not configured. Cannot update site settings.");
    return false;
  }
  
  try {
    const current = await getSiteSettings();
    if (!current) {
      return false;
    }
    
    const updated: SiteSettings = {
      ...current,
      ...partialSettings,
      translations: partialSettings.translations || current.translations,
      socialLinks: partialSettings.socialLinks || current.socialLinks,
      metadata: {
        ...current.metadata,
        ...(partialSettings.metadata || {}),
      },
      heroImages: partialSettings.heroImages || current.heroImages,
    };
    
    return await setSiteSettings(updated);
  } catch (error) {
    console.error("KV update site settings error:", error);
    return false;
  }
}

