/**
 * Centralized Redis/KV client management
 * Prevents duplicate client initialization across modules
 */

let redisClient: any = null;
let redisPromise: Promise<any> | null = null;

/**
 * Get or initialize Redis client (singleton pattern)
 */
export async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  if (redisPromise) {
    return redisPromise;
  }

  redisPromise = (async () => {
    try {
      const { Redis } = await import("@upstash/redis");
      
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
      const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();

      if (!redisUrl || !redisToken) {
        console.warn("Redis not configured. UPSTASH_REDIS_REST_URL ve UPSTASH_REDIS_REST_TOKEN environment değişkenleri gerekli");
        redisPromise = null;
        return null;
      }

      redisClient = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      return redisClient;
    } catch (error) {
      redisPromise = null;
      console.warn("Failed to initialize Redis client:", error);
      return null;
    }
  })();

  return redisPromise;
}

/**
 * Reset Redis client (useful for testing)
 */
export function resetRedisClient() {
  redisClient = null;
  redisPromise = null;
}
