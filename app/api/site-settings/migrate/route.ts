import { NextResponse } from "next/server";
import { SiteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { defaultSiteSettings } from "@/lib/default-site-settings";

// Bu route mevcut statik site ayarlarını KV'ye yükler
// Sadece bir kez çalıştırılmalı

export async function GET() {
  try {
    const repository = new SiteSettingsRepository();
    const success = await repository.set(defaultSiteSettings);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları KV'ye yüklenemedi",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Site ayarları KV'ye yüklendi",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Site settings migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}

export async function POST() {
  try {
    const repository = new SiteSettingsRepository();
    const success = await repository.set(defaultSiteSettings);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları KV'ye yüklenemedi",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Site ayarları KV'ye yüklendi",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Site settings migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
