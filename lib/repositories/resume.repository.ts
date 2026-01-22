/**
 * Resume Repository
 */

import { BaseRepository } from "../core/repository";
import { ResumeData } from "../resume-data";

export class ResumeRepository extends BaseRepository<ResumeData | null> {
  protected getKey(): string {
    return "resume:data";
  }

  protected getDefaultValue(): ResumeData | null {
    return null;
  }

  /**
   * Get resume data (non-null version)
   */
  async getResume(): Promise<ResumeData> {
    const data = await this.get();
    if (!data) {
      return {
        summary: { tr: "", en: "" },
        experience: [],
        education: [],
        skills: [],
      };
    }
    return data;
  }
}
