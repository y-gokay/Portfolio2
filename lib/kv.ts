import { Redis } from "@upstash/redis";
import { PortfolioItem } from "./portfolio-data";

const PORTFOLIO_KEY = "portfolio:items";

// Upstash Redis client oluştur
// Environment variable'lar Upstash tarafından otomatik olarak eklenir:
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN
// Eğer manuel eklemek isterseniz, KV_REST_API_URL ve KV_REST_API_TOKEN de kullanılabilir
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Redis client oluştur (sadece environment variable'lar varsa)
const kv = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!kv) {
    console.warn("Redis not configured. Returning empty array.");
    return [];
  }
  
  try {
    const items = await kv.get<PortfolioItem[]>(PORTFOLIO_KEY);
    return items || [];
  } catch (error) {
    console.error("KV get error:", error);
    return [];
  }
}

export async function setPortfolioItems(items: PortfolioItem[]): Promise<boolean> {
  if (!kv) {
    console.error("Redis not configured. Cannot save items.");
    return false;
  }
  
  try {
    await kv.set(PORTFOLIO_KEY, items);
    return true;
  } catch (error) {
    console.error("KV set error:", error);
    return false;
  }
}

export async function addPortfolioItem(item: PortfolioItem): Promise<boolean> {
  try {
    const items = await getPortfolioItems();
    items.push(item);
    return await setPortfolioItems(items);
  } catch (error) {
    console.error("KV add error:", error);
    return false;
  }
}

export async function updatePortfolioItem(id: string, updatedItem: PortfolioItem): Promise<boolean> {
  try {
    const items = await getPortfolioItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items[index] = updatedItem;
    return await setPortfolioItems(items);
  } catch (error) {
    console.error("KV update error:", error);
    return false;
  }
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  try {
    const items = await getPortfolioItems();
    const filtered = items.filter((item) => item.id !== id);
    return await setPortfolioItems(filtered);
  } catch (error) {
    console.error("KV delete error:", error);
    return false;
  }
}

