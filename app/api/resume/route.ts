import { NextResponse } from "next/server";
import { getResumeData, setResumeData } from "@/lib/kv";
import { ResumeData } from "@/lib/resume-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getResumeData();
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
    console.error("Resume GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Resume verileri alınamadı",
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
    const data: ResumeData = body;

    const errors: string[] = [];

    if (!data.summary) {
      errors.push("❌ 'summary' alanı eksik");
    } else {
      if (!data.summary.tr || data.summary.tr.trim() === "") {
        errors.push("❌ 'summary.tr' (Türkçe özet) boş olamaz");
      }
      if (!data.summary.en || data.summary.en.trim() === "") {
        errors.push("❌ 'summary.en' (İngilizce özet) boş olamaz");
      }
    }

    if (!data.experience) {
      errors.push("❌ 'experience' alanı eksik");
    } else if (!Array.isArray(data.experience)) {
      errors.push("❌ 'experience' bir array olmalı");
    } else {
      data.experience.forEach((exp, index) => {
        if (!exp.id || exp.id.trim() === "") {
          errors.push(`❌ experience[${index}].id boş olamaz`);
        }
        if (!exp.title?.tr || exp.title.tr.trim() === "") {
          errors.push(`❌ experience[${index}].title.tr (Türkçe başlık) boş olamaz`);
        }
        if (!exp.title?.en || exp.title.en.trim() === "") {
          errors.push(`❌ experience[${index}].title.en (İngilizce başlık) boş olamaz`);
        }
        if (!exp.company?.tr || exp.company.tr.trim() === "") {
          errors.push(`❌ experience[${index}].company.tr (Türkçe şirket) boş olamaz`);
        }
        if (!exp.location?.tr || exp.location.tr.trim() === "") {
          errors.push(`❌ experience[${index}].location.tr (Türkçe konum) boş olamaz`);
        }
        if (!exp.period?.tr || exp.period.tr.trim() === "") {
          errors.push(`❌ experience[${index}].period.tr (Türkçe dönem) boş olamaz`);
        }
      });
    }

    if (!data.education) {
      errors.push("❌ 'education' alanı eksik");
    } else if (!Array.isArray(data.education)) {
      errors.push("❌ 'education' bir array olmalı");
    } else {
      data.education.forEach((edu, index) => {
        if (!edu.id || edu.id.trim() === "") {
          errors.push(`❌ education[${index}].id boş olamaz`);
        }
        if (!edu.degree?.tr || edu.degree.tr.trim() === "") {
          errors.push(`❌ education[${index}].degree.tr (Türkçe derece) boş olamaz`);
        }
        if (!edu.institution?.tr || edu.institution.tr.trim() === "") {
          errors.push(`❌ education[${index}].institution.tr (Türkçe kurum) boş olamaz`);
        }
        if (!edu.location?.tr || edu.location.tr.trim() === "") {
          errors.push(`❌ education[${index}].location.tr (Türkçe konum) boş olamaz`);
        }
        if (!edu.period?.tr || edu.period.tr.trim() === "") {
          errors.push(`❌ education[${index}].period.tr (Türkçe dönem) boş olamaz`);
        }
      });
    }

    if (!data.skills) {
      errors.push("❌ 'skills' alanı eksik");
    } else if (!Array.isArray(data.skills)) {
      errors.push("❌ 'skills' bir array olmalı");
    } else {
      data.skills.forEach((skill, index) => {
        if (!skill.id || skill.id.trim() === "") {
          errors.push(`❌ skills[${index}].id boş olamaz`);
        }
        if (!skill.category?.tr || skill.category.tr.trim() === "") {
          errors.push(`❌ skills[${index}].category.tr (Türkçe kategori) boş olamaz`);
        }
        if (!Array.isArray(skill.items) || skill.items.length === 0) {
          errors.push(`❌ skills[${index}].items boş olamaz veya array olmalı`);
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

    const success = await setResumeData(data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume verileri kaydedilemedi",
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
        message: "Resume verileri kaydedildi",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Resume PUT error:", error);
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
