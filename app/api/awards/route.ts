import { NextResponse } from "next/server";
import { getAwardsData, setAwardsData } from "@/lib/kv";
import { AwardsData } from "@/lib/awards-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAwardsData();
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Awards GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Awards verileri alınamadı",
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data: AwardsData = body;

    const errors: string[] = [];

    if (!data.awards) {
      errors.push("❌ 'awards' alanı eksik");
    } else if (!Array.isArray(data.awards)) {
      errors.push("❌ 'awards' bir array olmalı");
    } else {
      data.awards.forEach((award, index) => {
        if (!award.id || award.id.trim() === "") {
          errors.push(`❌ awards[${index}].id boş olamaz`);
        }
        if (!award.title?.tr || award.title.tr.trim() === "") {
          errors.push(`❌ awards[${index}].title.tr (Türkçe başlık) boş olamaz`);
        }
        if (!award.title?.en || award.title.en.trim() === "") {
          errors.push(`❌ awards[${index}].title.en (İngilizce başlık) boş olamaz`);
        }
        if (!award.organization?.tr || award.organization.tr.trim() === "") {
          errors.push(`❌ awards[${index}].organization.tr (Türkçe organizasyon) boş olamaz`);
        }
        if (!award.organization?.en || award.organization.en.trim() === "") {
          errors.push(`❌ awards[${index}].organization.en (İngilizce organizasyon) boş olamaz`);
        }
        if (!award.year || award.year.trim() === "") {
          errors.push(`❌ awards[${index}].year (yıl) boş olamaz`);
        }
        if (!award.category) {
          errors.push(`❌ awards[${index}].category eksik`);
        }
      });
    }

    if (!data.exhibitions) {
      errors.push("❌ 'exhibitions' alanı eksik");
    } else if (!Array.isArray(data.exhibitions)) {
      errors.push("❌ 'exhibitions' bir array olmalı");
    } else {
      data.exhibitions.forEach((exhibition, index) => {
        if (!exhibition.id || exhibition.id.trim() === "") {
          errors.push(`❌ exhibitions[${index}].id boş olamaz`);
        }
        if (!exhibition.title?.tr || exhibition.title.tr.trim() === "") {
          errors.push(`❌ exhibitions[${index}].title.tr (Türkçe başlık) boş olamaz`);
        }
        if (!exhibition.title?.en || exhibition.title.en.trim() === "") {
          errors.push(`❌ exhibitions[${index}].title.en (İngilizce başlık) boş olamaz`);
        }
        if (!exhibition.location?.tr || exhibition.location.tr.trim() === "") {
          errors.push(`❌ exhibitions[${index}].location.tr (Türkçe konum) boş olamaz`);
        }
        if (!exhibition.location?.en || exhibition.location.en.trim() === "") {
          errors.push(`❌ exhibitions[${index}].location.en (İngilizce konum) boş olamaz`);
        }
        if (!exhibition.year || exhibition.year.trim() === "") {
          errors.push(`❌ exhibitions[${index}].year (yıl) boş olamaz`);
        }
      });
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
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    const success = await setAwardsData(data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Awards verileri kaydedilemedi",
          details: ["KV (Upstash Redis) bağlantı hatası veya yazma izni yok. Lütfen environment variable'ları kontrol edin."],
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
        message: "Awards verileri kaydedildi",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Awards PUT error:", error);
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
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
