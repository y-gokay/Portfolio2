import { NextResponse } from "next/server";
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/kv";
import { PortfolioItem } from "@/lib/portfolio-data";

// app/api/portfolio/migrate/route.ts
export const runtime = 'nodejs'; // veya 'edge' 
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getPortfolioItems();
    
    // Return empty array if KV is empty - no fallback to dummy data
    return NextResponse.json({
      success: true,
      data: items || [],
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
    
    // Detaylı validasyon
    const errors: string[] = [];
    
    if (!item.id || item.id.trim() === "") {
      errors.push("❌ 'id' alanı boş olamaz");
    }
    
    if (!item.title) {
      errors.push("❌ 'title' alanı eksik");
    } else {
      if (!item.title.tr || item.title.tr.trim() === "") {
        errors.push("❌ 'title.tr' (Türkçe başlık) boş olamaz");
      }
      if (!item.title.en || item.title.en.trim() === "") {
        errors.push("❌ 'title.en' (İngilizce başlık) boş olamaz");
      }
    }
    
    if (!item.category) {
      errors.push("❌ 'category' alanı eksik");
    } else {
      if (!item.category.tr || item.category.tr.trim() === "") {
        errors.push("❌ 'category.tr' (Türkçe kategori) boş olamaz");
      }
      if (!item.category.en || item.category.en.trim() === "") {
        errors.push("❌ 'category.en' (İngilizce kategori) boş olamaz");
      }
    }
    
    if (!item.description) {
      errors.push("❌ 'description' alanı eksik");
    } else {
      if (!item.description.tr || item.description.tr.trim() === "") {
        errors.push("❌ 'description.tr' (Türkçe açıklama) boş olamaz");
      }
      if (!item.description.en || item.description.en.trim() === "") {
        errors.push("❌ 'description.en' (İngilizce açıklama) boş olamaz");
      }
    }
    
    if (!item.image || item.image.trim() === "") {
      errors.push("❌ 'image' (ana görsel URL) boş olamaz");
    }
    
    if (!item.year || item.year.trim() === "") {
      errors.push("❌ 'year' (yıl) boş olamaz");
    }
    
    if (!item.tags) {
      errors.push("❌ 'tags' alanı eksik");
    } else {
      if (!Array.isArray(item.tags.tr)) {
        errors.push("❌ 'tags.tr' bir array olmalı");
      }
      if (!Array.isArray(item.tags.en)) {
        errors.push("❌ 'tags.en' bir array olmalı");
      }
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasyon hatası",
          details: errors,
          errorCount: errors.length,
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    const success = await addPortfolioItem(item);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi eklenemedi",
          details: ["KV (Upstash Redis) bağlantı hatası veya yazma izni yok. Lütfen environment variable'ları kontrol edin."],
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
      message: "Portfolio öğesi eklendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
        details: [`Hata mesajı: ${errorMessage}`],
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
    const { id, ...updatedItem } = body;
    
    const errors: string[] = [];
    
    if (!id || id.trim() === "") {
      errors.push("❌ 'id' alanı boş olamaz veya eksik");
    }
    
    const item = { id, ...updatedItem } as PortfolioItem;
    
    // Aynı validasyonları POST'ta olduğu gibi kontrol et
    if (!item.title) {
      errors.push("❌ 'title' alanı eksik");
    } else {
      if (!item.title.tr || item.title.tr.trim() === "") {
        errors.push("❌ 'title.tr' (Türkçe başlık) boş olamaz");
      }
      if (!item.title.en || item.title.en.trim() === "") {
        errors.push("❌ 'title.en' (İngilizce başlık) boş olamaz");
      }
    }
    
    if (!item.category) {
      errors.push("❌ 'category' alanı eksik");
    } else {
      if (!item.category.tr || item.category.tr.trim() === "") {
        errors.push("❌ 'category.tr' (Türkçe kategori) boş olamaz");
      }
      if (!item.category.en || item.category.en.trim() === "") {
        errors.push("❌ 'category.en' (İngilizce kategori) boş olamaz");
      }
    }
    
    if (!item.image || item.image.trim() === "") {
      errors.push("❌ 'image' (ana görsel URL) boş olamaz");
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasyon hatası",
          details: errors,
          errorCount: errors.length,
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    const success = await updatePortfolioItem(id, item);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi bulunamadı veya güncellenemedi",
          details: [
            `ID '${id}' ile eşleşen portfolio öğesi bulunamadı`,
            "Veya KV (Upstash Redis) bağlantı hatası oluştu. Lütfen environment variable'ları kontrol edin.",
          ],
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Portfolio öğesi güncellendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Portfolio PUT error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
        details: [`Hata mesajı: ${errorMessage}`],
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
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    const success = await deletePortfolioItem(id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio öğesi bulunamadı veya silinemedi",
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Portfolio öğesi silindi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
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
