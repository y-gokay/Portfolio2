/**
 * Portfolio Repository
 */

import { BaseRepository } from "../core/repository";
import { PortfolioItem } from "../portfolio-data";

export class PortfolioRepository extends BaseRepository<PortfolioItem[]> {
  protected getKey(): string {
    return "portfolio:items";
  }

  protected getDefaultValue(): PortfolioItem[] {
    return [];
  }

  /**
   * Get portfolio item by ID
   */
  async getById(id: string): Promise<PortfolioItem | null> {
    const items = await this.get();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Add portfolio item
   */
  async addItem(item: PortfolioItem): Promise<boolean> {
    const items = await this.get();
    // Check if ID already exists
    if (items.some((i) => i.id === item.id)) {
      throw new Error(`Portfolio item with ID ${item.id} already exists`);
    }
    items.push(item);
    return this.set(items);
  }

  /**
   * Update portfolio item
   */
  async updateItem(id: string, updatedItem: PortfolioItem): Promise<boolean> {
    const items = await this.get();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Portfolio item with ID ${id} not found`);
    }
    items[index] = updatedItem;
    return this.set(items);
  }

  /**
   * Delete portfolio item
   */
  async deleteItem(id: string): Promise<boolean> {
    const items = await this.get();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) {
      throw new Error(`Portfolio item with ID ${id} not found`);
    }
    return this.set(filtered);
  }
}
