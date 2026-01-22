/**
 * Site Settings API Routes (v1)
 * Clean architecture implementation
 */

import { NextRequest } from "next/server";
import { ApiHandler } from "@/lib/core/api-handler";
import { SiteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { SiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repository = new SiteSettingsRepository();

export async function GET() {
  return ApiHandler.GET(() => repository.getSettings(), {
    defaultOnError: repository.getDefaultValue(),
  });
}

export async function PUT(request: NextRequest) {
  return ApiHandler.PUT<SiteSettings>(
    request,
    async (settings) => {
      await repository.set(settings);
      return settings;
    }
  );
}
