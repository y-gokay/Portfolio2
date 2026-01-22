// Kullanıcı dostu hata mesajları dönüştürme fonksiyonları

export function translateTechnicalError(error: string): string {
  // Teknik terimleri kullanıcı dostu açıklamalara dönüştür
  const translations: Record<string, string> = {
    // Genel terimler
    "metadata.title": "Site başlığı",
    "metadata.title.default": "Site başlığı",
    "metadata.title.template": "Sayfa başlığı şablonu",
    "metadata.description": "Site açıklaması",
    heroImages: "Ana sayfa görselleri",
    "heroImages.image1": "Ana sayfa görseli 1",
    "heroImages.image2": "Ana sayfa görseli 2",
    "heroImages.image3": "Ana sayfa görseli 3",
    socialLinks: "Sosyal medya bağlantıları",
    translations: "Çeviriler",
    "translations.tr": "Türkçe çeviriler",
    "translations.en": "İngilizce çeviriler",
    navigation: "Menü",
    sectionVisibility: "Bölüm görünürlüğü",
  };

  // Teknik ifadeleri değiştir
  let friendlyError = error;

  // Pattern-based replacements
  friendlyError = friendlyError.replace(
    /metadata\.title\.default/g,
    "Site başlığı"
  );
  friendlyError = friendlyError.replace(
    /metadata\.title\.template/g,
    "Sayfa başlığı şablonu"
  );
  friendlyError = friendlyError.replace(/metadata\.title/g, "Site başlığı");
  friendlyError = friendlyError.replace(
    /metadata\.description/g,
    "Site açıklaması"
  );
  friendlyError = friendlyError.replace(
    /heroImages\.image(\d+)/g,
    "Ana sayfa görseli $1"
  );
  friendlyError = friendlyError.replace(/heroImages/g, "Ana sayfa görselleri");
  friendlyError = friendlyError.replace(
    /socialLinks\[(\d+)\]/g,
    "Sosyal medya linki $1"
  );
  friendlyError = friendlyError.replace(
    /translations\.(tr|en)\.navigation\.(\w+)/g,
    (match, lang, key) => {
      const navKeys: Record<string, string> = {
        home: "Ana Sayfa",
        about: "Hakkımda",
        portfolio: "Portföy",
        skills: "Yetenekler",
        research: "Projelerim",
        resume: "Özgeçmiş",
        awards: "Ödüller",
        contact: "İletişim",
      };
      const langName = lang === "tr" ? "Türkçe" : "İngilizce";
      return `${langName} menü - ${navKeys[key] || key}`;
    }
  );

  // Hata türlerini daha anlaşılır hale getir
  friendlyError = friendlyError.replace(/❌ /g, "");
  friendlyError = friendlyError.replace(
    /eksik veya geçersiz format/g,
    "eksik veya hatalı"
  );
  friendlyError = friendlyError.replace(/boş olamaz/g, "boş bırakılamaz");
  friendlyError = friendlyError.replace(
    /Geçersiz format \(string olmalı\)/g,
    "Hatalı format"
  );
  friendlyError = friendlyError.replace(
    /geçerli bir URL değil/g,
    "geçerli bir web adresi değil"
  );

  return friendlyError;
}

export function formatUserFriendlyError(technicalError: string): string {
  let error = translateTechnicalError(technicalError);

  // Noktalama ve format düzeltmeleri
  error = error.trim();
  if (!error.endsWith(".")) {
    error += ".";
  }

  return error;
}

export function groupErrorsByCategory(errors: string[]): {
  category: string;
  errors: string[];
}[] {
  const categories: Record<string, string[]> = {
    "Site Bilgileri": [],
    "Ana Sayfa Görselleri": [],
    "Sosyal Medya": [],
    Menü: [],
    Diğer: [],
  };

  errors.forEach((error) => {
    const friendlyError = formatUserFriendlyError(error);

    if (
      error.includes("metadata.title") ||
      error.includes("metadata.description")
    ) {
      categories["Site Bilgileri"].push(friendlyError);
    } else if (error.includes("heroImages")) {
      categories["Ana Sayfa Görselleri"].push(friendlyError);
    } else if (error.includes("socialLinks")) {
      categories["Sosyal Medya"].push(friendlyError);
    } else if (error.includes("navigation")) {
      categories["Menü"].push(friendlyError);
    } else {
      categories["Diğer"].push(friendlyError);
    }
  });

  // Boş kategorileri filtrele
  return Object.entries(categories)
    .filter(([_, errors]) => errors.length > 0)
    .map(([category, errors]) => ({ category, errors }));
}
