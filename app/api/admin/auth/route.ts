/**
 * Admin Authentication API Route
 * Simple session-based authentication for admin panel
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple password check (in production, use proper authentication)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: "Şifre gerekli",
        },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: "Giriş başarılı",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz şifre",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}
