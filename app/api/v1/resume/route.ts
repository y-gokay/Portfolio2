/**
 * Resume API Routes (v1)
 * Clean architecture implementation
 */

import { NextRequest } from "next/server";
import { ApiHandler } from "@/lib/core/api-handler";
import { ResumeRepository } from "@/lib/repositories/resume.repository";
import { ResumeData } from "@/lib/resume-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repository = new ResumeRepository();

export async function GET() {
  return ApiHandler.GET(() => repository.getResume(), {
    defaultOnError: {
      summary: { tr: "", en: "" },
      experience: [],
      education: [],
      skills: [],
    },
  });
}

export async function PUT(request: NextRequest) {
  return ApiHandler.PUT<ResumeData>(
    request,
    async (data) => {
      await repository.set(data);
      return data;
    }
  );
}
