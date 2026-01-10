import { NextResponse } from "next/server";
import { setPortfolioItems } from "@/lib/kv";
import { portfolioItems } from "@/lib/portfolio-data";

// Bu route mevcut statik verileri KV'ye yükler
// Sadece bir kez çalıştırılmalı

// GET metodu ekle - browser'dan ve build sırasında keşfedilsin diye
export async function GET() {
  try {
    const success = await setPortfolioItems(portfolioItems);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Veriler KV'ye yüklenemedi",
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
      message: `${portfolioItems.length} portfolio öğesi KV'ye yüklendi`,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Migration error:", error);
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
    const success = await setPortfolioItems(portfolioItems);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Veriler KV'ye yüklenemedi",
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
      message: `${portfolioItems.length} portfolio öğesi KV'ye yüklendi`,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Migration error:", error);
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