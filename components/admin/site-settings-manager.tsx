"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { SiteSettings, SocialLink } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./image-upload";
import Image from "next/image";

export function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings");
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      toast.error("Site ayarları yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ayarlar kaydedildi");
        fetchSettings();
      } else {
        toast.error(result.error || "Kaydetme başarısız");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const updateTranslations = (lang: "tr" | "en", path: string[], value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings };
    let current: any = newSettings.translations[lang];
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  const updateSocialLinks = (index: number, field: keyof SocialLink, value: any) => {
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

  const updateMetadata = (field: keyof SiteSettings["metadata"], value: any) => {
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
    return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8 text-muted-foreground">Site ayarları yüklenemedi</div>;
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

  const activeLang = previewLang;

  return (
    <div className="space-y-6">
      {/* Header with Save and Preview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">Site Ayarları</h2>
          <p className="text-sm text-muted-foreground">İçeriğinizi buradan yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Önizlemeyi Gizle" : "Önizle"}
          </Button>
          {showPreview && (
            <Button 
              variant="outline" 
              onClick={() => setPreviewLang(previewLang === "tr" ? "en" : "tr")}
              size="sm"
            >
              {previewLang === "tr" ? "EN" : "TR"}
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && settings && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Önizleme ({activeLang.toUpperCase()})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Preview */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Hero Section</h3>
              <div className="grid grid-cols-3 gap-2">
                {settings.heroImages && (
                  <>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                      <Image
                        src={settings.heroImages.image1 || "/placeholder.svg"}
                        alt="Preview 1"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                      <Image
                        src={settings.heroImages.image2 || "/placeholder.svg"}
                        alt="Preview 2"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border opacity-70">
                      <Image
                        src={settings.heroImages.image3 || "/placeholder.svg"}
                        alt="Preview 3"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-2xl font-serif">{settings.translations[activeLang].hero.name}</p>
                <p className="text-lg italic text-muted-foreground">{settings.translations[activeLang].hero.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
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
                Ana sayfa hero bölümündeki görselleri yönetin. 3 görsel kullanılır.
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
                    placeholder="/minimal-architecture-portfolio-with-clean-lines.jpg"
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
                    placeholder="/fashion-photography-editorial-black-and-white.jpg"
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
                    placeholder="/modern-ui-design-portfolio-mockup.jpg"
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
                    onChange={(e) => updateTranslations("tr", ["hero", "name"], e.target.value)}
                    placeholder="İpek Kökdemir"
                  />
                </div>
                <div>
                  <Label>Alt Başlık</Label>
                  <Input
                    value={settings.translations.tr.hero.subtitle}
                    onChange={(e) => updateTranslations("tr", ["hero", "subtitle"], e.target.value)}
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
                    onChange={(e) => updateTranslations("en", ["hero", "name"], e.target.value)}
                    placeholder="İpek Kökdemir"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={settings.translations.en.hero.subtitle}
                    onChange={(e) => updateTranslations("en", ["hero", "subtitle"], e.target.value)}
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
              <CardDescription>Her iki dil için manifesto metni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Türkçe Başlık</Label>
                  <Textarea
                    value={settings.translations.tr.manifesto.title}
                    onChange={(e) => updateTranslations("tr", ["manifesto", "title"], e.target.value)}
                    rows={2}
                    placeholder="Başlık metni"
                  />
                  <Label>Türkçe Açıklama</Label>
                  <Textarea
                    value={settings.translations.tr.manifesto.description}
                    onChange={(e) => updateTranslations("tr", ["manifesto", "description"], e.target.value)}
                    rows={4}
                    placeholder="Açıklama metni"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English Title</Label>
                  <Textarea
                    value={settings.translations.en.manifesto.title}
                    onChange={(e) => updateTranslations("en", ["manifesto", "title"], e.target.value)}
                    rows={2}
                    placeholder="Title text"
                  />
                  <Label>English Description</Label>
                  <Textarea
                    value={settings.translations.en.manifesto.description}
                    onChange={(e) => updateTranslations("en", ["manifesto", "description"], e.target.value)}
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
                    onChange={(e) => updateTranslations("tr", ["features", "label"], e.target.value)}
                  />
                </div>
                <div>
                  <Label>Section Label (EN)</Label>
                  <Input
                    value={settings.translations.en.features.label}
                    onChange={(e) => updateTranslations("en", ["features", "label"], e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {["typography", "layout", "color"].map((feature) => (
                  <Card key={feature}>
                    <CardHeader>
                      <CardTitle className="text-sm capitalize">{feature}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs">TR Başlık</Label>
                        <Input
                          value={settings.translations.tr.features[feature as keyof typeof settings.translations.tr.features].title}
                          onChange={(e) =>
                            updateTranslations("tr", ["features", feature as string, "title"], e.target.value)
                          }
                          size={1}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">TR Açıklama</Label>
                        <Input
                          value={settings.translations.tr.features[feature as keyof typeof settings.translations.tr.features].description}
                          onChange={(e) =>
                            updateTranslations("tr", ["features", feature as string, "description"], e.target.value)
                          }
                          size={1}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EN Title</Label>
                        <Input
                          value={settings.translations.en.features[feature as keyof typeof settings.translations.en.features].title}
                          onChange={(e) =>
                            updateTranslations("en", ["features", feature as string, "title"], e.target.value)
                          }
                          size={1}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EN Description</Label>
                        <Input
                          value={settings.translations.en.features[feature as keyof typeof settings.translations.en.features].description}
                          onChange={(e) =>
                            updateTranslations("en", ["features", feature as string, "description"], e.target.value)
                          }
                          size={1}
                          className="text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    onChange={(e) => updateTranslations("tr", ["footer", "contact", "title"], e.target.value)}
                    placeholder="İletişim"
                  />
                  <Input
                    type="email"
                    value={settings.translations.tr.footer.contact.email}
                    onChange={(e) => updateTranslations("tr", ["footer", "contact", "email"], e.target.value)}
                    placeholder="E-posta"
                  />
                  <Input
                    value={settings.translations.tr.footer.contact.role}
                    onChange={(e) => updateTranslations("tr", ["footer", "contact", "role"], e.target.value)}
                    placeholder="Rol/Unvan"
                  />
                  <Input
                    value={settings.translations.tr.footer.copyright}
                    onChange={(e) => updateTranslations("tr", ["footer", "copyright"], e.target.value)}
                    placeholder="Telif hakkı"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English</Label>
                  <Input
                    value={settings.translations.en.footer.contact.title}
                    onChange={(e) => updateTranslations("en", ["footer", "contact", "title"], e.target.value)}
                    placeholder="Contact"
                  />
                  <Input
                    type="email"
                    value={settings.translations.en.footer.contact.email}
                    onChange={(e) => updateTranslations("en", ["footer", "contact", "email"], e.target.value)}
                    placeholder="Email"
                  />
                  <Input
                    value={settings.translations.en.footer.contact.role}
                    onChange={(e) => updateTranslations("en", ["footer", "contact", "role"], e.target.value)}
                    placeholder="Role/Title"
                  />
                  <Input
                    value={settings.translations.en.footer.copyright}
                    onChange={(e) => updateTranslations("en", ["footer", "copyright"], e.target.value)}
                    placeholder="Copyright"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Linkleri</CardTitle>
              <CardDescription>Hangi sosyal medya hesaplarınızın gösterileceğini yönetin</CardDescription>
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
                            onChange={(e) => updateSocialLinks(index, "name", e.target.value)}
                            placeholder="Instagram"
                          />
                        </div>
                        <div>
                          <Label>İkon</Label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={link.icon}
                            onChange={(e) => updateSocialLinks(index, "icon", e.target.value as SocialLink["icon"])}
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
                            onChange={(e) => updateSocialLinks(index, "href", e.target.value)}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) => updateSocialLinks(index, "enabled", checked)}
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
              <Button onClick={addSocialLink} variant="outline" className="w-full">
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
              <CardDescription>Arama motorları için site bilgileri</CardDescription>
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
                  onChange={(e) => updateMetadata("description", e.target.value)}
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
                      e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
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
                    onChange={(e) => updateMetadata("twitterHandle", e.target.value)}
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
