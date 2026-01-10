import { NextResponse } from "next/server";
import { getSiteSettings, setSiteSettings, updateSiteSettings } from "@/lib/kv-settings";
import { SiteSettings } from "@/lib/site-settings";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    
    // Eğer KV boşsa, fallback olarak default verileri döndür
    if (!settings) {
      const { defaultSiteSettings } = await import("@/lib/default-site-settings");
      return NextResponse.json({
        success: true,
        data: defaultSiteSettings,
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Site settings GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Site ayarları alınamadı",
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings: SiteSettings = body;
    
    // Validation
    if (!settings.translations || !settings.socialLinks || !settings.metadata) {
      return NextResponse.json(
        {
          success: false,
          error: "Eksik alanlar var",
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    const success = await setSiteSettings(settings);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları kaydedilemedi",
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Site ayarları güncellendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Site settings PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const partialSettings: Partial<SiteSettings> = body;
    
    const success = await updateSiteSettings(partialSettings);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları güncellenemedi",
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Site ayarları güncellendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Site settings PATCH error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

