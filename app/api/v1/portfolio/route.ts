/**
 * Portfolio API Routes (v1)
 * Clean architecture implementation
 */

import { NextRequest } from "next/server";
import { ApiHandler } from "@/lib/core/api-handler";
import { PortfolioRepository } from "@/lib/repositories/portfolio.repository";
import { validatePortfolioItem } from "@/lib/validators/portfolio.validator";
import { PortfolioItem } from "@/lib/portfolio-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const repository = new PortfolioRepository();

export async function GET() {
  return ApiHandler.GET(() => repository.get(), {
    defaultOnError: [],
  });
}

export async function POST(request: NextRequest) {
  return ApiHandler.POST<PortfolioItem>(
    request,
    async (item) => {
      await repository.addItem(item);
      return { message: "Portfolio öğesi eklendi" };
    },
    validatePortfolioItem
  );
}

export async function PUT(request: NextRequest) {
  return ApiHandler.PUT<PortfolioItem>(
    request,
    async (item) => {
      if (!item.id) {
        throw new Error("ID gerekli");
      }
      await repository.updateItem(item.id, item);
      return { message: "Portfolio öğesi güncellendi" };
    },
    validatePortfolioItem
  );
}

export async function DELETE(request: NextRequest) {
  return ApiHandler.DELETE(request, (id) => repository.deleteItem(id));
}
