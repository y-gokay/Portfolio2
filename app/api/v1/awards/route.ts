/**
 * Awards API Routes (v1)
 * Clean architecture implementation
 */

import { NextRequest } from "next/server";
import { ApiHandler } from "@/lib/core/api-handler";
import { AwardsRepository } from "@/lib/repositories/awards.repository";
import { AwardsData } from "@/lib/awards-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repository = new AwardsRepository();

export async function GET() {
  return ApiHandler.GET(() => repository.get(), {
    defaultOnError: { awards: [], exhibitions: [] },
  });
}

export async function PUT(request: NextRequest) {
  return ApiHandler.PUT<AwardsData>(
    request,
    async (data) => {
      await repository.set(data);
      return data;
    }
  );
}
