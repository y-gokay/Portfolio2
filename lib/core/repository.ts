/**
 * Repository Pattern Base Class
 * Centralized data access layer
 */

import { getRedisClient } from "../kv-client";

export abstract class BaseRepository<T> {
  protected abstract getKey(): string;
  protected abstract getDefaultValue(): T;

  /**
   * Get data from KV store
   */
  async get(): Promise<T> {
    const client = await getRedisClient();
    if (!client) {
      console.warn(`Redis not configured. Returning default value for ${this.getKey()}`);
      return this.getDefaultValue();
    }

    try {
      const data = await client.get<T>(this.getKey());
      return data ?? this.getDefaultValue();
    } catch (error) {
      console.error(`KV get error for ${this.getKey()}:`, error);
      return this.getDefaultValue();
    }
  }

  /**
   * Set data to KV store
   */
  async set(data: T): Promise<boolean> {
    const client = await getRedisClient();
    if (!client) {
      console.error(`Redis not configured. Cannot save ${this.getKey()}`);
      return false;
    }

    try {
      await client.set(this.getKey(), data);
      return true;
    } catch (error) {
      console.error(`KV set error for ${this.getKey()}:`, error);
      return false;
    }
  }

  /**
   * Update data (merge with existing)
   */
  async update(updates: Partial<T>): Promise<boolean> {
    const current = await this.get();
    const updated = { ...current, ...updates } as T;
    return this.set(updated);
  }

  /**
   * Delete data
   */
  async delete(): Promise<boolean> {
    const client = await getRedisClient();
    if (!client) {
      console.error(`Redis not configured. Cannot delete ${this.getKey()}`);
      return false;
    }

    try {
      await client.del(this.getKey());
      return true;
    } catch (error) {
      console.error(`KV delete error for ${this.getKey()}:`, error);
      return false;
    }
  }
}
