"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X, Trash2 } from "lucide-react";
import { SiteSettings, SocialLink } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        toast.success("Site ayarları kaydedildi");
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
    return <div className="text-muted-foreground">Yükleniyor...</div>;
  }

  if (!settings) {
    return <div className="text-muted-foreground">Site ayarları yüklenemedi</div>;
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
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero & Manifesto</TabsTrigger>
          <TabsTrigger value="features">Yetenekler</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="metadata">SEO & Metadata</TabsTrigger>
        </TabsList>

        {/* Hero & Manifesto Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section (TR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>İsim</Label>
                <Input
                  value={settings.translations.tr.hero.name}
                  onChange={(e) => updateTranslations("tr", ["hero", "name"], e.target.value)}
                />
              </div>
              <div>
                <Label>Alt Başlık</Label>
                <Input
                  value={settings.translations.tr.hero.subtitle}
                  onChange={(e) => updateTranslations("tr", ["hero", "subtitle"], e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Section (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={settings.translations.en.hero.name}
                  onChange={(e) => updateTranslations("en", ["hero", "name"], e.target.value)}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={settings.translations.en.hero.subtitle}
                  onChange={(e) => updateTranslations("en", ["hero", "subtitle"], e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manifesto (TR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Başlık (\\n ile satır sonu)</Label>
                <Textarea
                  value={settings.translations.tr.manifesto.title}
                  onChange={(e) => updateTranslations("tr", ["manifesto", "title"], e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Açıklama</Label>
                <Textarea
                  value={settings.translations.tr.manifesto.description}
                  onChange={(e) => updateTranslations("tr", ["manifesto", "description"], e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manifesto (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title (use \\n for line breaks)</Label>
                <Textarea
                  value={settings.translations.en.manifesto.title}
                  onChange={(e) => updateTranslations("en", ["manifesto", "title"], e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={settings.translations.en.manifesto.description}
                  onChange={(e) => updateTranslations("en", ["manifesto", "description"], e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diğer Metinler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Portföy Etiketi (TR)</Label>
                  <Input
                    value={settings.translations.tr.showcase.label}
                    onChange={(e) => updateTranslations("tr", ["showcase", "label"], e.target.value)}
                  />
                </div>
                <div>
                  <Label>Portfolio Label (EN)</Label>
                  <Input
                    value={settings.translations.en.showcase.label}
                    onChange={(e) => updateTranslations("en", ["showcase", "label"], e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Carousel Başlığı (TR)</Label>
                  <Input
                    value={settings.translations.tr.carousel.title}
                    onChange={(e) => updateTranslations("tr", ["carousel", "title"], e.target.value)}
                  />
                </div>
                <div>
                  <Label>Carousel Title (EN)</Label>
                  <Input
                    value={settings.translations.en.carousel.title}
                    onChange={(e) => updateTranslations("en", ["carousel", "title"], e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Projeler Etiketi (TR)</Label>
                  <Input
                    value={settings.translations.tr.insights.label}
                    onChange={(e) => updateTranslations("tr", ["insights", "label"], e.target.value)}
                  />
                </div>
                <div>
                  <Label>Projects Label (EN)</Label>
                  <Input
                    value={settings.translations.en.insights.label}
                    onChange={(e) => updateTranslations("en", ["insights", "label"], e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yetenekler Bölümü (TR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Bölüm Başlığı</Label>
                <Input
                  value={settings.translations.tr.features.label}
                  onChange={(e) => updateTranslations("tr", ["features", "label"], e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tipografi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Başlık</Label>
                      <Input
                        value={settings.translations.tr.features.typography.title}
                        onChange={(e) => updateTranslations("tr", ["features", "typography", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Açıklama</Label>
                      <Input
                        value={settings.translations.tr.features.typography.description}
                        onChange={(e) => updateTranslations("tr", ["features", "typography", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Düzen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Başlık</Label>
                      <Input
                        value={settings.translations.tr.features.layout.title}
                        onChange={(e) => updateTranslations("tr", ["features", "layout", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Açıklama</Label>
                      <Input
                        value={settings.translations.tr.features.layout.description}
                        onChange={(e) => updateTranslations("tr", ["features", "layout", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Renk</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Başlık</Label>
                      <Input
                        value={settings.translations.tr.features.color.title}
                        onChange={(e) => updateTranslations("tr", ["features", "color", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Açıklama</Label>
                      <Input
                        value={settings.translations.tr.features.color.description}
                        onChange={(e) => updateTranslations("tr", ["features", "color", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Section (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Section Label</Label>
                <Input
                  value={settings.translations.en.features.label}
                  onChange={(e) => updateTranslations("en", ["features", "label"], e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Typography</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={settings.translations.en.features.typography.title}
                        onChange={(e) => updateTranslations("en", ["features", "typography", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={settings.translations.en.features.typography.description}
                        onChange={(e) => updateTranslations("en", ["features", "typography", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={settings.translations.en.features.layout.title}
                        onChange={(e) => updateTranslations("en", ["features", "layout", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={settings.translations.en.features.layout.description}
                        onChange={(e) => updateTranslations("en", ["features", "layout", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Color</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={settings.translations.en.features.color.title}
                        onChange={(e) => updateTranslations("en", ["features", "color", "title"], e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={settings.translations.en.features.color.description}
                        onChange={(e) => updateTranslations("en", ["features", "color", "description"], e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer (TR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>İletişim Başlığı</Label>
                <Input
                  value={settings.translations.tr.footer.contact.title}
                  onChange={(e) => updateTranslations("tr", ["footer", "contact", "title"], e.target.value)}
                />
              </div>
              <div>
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={settings.translations.tr.footer.contact.email}
                  onChange={(e) => updateTranslations("tr", ["footer", "contact", "email"], e.target.value)}
                />
              </div>
              <div>
                <Label>Rol/Unvan</Label>
                <Input
                  value={settings.translations.tr.footer.contact.role}
                  onChange={(e) => updateTranslations("tr", ["footer", "contact", "role"], e.target.value)}
                />
              </div>
              <div>
                <Label>Telif Hakkı Metni</Label>
                <Input
                  value={settings.translations.tr.footer.copyright}
                  onChange={(e) => updateTranslations("tr", ["footer", "copyright"], e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Contact Title</Label>
                <Input
                  value={settings.translations.en.footer.contact.title}
                  onChange={(e) => updateTranslations("en", ["footer", "contact", "title"], e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.translations.en.footer.contact.email}
                  onChange={(e) => updateTranslations("en", ["footer", "contact", "email"], e.target.value)}
                />
              </div>
              <div>
                <Label>Role/Title</Label>
                <Input
                  value={settings.translations.en.footer.contact.role}
                  onChange={(e) => updateTranslations("en", ["footer", "contact", "role"], e.target.value)}
                />
              </div>
              <div>
                <Label>Copyright Text</Label>
                <Input
                  value={settings.translations.en.footer.copyright}
                  onChange={(e) => updateTranslations("en", ["footer", "copyright"], e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sosyal Medya Linkleri</h3>
            <Button onClick={addSocialLink} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Link Ekle
            </Button>
          </div>

          {settings.socialLinks.map((link, index) => (
            <Card key={link.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label>İsim</Label>
                      <Input
                        value={link.name}
                        onChange={(e) => updateSocialLinks(index, "name", e.target.value)}
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
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={link.href}
                        onChange={(e) => updateSocialLinks(index, "href", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.enabled}
                        onCheckedChange={(checked) => updateSocialLinks(index, "enabled", checked)}
                      />
                      <Label>Aktif</Label>
                    </div>
                    <div>
                      <Label>Aria Label (TR)</Label>
                      <Input
                        value={link.ariaLabel.tr}
                        onChange={(e) =>
                          updateSocialLinks(index, "ariaLabel", {
                            ...link.ariaLabel,
                            tr: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Aria Label (EN)</Label>
                      <Input
                        value={link.ariaLabel.en}
                        onChange={(e) =>
                          updateSocialLinks(index, "ariaLabel", {
                            ...link.ariaLabel,
                            en: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
              <CardDescription>
                Site metadata ve SEO ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Başlığı (Default)</Label>
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
                <Label>Başlık Şablonu</Label>
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
                />
              </div>
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
              <div>
                <Label>OG Image URL</Label>
                <Input
                  value={settings.metadata.ogImage}
                  onChange={(e) => updateMetadata("ogImage", e.target.value)}
                  placeholder="/og-image.jpg"
                />
              </div>
              <div>
                <Label>Twitter Handle</Label>
                <Input
                  value={settings.metadata.twitterHandle}
                  onChange={(e) => updateMetadata("twitterHandle", e.target.value)}
                  placeholder="@ipekkokdemir"
                />
              </div>
              <div>
                <Label>Twitter Image URL</Label>
                <Input
                  value={settings.metadata.twitterImage}
                  onChange={(e) => updateMetadata("twitterImage", e.target.value)}
                  placeholder="/twitter-image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

