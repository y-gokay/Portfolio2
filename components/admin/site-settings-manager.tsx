"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Settings,
  Home,
  User,
  Palette,
  Briefcase,
  Award,
  Mail,
  FolderKanban,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
import { SiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";
import { FileUpload } from "./file-upload";
import {
  formatUserFriendlyError,
  groupErrorsByCategory,
} from "@/lib/user-friendly-errors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioManager } from "./portfolio-manager";
import { ResumeManager } from "./resume-manager";
import { AwardsManager } from "./awards-manager";
import { AboutManager } from "./about-manager";
import { SkillsManager } from "./skills-manager";

type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "portfolio"
  | "research"
  | "awards"
  | "exhibitions"
  | "resume"
  | "gallery"
  | "contact"
  | "general";

interface SectionConfig {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: SectionConfig[] = [
  { id: "hero", label: "Ana Sayfa (Hero)", icon: Home },
  { id: "about", label: "Hakkımda", icon: User },
  { id: "skills", label: "Yetenekler", icon: Palette },
  { id: "portfolio", label: "Portföy", icon: FolderKanban },
  { id: "research", label: "Projelerim", icon: BookOpen },
  { id: "awards", label: "Ödüller", icon: Award },
  { id: "exhibitions", label: "Sergiler", icon: Award },
  { id: "resume", label: "Özgeçmiş", icon: Briefcase },
  { id: "gallery", label: "Galeri", icon: ImageIcon },
  { id: "contact", label: "İletişim", icon: Mail },
  { id: "general", label: "Genel Ayarlar", icon: Settings },
];

interface SiteSettingsManagerProps {
  activeSection?: SectionId;
}

export function SiteSettingsManager({
  activeSection: initialSection,
}: SiteSettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(
    initialSection || "general"
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
        const response = await fetch("/api/v1/site-settings");
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      } else {
        toast.error(result.error || "Ayarlar yüklenemedi");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch("/api/v1/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ayarlar kaydedildi");
        fetchSettings();
      } else {
        let errorMessage = result.error || "Kaydetme başarısız";
        if (result.details && Array.isArray(result.details)) {
          const groupedErrors = groupErrorsByCategory(result.details);
          errorMessage = `Lütfen ${result.details.length} hatayı düzeltin:\n\n`;
          groupedErrors.forEach(({ category, errors }) => {
            errorMessage += `${category}:\n`;
            errors.slice(0, 3).forEach((err) => {
              errorMessage += `  • ${err}\n`;
            });
            if (errors.length > 3) {
              errorMessage += `  • ...ve ${errors.length - 3} hata daha\n`;
            }
          });
        }
        toast.error(errorMessage.trim(), { duration: 20000 });
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  const updateTranslations = (
    path: string[],
    value: any,
    lang: "tr" | "en" = "tr"
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-destructive">
        Ayarlar yüklenemedi
      </div>
    );
  }

  const renderSection = () => {
    if (!settings) return null;

    switch (activeSection) {
      case "hero":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Ana Sayfa (Hero)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <Label>Görsel {num}</Label>
                  <ImageUpload
                    value={
                      settings.heroImages?.[
                        `image${num}` as keyof typeof settings.heroImages
                      ] || ""
                    }
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        heroImages: {
                          ...settings.heroImages,
                          [`image${num}`]: value,
                        },
                      })
                    }
                    label=""
                    placeholder="/placeholder.svg"
                    showPreview={true}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <Label>Başlık (TR)</Label>
                <Textarea
                  value={settings.translations.tr.manifesto.title}
                  onChange={(e) =>
                    updateTranslations(["manifesto", "title"], e.target.value)
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Açıklama (TR)</Label>
                <Textarea
                  value={settings.translations.tr.manifesto.description}
                  onChange={(e) =>
                    updateTranslations(
                      ["manifesto", "description"],
                      e.target.value
                    )
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Title (EN)</Label>
                <Textarea
                  value={settings.translations.en.manifesto.title}
                  onChange={(e) =>
                    updateTranslations(
                      ["manifesto", "title"],
                      e.target.value,
                      "en"
                    )
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={settings.translations.en.manifesto.description}
                  onChange={(e) =>
                    updateTranslations(
                      ["manifesto", "description"],
                      e.target.value,
                      "en"
                    )
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case "about":
        return <AboutManager />;

      case "skills":
        return <SkillsManager />;

      case "portfolio":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Portföy Yönetimi</h3>
            <PortfolioManager />
          </div>
        );

      case "research":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Projelerim</h3>
            <Tabs defaultValue="tr" className="w-full">
              <TabsList>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="tr" className="space-y-4">
                <div>
                  <Label>Başlık</Label>
                  <Input
                    value={settings.translations.tr.research?.title || ""}
                    onChange={(e) =>
                      updateTranslations(["research", "title"], e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Alt Başlık</Label>
                  <Input
                    value={settings.translations.tr.research?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        ["research", "subtitle"],
                        e.target.value
                      )
                    }
                  />
                </div>
              </TabsContent>
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={settings.translations.en.research?.title || ""}
                    onChange={(e) =>
                      updateTranslations(
                        ["research", "title"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={settings.translations.en.research?.subtitle || ""}
                    onChange={(e) =>
                      updateTranslations(
                        ["research", "subtitle"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "awards":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Ödüller Yönetimi</h3>
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold">Bölüm Başlıkları</h4>
              <Tabs defaultValue="tr" className="w-full">
                <TabsList>
                  <TabsTrigger value="tr">Türkçe</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
                <TabsContent value="tr" className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={settings.translations.tr.awards?.title || ""}
                      onChange={(e) =>
                        updateTranslations(["awards", "title"], e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Alt Başlık</Label>
                    <Input
                      value={settings.translations.tr.awards?.subtitle || ""}
                      onChange={(e) =>
                        updateTranslations(["awards", "subtitle"], e.target.value)
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={settings.translations.en.awards?.title || ""}
                      onChange={(e) =>
                        updateTranslations(
                          ["awards", "title"],
                          e.target.value,
                          "en"
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={settings.translations.en.awards?.subtitle || ""}
                      onChange={(e) =>
                        updateTranslations(
                          ["awards", "subtitle"],
                          e.target.value,
                          "en"
                        )
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <AwardsManager defaultTab="awards" />
          </div>
        );

      case "exhibitions":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Sergiler Yönetimi</h3>
            <AwardsManager defaultTab="exhibitions" />
          </div>
        );

      case "resume":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Özgeçmiş Yönetimi</h3>
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold">Bölüm Başlıkları ve CV</h4>
              <Tabs defaultValue="tr" className="w-full">
                <TabsList>
                  <TabsTrigger value="tr">Türkçe</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
                <TabsContent value="tr" className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={settings.translations.tr.resume?.title || ""}
                      onChange={(e) =>
                        updateTranslations(["resume", "title"], e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>İndir Butonu Metni</Label>
                    <Input
                      value={settings.translations.tr.resume?.download || ""}
                      onChange={(e) =>
                        updateTranslations(["resume", "download"], e.target.value)
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={settings.translations.en.resume?.title || ""}
                      onChange={(e) =>
                        updateTranslations(
                          ["resume", "title"],
                          e.target.value,
                          "en"
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Download Button Text</Label>
                    <Input
                      value={settings.translations.en.resume?.download || ""}
                      onChange={(e) =>
                        updateTranslations(
                          ["resume", "download"],
                          e.target.value,
                          "en"
                        )
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <div className="space-y-2 pt-4">
                <Label>CV PDF</Label>
                <FileUpload
                  value={settings.cvUrl || ""}
                  onChange={(value) => setSettings({ ...settings, cvUrl: value })}
                  label="CV PDF"
                  placeholder="/cv.pdf"
                  accept="application/pdf"
                  fileType="pdf"
                  maxSizeMB={10}
                />
              </div>
            </div>
            <ResumeManager />
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Galeri</h3>
            <div className="text-center py-8 text-muted-foreground">
              Galeri özelliği yakında eklenecek
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">İletişim</h3>
            <Tabs defaultValue="tr" className="w-full">
              <TabsList>
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="tr" className="space-y-4">
                <div>
                  <Label>İletişim Başlığı</Label>
                  <Input
                    value={settings.translations.tr.footer.contact.title}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "title"],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>E-posta</Label>
                  <Input
                    type="email"
                    value={settings.translations.tr.footer.contact.email}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "email"],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Rol/Unvan</Label>
                  <Input
                    value={settings.translations.tr.footer.contact.role}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "role"],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Telif Hakkı</Label>
                  <Input
                    value={settings.translations.tr.footer.copyright}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "copyright"],
                        e.target.value
                      )
                    }
                  />
                </div>
              </TabsContent>
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Contact Title</Label>
                  <Input
                    value={settings.translations.en.footer.contact.title}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "title"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.translations.en.footer.contact.email}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "email"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Role/Title</Label>
                  <Input
                    value={settings.translations.en.footer.contact.role}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "contact", "role"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Copyright</Label>
                  <Input
                    value={settings.translations.en.footer.copyright}
                    onChange={(e) =>
                      updateTranslations(
                        ["footer", "copyright"],
                        e.target.value,
                        "en"
                      )
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "general":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Genel Ayarlar</h3>

            {/* Section Visibility */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h4 className="font-semibold mb-4">Bölüm Görünürlüğü</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Hangi bölümlerin sitede görünür olacağını kontrol edin. Kapatılan bölümler hem ana sayfadan hem de navigasyondan gizlenir.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "hero", label: "Ana Sayfa (Hero)" },
                  { key: "about", label: "Hakkımda" },
                  { key: "portfolio", label: "Portföy" },
                  { key: "skills", label: "Yetenekler" },
                  { key: "research", label: "Projelerim" },
                  { key: "awards", label: "Ödüller" },
                  { key: "exhibitions", label: "Sergiler" },
                  { key: "resume", label: "Özgeçmiş Sayfası" },
                  { key: "contact", label: "İletişim" },
                ].map((section) => (
                  <div
                    key={section.key}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Label className="font-medium cursor-pointer" htmlFor={`visibility-${section.key}`}>
                      {section.label}
                    </Label>
                    <Switch
                      id={`visibility-${section.key}`}
                      checked={
                        settings.sectionVisibility?.[
                          section.key as keyof typeof settings.sectionVisibility
                        ] ?? true
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          sectionVisibility: {
                            hero: settings.sectionVisibility?.hero ?? true,
                            about: settings.sectionVisibility?.about ?? true,
                            portfolio:
                              settings.sectionVisibility?.portfolio ?? true,
                            skills: settings.sectionVisibility?.skills ?? true,
                            carousel:
                              settings.sectionVisibility?.carousel ?? true,
                            research:
                              settings.sectionVisibility?.research ?? true,
                            awards: settings.sectionVisibility?.awards ?? true,
                            exhibitions: settings.sectionVisibility?.exhibitions ?? true,
                            resume: settings.sectionVisibility?.resume ?? true,
                            contact:
                              settings.sectionVisibility?.contact ?? true,
                            [section.key]: checked,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4 p-6 border rounded-lg">
              <h4 className="font-semibold">SEO & Metadata</h4>
              <div className="space-y-4">
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
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Ayarları</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Bölüm ayarlarını yönetin
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="border-b">
        <div className="flex flex-wrap gap-2 -mb-px">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 border-b-2 transition-colors
                  ${
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      <div className="p-6 border rounded-lg bg-card">{renderSection()}</div>
    </div>
  );
}
