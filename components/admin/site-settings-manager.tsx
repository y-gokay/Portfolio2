"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Image as ImageIcon,
  Settings,
  FileText,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Globe,
  Layers,
  Palette,
  Code,
  Plus,
  X,
  Trash2,
  ChevronRight,
  Eye,
} from "lucide-react";
import { SiteSettings, SocialLink } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./image-upload";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { formatUserFriendlyError, groupErrorsByCategory } from "@/lib/user-friendly-errors";

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings");
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      } else {
        const errorMessage = result.error || "Site ayarları yüklenemedi";
        const detailsMessage = result.details 
          ? `\n\nDetaylar: ${Array.isArray(result.details) ? result.details.join('\n') : result.details}`
          : '';
        toast.error(`${errorMessage}${detailsMessage}`, {
          duration: 10000,
        });
        console.error("Settings fetch error:", result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Bağlantı hatası: ${error.message}` 
        : "Site ayarları yüklenemedi";
      toast.error(errorMessage, {
        duration: 10000,
      });
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) {
      toast.error("Ayarlar yüklenmedi. Lütfen sayfayı yenileyin.");
      return;
    }

    // Client-side validasyon
    const validationErrors: string[] = [];
    
    // Temel alanlar
    if (!settings.translations?.tr || !settings.translations?.en) {
      validationErrors.push("❌ Çeviri alanları eksik");
    }
    
    // metadata.title artık bir obje {default: string, template: string}
    if (!settings.metadata?.title || typeof settings.metadata.title !== 'object') {
      validationErrors.push("❌ Site başlığı (metadata.title) eksik veya geçersiz format");
    } else {
      if (!settings.metadata.title.default || typeof settings.metadata.title.default !== 'string' || settings.metadata.title.default.trim() === "") {
        validationErrors.push("❌ Site başlığı varsayılan (metadata.title.default) boş olamaz");
      }
      if (!settings.metadata.title.template || typeof settings.metadata.title.template !== 'string' || settings.metadata.title.template.trim() === "") {
        validationErrors.push("❌ Site başlığı şablonu (metadata.title.template) boş olamaz");
      }
    }
    
    if (!settings.metadata?.description || typeof settings.metadata.description !== 'string' || settings.metadata.description.trim() === "") {
      validationErrors.push("❌ Site açıklaması (metadata.description) boş olamaz");
    }
    
    // heroImages bir obje {image1: string, image2: string, image3: string} - her değer bir URL string
    // Hero görselleri opsiyonel, bu yüzden sadece varsa ve boş değilse kontrol et
    if (settings.heroImages && typeof settings.heroImages === 'object') {
      const heroImages = settings.heroImages as { image1?: string; image2?: string; image3?: string };
      const imageKeys = ['image1', 'image2', 'image3'] as const;
      
      imageKeys.forEach((key) => {
        const imgUrl = heroImages[key];
        // Sadece değer varsa ve boş string değilse kontrol et (opsiyonel alanlar)
        if (imgUrl !== undefined && imgUrl !== null && imgUrl !== "") {
          if (typeof imgUrl !== 'string') {
            validationErrors.push(`❌ Hero görsel ${key}: Geçersiz format (string olmalı)`);
          } else if (imgUrl.trim() === "") {
            validationErrors.push(`❌ Hero görsel ${key}: URL boş olamaz`);
          }
        }
      });
    }
    
    // Social links kontrolü
    settings.socialLinks?.forEach((link, index) => {
      if (!link.href || link.href.trim() === "") {
        validationErrors.push(`❌ Sosyal medya linki ${index + 1} (${link.name || 'Bilinmeyen'}): URL boş olamaz`);
      }
      if (link.href && link.href.trim() !== "") {
        try {
          new URL(link.href);
        } catch {
          validationErrors.push(`❌ Sosyal medya linki ${index + 1} (${link.name || 'Bilinmeyen'}): Geçersiz URL formatı - "${link.href}"`);
        }
      }
    });
    
    // Navigation kontrolü
    if (settings.translations?.tr?.navigation) {
      const nav = settings.translations.tr.navigation;
      if (!nav.home || nav.home.trim() === "") validationErrors.push("❌ Türkçe navigasyon: 'Ana Sayfa' boş olamaz");
      if (!nav.about || nav.about.trim() === "") validationErrors.push("❌ Türkçe navigasyon: 'Hakkımda' boş olamaz");
      if (!nav.portfolio || nav.portfolio.trim() === "") validationErrors.push("❌ Türkçe navigasyon: 'Portföy' boş olamaz");
    }
    if (settings.translations?.en?.navigation) {
      const nav = settings.translations.en.navigation;
      if (!nav.home || nav.home.trim() === "") validationErrors.push("❌ İngilizce navigasyon: 'Home' boş olamaz");
      if (!nav.about || nav.about.trim() === "") validationErrors.push("❌ İngilizce navigasyon: 'About' boş olamaz");
      if (!nav.portfolio || nav.portfolio.trim() === "") validationErrors.push("❌ İngilizce navigasyon: 'Portfolio' boş olamaz");
    }
    
    // Client-side hataları göster
    if (validationErrors.length > 0) {
      const groupedErrors = groupErrorsByCategory(validationErrors);
      const friendlyErrors = validationErrors.map(formatUserFriendlyError);
      
      // Kullanıcı dostu hata mesajı oluştur
      let errorMessage = `Lütfen aşağıdaki ${validationErrors.length} hatayı düzeltin:\n\n`;
      
      if (groupedErrors.length > 0) {
        groupedErrors.forEach(({ category, errors }) => {
          errorMessage += `📋 ${category}:\n`;
          errors.slice(0, 3).forEach(err => {
            errorMessage += `  • ${err}\n`;
          });
          if (errors.length > 3) {
            errorMessage += `  • ...ve ${errors.length - 3} hata daha\n`;
          }
          errorMessage += '\n';
        });
      } else {
        friendlyErrors.slice(0, 5).forEach(err => {
          errorMessage += `• ${err}\n`;
        });
        if (friendlyErrors.length > 5) {
          errorMessage += `\n...ve ${friendlyErrors.length - 5} hata daha`;
        }
      }
      
      toast.error(errorMessage.trim(), {
        duration: 15000,
      });
      
      // Tüm hataları konsola yazdır (developer için)
      console.error("Validasyon Hataları:", validationErrors);
      setSaving(false);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ayarlar başarıyla kaydedildi");
        fetchSettings();
      } else {
        // Kullanıcı dostu hata mesajı göster
        let errorMessage = result.error || "Kaydetme işlemi başarısız oldu";
        
        if (result.details && Array.isArray(result.details) && result.details.length > 0) {
          const groupedErrors = groupErrorsByCategory(result.details);
          const friendlyErrors = result.details.map(formatUserFriendlyError);
          
          errorMessage = `Lütfen aşağıdaki ${result.errorCount || result.details.length} hatayı düzeltin:\n\n`;
          
          if (groupedErrors.length > 0) {
            groupedErrors.forEach(({ category, errors }) => {
              errorMessage += `📋 ${category}:\n`;
              errors.slice(0, 3).forEach(err => {
                errorMessage += `  • ${err}\n`;
              });
              if (errors.length > 3) {
                errorMessage += `  • ...ve ${errors.length - 3} hata daha\n`;
              }
              errorMessage += '\n';
            });
          } else {
            friendlyErrors.slice(0, 5).forEach(err => {
              errorMessage += `• ${err}\n`;
            });
            if (friendlyErrors.length > 5) {
              errorMessage += `\n...ve ${friendlyErrors.length - 5} hata daha`;
            }
          }
          
          // Tüm hataları konsola yazdır (developer için)
          console.error("Sunucu Validasyon Hataları:", result.details);
        }
        
        toast.error(errorMessage.trim(), {
          duration: 20000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Bağlantı hatası: ${error.message}` 
        : "Bilinmeyen bir hata oluştu";
      
      toast.error(errorMessage, {
        duration: 10000,
      });
      
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateTranslations = (
    lang: "tr" | "en",
    path: string[],
    value: any
  ) => {
    if (!settings) return;

    const newSettings = { ...settings };
    let current: any = newSettings.translations[lang];

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  const updateSocialLinks = (
    index: number,
    field: keyof SocialLink,
    value: any
  ) => {
    if (!settings) return;

    const newSettings = { ...settings };
    newSettings.socialLinks[index] = {
      ...newSettings.socialLinks[index],
      [field]: value,
    };
    setSettings(newSettings);
  };

  const addSocialLink = () => {
    if (!settings) return;

    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      name: "Yeni Link",
      icon: "instagram",
      href: "",
      ariaLabel: { tr: "", en: "" },
      enabled: true,
      order: settings.socialLinks.length + 1,
    };

    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, newLink],
    });
  };

  const removeSocialLink = (index: number) => {
    if (!settings) return;

    const newSettings = { ...settings };
    newSettings.socialLinks.splice(index, 1);
    setSettings(newSettings);
  };

  const updateMetadata = (
    field: keyof SiteSettings["metadata"],
    value: any
  ) => {
    if (!settings) return;

    setSettings({
      ...settings,
      metadata: {
        ...settings.metadata,
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Site ayarları yüklenemedi
      </div>
    );
  }

  const iconOptions: SocialLink["icon"][] = [
    "instagram",
    "youtube",
    "linkedin",
    "email",
    "twitter",
    "facebook",
    "github",
  ];

  return (
    <div className="space-y-6">
      {/* Modern Header with Save */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg p-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Site Ayarları
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              İçeriğinizi buradan yönetin ve kontrol edin
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-1 bg-muted/50 rounded-lg border border-border/50">
          <TabsTrigger
            value="hero"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">İçerik</span>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Bölümler</span>
          </TabsTrigger>
          <TabsTrigger
            value="visibility"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Görünürlük</span>
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Sosyal</span>
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4 mt-6">
          {/* Hero Görselleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hero Görselleri
              </CardTitle>
              <CardDescription>
                Ana sayfa hero bölümündeki görselleri yönetin. 3 görsel
                kullanılır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Görsel 1 (Sol)</Label>
                  <ImageUpload
                    value={settings.heroImages?.image1 || ""}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        heroImages: {
                          ...settings.heroImages,
                          image1: value,
                        },
                      })
                    }
                    label=""
                    placeholder="/placeholder.svg veya https://..."
                    showPreview={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Görsel 2 (Orta)</Label>
                  <ImageUpload
                    value={settings.heroImages?.image2 || ""}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        heroImages: {
                          ...settings.heroImages,
                          image2: value,
                        },
                      })
                    }
                    label=""
                    placeholder="/placeholder.svg veya https://..."
                    showPreview={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Görsel 3 (Arka Plan)</Label>
                  <ImageUpload
                    value={settings.heroImages?.image3 || ""}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        heroImages: {
                          ...settings.heroImages,
                          image3: value,
                        },
                      })
                    }
                    label=""
                    placeholder="/placeholder.svg veya https://..."
                    showPreview={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Metinleri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Türkçe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>İsim</Label>
                  <Input
                    value={settings.translations.tr.hero.name}
                    onChange={(e) =>
                      updateTranslations("tr", ["hero", "name"], e.target.value)
                    }
                    placeholder="İpek Kökdemir"
                  />
                </div>
                <div>
                  <Label>Alt Başlık</Label>
                  <Input
                    value={settings.translations.tr.hero.subtitle}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["hero", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Tasarımcı & Görsel Sanatçı"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>English</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={settings.translations.en.hero.name}
                    onChange={(e) =>
                      updateTranslations("en", ["hero", "name"], e.target.value)
                    }
                    placeholder="İpek Kökdemir"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={settings.translations.en.hero.subtitle}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["hero", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Designer & Visual Artist"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manifesto */}
          <Card>
            <CardHeader>
              <CardTitle>Manifesto</CardTitle>
              <CardDescription>
                Her iki dil için manifesto metni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Türkçe Başlık</Label>
                  <Textarea
                    value={settings.translations.tr.manifesto.title}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["manifesto", "title"],
                        e.target.value
                      )
                    }
                    rows={2}
                    placeholder="Başlık metni"
                  />
                  <Label>Türkçe Açıklama</Label>
                  <Textarea
                    value={settings.translations.tr.manifesto.description}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["manifesto", "description"],
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Açıklama metni"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English Title</Label>
                  <Textarea
                    value={settings.translations.en.manifesto.title}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["manifesto", "title"],
                        e.target.value
                      )
                    }
                    rows={2}
                    placeholder="Title text"
                  />
                  <Label>English Description</Label>
                  <Textarea
                    value={settings.translations.en.manifesto.description}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["manifesto", "description"],
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Description text"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 mt-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Yetenekler Bölümü</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Bölüm Başlığı (TR)</Label>
                  <Input
                    value={settings.translations.tr.features.label}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["features", "label"],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Section Label (EN)</Label>
                  <Input
                    value={settings.translations.en.features.label}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["features", "label"],
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {["typography", "layout", "color"].map((feature) => (
                  <Card key={feature}>
                    <CardHeader>
                      <CardTitle className="text-sm capitalize">
                        {feature}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs">TR Başlık</Label>
                        <Input
                          value={
                            (
                              settings.translations.tr.features[
                                feature as keyof typeof settings.translations.tr.features
                              ] as { title: string; description: string }
                            )?.title || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["features", feature as string, "title"],
                              e.target.value
                            )
                          }
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">TR Açıklama</Label>
                        <Input
                          value={
                            (
                              settings.translations.tr.features[
                                feature as keyof typeof settings.translations.tr.features
                              ] as { title: string; description: string }
                            )?.description || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["features", feature as string, "description"],
                              e.target.value
                            )
                          }
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EN Title</Label>
                        <Input
                          value={
                            (
                              settings.translations.en.features[
                                feature as keyof typeof settings.translations.en.features
                              ] as { title: string; description: string }
                            )?.title || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["features", feature as string, "title"],
                              e.target.value
                            )
                          }
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EN Description</Label>
                        <Input
                          value={
                            (
                              settings.translations.en.features[
                                feature as keyof typeof settings.translations.en.features
                              ] as { title: string; description: string }
                            )?.description || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["features", feature as string, "description"],
                              e.target.value
                            )
                          }
                          className="text-xs h-8"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Carousel Title */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Yaratıcı Çalışmalarım (Carousel)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Başlık (TR)</Label>
                  <Input
                    value={settings.translations.tr.carousel?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["carousel", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Yaratıcı çalışmalarım."
                  />
                </div>
                <div>
                  <Label>Title (EN)</Label>
                  <Input
                    value={settings.translations.en.carousel?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["carousel", "title"],
                        e.target.value
                      )
                    }
                    placeholder="My creative work."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Türkçe</Label>
                  <Input
                    value={settings.translations.tr.footer.contact.title}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["footer", "contact", "title"],
                        e.target.value
                      )
                    }
                    placeholder="İletişim"
                  />
                  <Input
                    type="email"
                    value={settings.translations.tr.footer.contact.email}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["footer", "contact", "email"],
                        e.target.value
                      )
                    }
                    placeholder="E-posta"
                  />
                  <Input
                    value={settings.translations.tr.footer.contact.role}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["footer", "contact", "role"],
                        e.target.value
                      )
                    }
                    placeholder="Rol/Unvan"
                  />
                  <Input
                    value={settings.translations.tr.footer.copyright}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["footer", "copyright"],
                        e.target.value
                      )
                    }
                    placeholder="Telif hakkı"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English</Label>
                  <Input
                    value={settings.translations.en.footer.contact.title}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["footer", "contact", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Contact"
                  />
                  <Input
                    type="email"
                    value={settings.translations.en.footer.contact.email}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["footer", "contact", "email"],
                        e.target.value
                      )
                    }
                    placeholder="Email"
                  />
                  <Input
                    value={settings.translations.en.footer.contact.role}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["footer", "contact", "role"],
                        e.target.value
                      )
                    }
                    placeholder="Role/Title"
                  />
                  <Input
                    value={settings.translations.en.footer.copyright}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["footer", "copyright"],
                        e.target.value
                      )
                    }
                    placeholder="Copyright"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab - About, Skills, Research, Resume, Awards */}
        <TabsContent value="sections" className="space-y-6 mt-6">
          {/* About Section */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-linear-to-r from-primary/5 to-transparent border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Hakkımda (About)
              </CardTitle>
              <CardDescription>
                Profesyonel hikaye, yaklaşım ve ilgi alanları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Türkçe
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Hikaye Başlığı</Label>
                        <Input
                          value={
                            settings.translations.tr.about?.story?.title || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "story", "title"],
                              e.target.value
                            )
                          }
                          placeholder="Profesyonel Hikayem"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Hikaye İçeriği</Label>
                        <Textarea
                          value={
                            settings.translations.tr.about?.story?.content || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "story", "content"],
                              e.target.value
                            )
                          }
                          rows={3}
                          placeholder="Hikaye içeriği..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Yaklaşım Başlığı</Label>
                        <Input
                          value={
                            settings.translations.tr.about?.approach?.title ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "approach", "title"],
                              e.target.value
                            )
                          }
                          placeholder="Yaklaşımım"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Yaklaşım İçeriği</Label>
                        <Textarea
                          value={
                            settings.translations.tr.about?.approach?.content ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "approach", "content"],
                              e.target.value
                            )
                          }
                          rows={3}
                          placeholder="Yaklaşım içeriği..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs">İlgi Alanları Başlığı</Label>
                        <Input
                          value={
                            settings.translations.tr.about?.interests?.title ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "interests", "title"],
                              e.target.value
                            )
                          }
                          placeholder="İlgi Alanlarım"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">
                          İlgi Alanları (her satıra bir tane)
                        </Label>
                        <Textarea
                          value={(
                            settings.translations.tr.about?.interests?.items ||
                            []
                          ).join("\n")}
                          onChange={(e) =>
                            updateTranslations(
                              "tr",
                              ["about", "interests", "items"],
                              e.target.value.split("\n").filter(Boolean)
                            )
                          }
                          rows={5}
                          placeholder="Tipografi ve Tip Tasarımı&#10;Marka Kimliği ve Görsel Sistemler&#10;..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      English
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Story Title</Label>
                        <Input
                          value={
                            settings.translations.en.about?.story?.title || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "story", "title"],
                              e.target.value
                            )
                          }
                          placeholder="My Professional Story"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Story Content</Label>
                        <Textarea
                          value={
                            settings.translations.en.about?.story?.content || ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "story", "content"],
                              e.target.value
                            )
                          }
                          rows={3}
                          placeholder="Story content..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Approach Title</Label>
                        <Input
                          value={
                            settings.translations.en.about?.approach?.title ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "approach", "title"],
                              e.target.value
                            )
                          }
                          placeholder="My Approach"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Approach Content</Label>
                        <Textarea
                          value={
                            settings.translations.en.about?.approach?.content ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "approach", "content"],
                              e.target.value
                            )
                          }
                          rows={3}
                          placeholder="Approach content..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Interests Title</Label>
                        <Input
                          value={
                            settings.translations.en.about?.interests?.title ||
                            ""
                          }
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "interests", "title"],
                              e.target.value
                            )
                          }
                          placeholder="My Interests"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">
                          Interests (one per line)
                        </Label>
                        <Textarea
                          value={(
                            settings.translations.en.about?.interests?.items ||
                            []
                          ).join("\n")}
                          onChange={(e) =>
                            updateTranslations(
                              "en",
                              ["about", "interests", "items"],
                              e.target.value.split("\n").filter(Boolean)
                            )
                          }
                          rows={5}
                          placeholder="Typography and Type Design&#10;Brand Identity and Visual Systems&#10;..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-linear-to-r from-primary/5 to-transparent border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Yetenekler (Skills)
              </CardTitle>
              <CardDescription>
                Uzmanlık alanları ve kullanılan araçlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Türkçe</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Bölüm Başlığı</Label>
                      <Input
                        value={settings.translations.tr.skills?.title || ""}
                        onChange={(e) =>
                          updateTranslations(
                            "tr",
                            ["skills", "title"],
                            e.target.value
                          )
                        }
                        placeholder="Yetenekler ve Araçlar"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        Uzmanlık Alanları Başlığı
                      </Label>
                      <Input
                        value={
                          settings.translations.tr.skills?.expertise?.title ||
                          ""
                        }
                        onChange={(e) =>
                          updateTranslations(
                            "tr",
                            ["skills", "expertise", "title"],
                            e.target.value
                          )
                        }
                        placeholder="Uzmanlık Alanlarım"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">English</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Section Title</Label>
                      <Input
                        value={settings.translations.en.skills?.title || ""}
                        onChange={(e) =>
                          updateTranslations(
                            "en",
                            ["skills", "title"],
                            e.target.value
                          )
                        }
                        placeholder="Skills & Tools"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Expertise Title</Label>
                      <Input
                        value={
                          settings.translations.en.skills?.expertise?.title ||
                          ""
                        }
                        onChange={(e) =>
                          updateTranslations(
                            "en",
                            ["skills", "expertise", "title"],
                            e.target.value
                          )
                        }
                        placeholder="My Expertise"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tools Categories */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Araçlar (Tools)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["design", "prototyping", "development"].map((category) => (
                    <Card key={category} className="border-primary/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm capitalize">
                          {category === "design"
                            ? "Tasarım"
                            : category === "prototyping"
                            ? "Prototipleme"
                            : "Geliştirme"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-xs">TR Başlık</Label>
                          <Input
                            value={
                              settings.translations.tr.skills?.tools
                                ?.categories?.[
                                category as keyof typeof settings.translations.tr.skills.tools.categories
                              ]?.title || ""
                            }
                            onChange={(e) =>
                              updateTranslations(
                                "tr",
                                [
                                  "skills",
                                  "tools",
                                  "categories",
                                  category,
                                  "title",
                                ],
                                e.target.value
                              )
                            }
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            TR Araçlar (her satıra bir tane)
                          </Label>
                          <Textarea
                            value={(
                              settings.translations.tr.skills?.tools
                                ?.categories?.[
                                category as keyof typeof settings.translations.tr.skills.tools.categories
                              ]?.items || []
                            ).join("\n")}
                            onChange={(e) =>
                              updateTranslations(
                                "tr",
                                [
                                  "skills",
                                  "tools",
                                  "categories",
                                  category,
                                  "items",
                                ],
                                e.target.value.split("\n").filter(Boolean)
                              )
                            }
                            rows={3}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">EN Title</Label>
                          <Input
                            value={
                              settings.translations.en.skills?.tools
                                ?.categories?.[
                                category as keyof typeof settings.translations.en.skills.tools.categories
                              ]?.title || ""
                            }
                            onChange={(e) =>
                              updateTranslations(
                                "en",
                                [
                                  "skills",
                                  "tools",
                                  "categories",
                                  category,
                                  "title",
                                ],
                                e.target.value
                              )
                            }
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            EN Tools (one per line)
                          </Label>
                          <Textarea
                            value={(
                              settings.translations.en.skills?.tools
                                ?.categories?.[
                                category as keyof typeof settings.translations.en.skills.tools.categories
                              ]?.items || []
                            ).join("\n")}
                            onChange={(e) =>
                              updateTranslations(
                                "en",
                                [
                                  "skills",
                                  "tools",
                                  "categories",
                                  category,
                                  "items",
                                ],
                                e.target.value.split("\n").filter(Boolean)
                              )
                            }
                            rows={3}
                            className="text-xs"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research, Resume, Awards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Research */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Araştırma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">TR Başlık</Label>
                  <Input
                    value={settings.translations.tr.research?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["research", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Projelerim"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">TR Alt Başlık</Label>
                  <Input
                    value={settings.translations.tr.research?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["research", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Projeler listesi"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Title</Label>
                  <Input
                    value={settings.translations.en.research?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["research", "title"],
                        e.target.value
                      )
                    }
                    placeholder="My Projects"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Subtitle</Label>
                  <Input
                    value={settings.translations.en.research?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["research", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Projects list"
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Özgeçmiş
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">TR Başlık</Label>
                  <Input
                    value={settings.translations.tr.resume?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["resume", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Özgeçmiş"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">TR İndir Butonu</Label>
                  <Input
                    value={settings.translations.tr.resume?.download || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["resume", "download"],
                        e.target.value
                      )
                    }
                    placeholder="CV İndir"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Title</Label>
                  <Input
                    value={settings.translations.en.resume?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["resume", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Resume"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Download Button</Label>
                  <Input
                    value={settings.translations.en.resume?.download || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["resume", "download"],
                        e.target.value
                      )
                    }
                    placeholder="Download CV"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">CV PDF URL</Label>
                  <Input
                    value={settings.cvUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cvUrl: e.target.value,
                      })
                    }
                    placeholder="/cv.pdf veya https://..."
                    className="text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CV indir butonuna tıklandığında indirilecek PDF dosyasının URL'si
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Awards */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Ödüller
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">TR Başlık</Label>
                  <Input
                    value={settings.translations.tr.awards?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["awards", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Ödüller & Sergiler"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">TR Alt Başlık</Label>
                  <Input
                    value={settings.translations.tr.awards?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "tr",
                        ["awards", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Seçili başarılar ve sergiler"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Title</Label>
                  <Input
                    value={settings.translations.en.awards?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["awards", "title"],
                        e.target.value
                      )
                    }
                    placeholder="Awards & Exhibitions"
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">EN Subtitle</Label>
                  <Input
                    value={settings.translations.en.awards?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        "en",
                        ["awards", "subtitle"],
                        e.target.value
                      )
                    }
                    placeholder="Selected achievements and exhibitions"
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Links */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-linear-to-r from-primary/5 to-transparent border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Navigasyon Linkleri
              </CardTitle>
              <CardDescription>Menü ve navigasyon metinleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Türkçe</Label>
                  {[
                    "home",
                    "about",
                    "portfolio",
                    "skills",
                    "research",
                    "resume",
                    "awards",
                    "contact",
                  ].map((nav) => (
                    <div key={nav}>
                      <Label className="text-xs capitalize">{nav}</Label>
                      <Input
                        value={
                          settings.translations.tr.navigation?.[
                            nav as keyof typeof settings.translations.tr.navigation
                          ] || ""
                        }
                        onChange={(e) =>
                          updateTranslations(
                            "tr",
                            ["navigation", nav],
                            e.target.value
                          )
                        }
                        placeholder={
                          nav === "home"
                            ? "Ana Sayfa"
                            : nav === "about"
                            ? "Hakkımda"
                            : nav
                        }
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">English</Label>
                  {[
                    "home",
                    "about",
                    "portfolio",
                    "skills",
                    "research",
                    "resume",
                    "awards",
                    "contact",
                  ].map((nav) => (
                    <div key={nav}>
                      <Label className="text-xs capitalize">{nav}</Label>
                      <Input
                        value={
                          settings.translations.en.navigation?.[
                            nav as keyof typeof settings.translations.en.navigation
                          ] || ""
                        }
                        onChange={(e) =>
                          updateTranslations(
                            "en",
                            ["navigation", nav],
                            e.target.value
                          )
                        }
                        placeholder={
                          nav === "home"
                            ? "Home"
                            : nav === "about"
                            ? "About"
                            : nav
                        }
                        className="text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Visibility Tab */}
        <TabsContent value="visibility" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bölüm Görünürlüğü</CardTitle>
              <CardDescription>
                Hangi bölümlerin ana sayfada görüntüleneceğini kontrol edin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "hero",
                    label: "Hero (Ana Giriş)",
                    desc: "Ana sayfa giriş bölümü",
                  },
                  {
                    key: "about",
                    label: "Hakkımda",
                    desc: "Manifesto ve hikaye bölümü",
                  },
                  {
                    key: "portfolio",
                    label: "Portföy",
                    desc: "Seçili projeler bölümü",
                  },
                  {
                    key: "skills",
                    label: "Yetenekler",
                    desc: "Yetenekler ve araçlar bölümü",
                  },
                  {
                    key: "carousel",
                    label: "Yaratıcı Çalışmalarım",
                    desc: "Carousel bölümü",
                  },
                  {
                    key: "research",
                    label: "Projelerim",
                    desc: "Projeler listesi",
                  },
                  {
                    key: "awards",
                    label: "Ödüller & Sergiler",
                    desc: "Ödül ve sergi bölümü",
                  },
                  {
                    key: "contact",
                    label: "İletişim",
                    desc: "Footer ve iletişim formu",
                  },
                ].map((section) => (
                  <div
                    key={section.key}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-primary/20"
                  >
                    <div className="flex-1">
                      <Label className="text-sm font-medium">
                        {section.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.desc}
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.sectionVisibility?.[
                          section.key as keyof typeof settings.sectionVisibility
                        ] ?? true
                      }
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          sectionVisibility: {
                            ...(settings.sectionVisibility || {
                              hero: true,
                              about: true,
                              portfolio: true,
                              skills: true,
                              carousel: true,
                              research: true,
                              awards: true,
                              contact: true,
                            }),
                            [section.key]: checked,
                          },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Linkleri</CardTitle>
              <CardDescription>
                Hangi sosyal medya hesaplarınızın gösterileceğini yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.socialLinks.map((link, index) => (
                <Card key={link.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>İsim</Label>
                          <Input
                            value={link.name}
                            onChange={(e) =>
                              updateSocialLinks(index, "name", e.target.value)
                            }
                            placeholder="Instagram"
                          />
                        </div>
                        <div>
                          <Label>İkon</Label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={link.icon}
                            onChange={(e) =>
                              updateSocialLinks(
                                index,
                                "icon",
                                e.target.value as SocialLink["icon"]
                              )
                            }
                          >
                            {iconOptions.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon.charAt(0).toUpperCase() + icon.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label>URL</Label>
                          <Input
                            value={link.href}
                            onChange={(e) =>
                              updateSocialLinks(index, "href", e.target.value)
                            }
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) =>
                              updateSocialLinks(index, "enabled", checked)
                            }
                          />
                          <Label>Aktif</Label>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        className="self-start"
                      >
                        Sil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addSocialLink}
                variant="outline"
                className="w-full"
              >
                + Yeni Link Ekle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
              <CardDescription>
                Arama motorları için site bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Başlığı</Label>
                <Input
                  value={settings.metadata.title.default}
                  onChange={(e) =>
                    updateMetadata("title", {
                      ...settings.metadata.title,
                      default: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Başlık Şablonu (%s ile dinamik)</Label>
                <Input
                  value={settings.metadata.title.template}
                  onChange={(e) =>
                    updateMetadata("title", {
                      ...settings.metadata.title,
                      template: e.target.value,
                    })
                  }
                  placeholder="%s | İpek Kökdemir"
                />
              </div>
              <div>
                <Label>Site Açıklaması</Label>
                <Textarea
                  value={settings.metadata.description}
                  onChange={(e) =>
                    updateMetadata("description", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Anahtar Kelimeler (virgülle ayırın)</Label>
                <Input
                  value={settings.metadata.keywords.join(", ")}
                  onChange={(e) =>
                    updateMetadata(
                      "keywords",
                      e.target.value
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="design, portfolio, visual arts"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Yazar/İsim</Label>
                  <Input
                    value={settings.metadata.author}
                    onChange={(e) => updateMetadata("author", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Site Adı</Label>
                  <Input
                    value={settings.metadata.siteName}
                    onChange={(e) => updateMetadata("siteName", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>OG Image (Sosyal Medya Paylaşımları için)</Label>
                <ImageUpload
                  value={settings.metadata.ogImage}
                  onChange={(value) => updateMetadata("ogImage", value)}
                  label=""
                  placeholder="/og-image.jpg"
                  showPreview={true}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Twitter Handle</Label>
                  <Input
                    value={settings.metadata.twitterHandle}
                    onChange={(e) =>
                      updateMetadata("twitterHandle", e.target.value)
                    }
                    placeholder="@ipekkokdemir"
                  />
                </div>
                <div>
                  <Label>Twitter Image</Label>
                  <ImageUpload
                    value={settings.metadata.twitterImage}
                    onChange={(value) => updateMetadata("twitterImage", value)}
                    label=""
                    placeholder="/twitter-image.jpg"
                    showPreview={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
