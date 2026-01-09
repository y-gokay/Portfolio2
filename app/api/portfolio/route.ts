import { NextResponse } from "next/server";
import { portfolioItems } from "@/lib/portfolio-data";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: portfolioItems,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Portfolio verileri alınamadı",
      },
      { status: 500 }
    );
  }
}
