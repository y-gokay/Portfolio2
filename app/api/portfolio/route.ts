import { NextResponse } from "next/server";
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/kv";
import { PortfolioItem } from "@/lib/portfolio-data";

// app/api/portfolio/migrate/route.ts
export const runtime = 'nodejs'; // veya 'edge' 
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getPortfolioItems();
    
    // Eğer KV boşsa, fallback olarak statik verileri döndür
    if (items.length === 0) {
      const { portfolioItems } = await import("@/lib/portfolio-data");
      return NextResponse.json({
        success: true,
        data: portfolioItems,
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: items,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Portfolio verileri alınamadı",
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item: PortfolioItem = body;
    
    if (!item.id || !item.title || !item.category) {
      return NextResponse.json(
        {
          success: false,
          error: "Eksik alanlar var",
        },
        { status: 400 }
      );
    }
    
    const success = await addPortfolioItem(item);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi eklenemedi",
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Portfolio öğesi eklendi",
    });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedItem } = body;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID gerekli",
        },
        { status: 400 }
      );
    }
    
    const success = await updatePortfolioItem(id, { id, ...updatedItem } as PortfolioItem);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi bulunamadı veya güncellenemedi",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Portfolio öğesi güncellendi",
    });
  } catch (error) {
    console.error("Portfolio PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID gerekli",
        },
        { status: 400 }
      );
    }
    
    const success = await deletePortfolioItem(id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi bulunamadı veya silinemedi",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Portfolio öğesi silindi",
    });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}
