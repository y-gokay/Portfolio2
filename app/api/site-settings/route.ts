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
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      const parseErrorMessage = parseError instanceof Error ? parseError.message : "Bilinmeyen parse hatası";
      return NextResponse.json(
        {
          success: false,
          error: "JSON parse hatası",
          details: [
            `JSON formatı geçersiz: ${parseErrorMessage}`,
            "Lütfen gönderdiğiniz JSON formatını kontrol edin.",
          ],
          errorCount: 1,
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }
    
    const settings: SiteSettings = body;
    
    // Detaylı validasyon ve hata toplama
    const errors: string[] = [];
    
    // Temel alanlar kontrolü
    if (!settings.translations) {
      errors.push("❌ 'translations' alanı eksik");
    } else {
      if (!settings.translations.tr) errors.push("❌ 'translations.tr' alanı eksik");
      if (!settings.translations.en) errors.push("❌ 'translations.en' alanı eksik");
      
      // Hero translations
      if (settings.translations.tr && !settings.translations.tr.hero) {
        errors.push("❌ 'translations.tr.hero' alanı eksik");
      }
      if (settings.translations.en && !settings.translations.en.hero) {
        errors.push("❌ 'translations.en.hero' alanı eksik");
      }
      
      // Navigation kontrolü
      if (settings.translations.tr && !settings.translations.tr.navigation) {
        errors.push("❌ 'translations.tr.navigation' alanı eksik");
      }
      if (settings.translations.en && !settings.translations.en.navigation) {
        errors.push("❌ 'translations.en.navigation' alanı eksik");
      }
      
      // Navigation içeriği kontrolü
      if (settings.translations.tr?.navigation) {
        const navTr = settings.translations.tr.navigation;
        if (!navTr.home || navTr.home.trim() === "") errors.push("❌ 'translations.tr.navigation.home' boş olamaz");
        if (!navTr.about || navTr.about.trim() === "") errors.push("❌ 'translations.tr.navigation.about' boş olamaz");
        if (!navTr.portfolio || navTr.portfolio.trim() === "") errors.push("❌ 'translations.tr.navigation.portfolio' boş olamaz");
      }
      if (settings.translations.en?.navigation) {
        const navEn = settings.translations.en.navigation;
        if (!navEn.home || navEn.home.trim() === "") errors.push("❌ 'translations.en.navigation.home' boş olamaz");
        if (!navEn.about || navEn.about.trim() === "") errors.push("❌ 'translations.en.navigation.about' boş olamaz");
        if (!navEn.portfolio || navEn.portfolio.trim() === "") errors.push("❌ 'translations.en.navigation.portfolio' boş olamaz");
      }
    }
    
    if (!settings.socialLinks) {
      errors.push("❌ 'socialLinks' alanı eksik");
    } else if (!Array.isArray(settings.socialLinks)) {
      errors.push("❌ 'socialLinks' bir array olmalı");
    } else {
      // Social links validasyonu
      settings.socialLinks.forEach((link, index) => {
        if (!link.id || link.id.trim() === "") {
          errors.push(`❌ 'socialLinks[${index}].id' boş olamaz`);
        }
        if (!link.name || link.name.trim() === "") {
          errors.push(`❌ 'socialLinks[${index}].name' boş olamaz`);
        }
        if (!link.href || link.href.trim() === "") {
          errors.push(`❌ 'socialLinks[${index}].href' boş olamaz (Link: ${link.name || 'Bilinmeyen'})`);
        } else {
          // URL validasyonu
          try {
            new URL(link.href);
          } catch {
            errors.push(`❌ 'socialLinks[${index}].href' geçerli bir URL değil: "${link.href}"`);
          }
        }
        if (!link.icon) {
          errors.push(`❌ 'socialLinks[${index}].icon' eksik (Link: ${link.name || 'Bilinmeyen'})`);
        }
      });
    }
    
    if (!settings.metadata) {
      errors.push("❌ 'metadata' alanı eksik");
    } else {
      if (!settings.metadata.title) {
        errors.push("❌ 'metadata.title' alanı eksik");
      } else {
        if (typeof settings.metadata.title === 'object' && settings.metadata.title !== null) {
          if (!settings.metadata.title.default || settings.metadata.title.default.trim() === "") {
            errors.push("❌ 'metadata.title.default' boş olamaz");
          }
          if (!settings.metadata.title.template || settings.metadata.title.template.trim() === "") {
            errors.push("❌ 'metadata.title.template' boş olamaz");
          }
        } else {
          // Eğer string olarak gelmişse (eski format)
          if (typeof settings.metadata.title === 'string' && settings.metadata.title.trim() === "") {
            errors.push("❌ 'metadata.title' boş olamaz (string formatında)");
          }
        }
      }
      if (!settings.metadata.description || settings.metadata.description.trim() === "") {
        errors.push("❌ 'metadata.description' boş olamaz");
      }
      if (settings.metadata.ogImage && settings.metadata.ogImage.trim() !== "") {
        try {
          new URL(settings.metadata.ogImage);
        } catch {
          // Relative path olabilir, o yüzden sadece uyarı ver
          if (!settings.metadata.ogImage.startsWith('/') && !settings.metadata.ogImage.startsWith('./')) {
            errors.push(`❌ 'metadata.ogImage' geçerli bir URL veya path değil: "${settings.metadata.ogImage}"`);
          }
        }
      }
    }
    
    if (!settings.heroImages) {
      errors.push("❌ 'heroImages' alanı eksik");
    } else {
      // heroImages bir obje: {image1: string, image2: string, image3: string}
      if (typeof settings.heroImages !== 'object' || Array.isArray(settings.heroImages)) {
        errors.push("❌ 'heroImages' bir obje olmalı: {image1: string, image2: string, image3: string}");
      } else {
        if (!settings.heroImages.image1 || settings.heroImages.image1.trim() === "") {
          errors.push("❌ 'heroImages.image1' boş olamaz");
        }
        if (!settings.heroImages.image2 || settings.heroImages.image2.trim() === "") {
          errors.push("❌ 'heroImages.image2' boş olamaz");
        }
        if (!settings.heroImages.image3 || settings.heroImages.image3.trim() === "") {
          errors.push("❌ 'heroImages.image3' boş olamaz");
        }
      }
    }
    
    if (!settings.sectionVisibility) {
      errors.push("❌ 'sectionVisibility' alanı eksik (Hero, About, Portfolio, Skills, Carousel, Research, Awards, Contact bölümlerinin görünürlük ayarları)");
    } else {
      // sectionVisibility alanlarını kontrol et (optional ama varsa kontrol et)
      const requiredSections = ['hero', 'about', 'portfolio', 'skills', 'carousel', 'research', 'awards', 'contact'];
      requiredSections.forEach(section => {
        if (!(section in settings.sectionVisibility)) {
          errors.push(`❌ 'sectionVisibility.${section}' alanı eksik`);
        } else if (typeof settings.sectionVisibility[section as keyof typeof settings.sectionVisibility] !== 'boolean') {
          errors.push(`❌ 'sectionVisibility.${section}' boolean değer olmalı`);
        }
      });
    }
    
    // Eğer hata varsa detaylı mesaj döndür
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Validasyon hatası (${errors.length} hata bulundu)`,
          details: errors,
          errorCount: errors.length,
          summary: {
            totalErrors: errors.length,
            categories: {
              translations: errors.filter(e => e.includes('translations')).length,
              metadata: errors.filter(e => e.includes('metadata')).length,
              heroImages: errors.filter(e => e.includes('heroImages')).length,
              socialLinks: errors.filter(e => e.includes('socialLinks')).length,
              sectionVisibility: errors.filter(e => e.includes('sectionVisibility')).length,
            }
          }
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
      message: "Site ayarları güncellendi",
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("Site settings PUT error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
        details: [
          `Hata mesajı: ${errorMessage}`,
          errorStack ? `Stack trace: ${errorStack.split('\n')[0]}` : "",
        ].filter(Boolean),
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

