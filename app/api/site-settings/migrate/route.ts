import { NextResponse } from "next/server";
import { setSiteSettings } from "@/lib/kv-settings";
import { defaultSiteSettings } from "@/lib/default-site-settings";

// Bu route mevcut statik site ayarlarını KV'ye yükler
// Sadece bir kez çalıştırılmalı

export async function GET() {
  try {
    const success = await setSiteSettings(defaultSiteSettings);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları KV'ye yüklenemedi",
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
      message: "Site ayarları KV'ye yüklendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
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
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

export async function POST() {
  try {
    const success = await setSiteSettings(defaultSiteSettings);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Site ayarları KV'ye yüklenemedi",
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
      message: "Site ayarları KV'ye yüklendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
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
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

