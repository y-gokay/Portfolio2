/**
 * Awards Repository
 */

import { BaseRepository } from "../core/repository";
import { AwardsData } from "../awards-data";

export class AwardsRepository extends BaseRepository<AwardsData> {
  protected getKey(): string {
    return "awards:data";
  }

  protected getDefaultValue(): AwardsData {
    return { awards: [], exhibitions: [] };
  }

  /**
   * Get awards only
   */
  async getAwards() {
    const data = await this.get();
    return data.awards;
  }

  /**
   * Get exhibitions only
   */
  async getExhibitions() {
    const data = await this.get();
    return data.exhibitions;
  }

  /**
   * Update awards
   */
  async updateAwards(awards: AwardsData["awards"]): Promise<boolean> {
    const data = await this.get();
    return this.set({ ...data, awards });
  }

  /**
   * Update exhibitions
   */
  async updateExhibitions(exhibitions: AwardsData["exhibitions"]): Promise<boolean> {
    const data = await this.get();
    return this.set({ ...data, exhibitions });
  }
}
