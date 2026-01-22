"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/use-api";

interface HeroData {
  heroImages: {
    image1: string;
    image2: string;
    image3: string;
  };
  manifesto: {
    tr: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
  };
}

export function HeroManager() {
  const { data, loading, saving, fetchData, saveData, setData } = useApi<HeroData>({
    successMessage: "Ayarlar kaydedildi",
  });

  useEffect(() => {
    fetchData("/api/v1/site-settings/hero");
  }, [fetchData]);

  const handleSave = async () => {
    if (!data) return;
    await saveData("/api/v1/site-settings/hero", "PUT", data);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
  }

  if (!data) {
    return <div className="text-center py-8 text-destructive">Veriler yüklenemedi</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ana Sayfa (Hero)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hero görselleri ve manifesto metinlerini yönetin
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Hero Görselleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <Label>Görsel {num}</Label>
                <ImageUpload
                  value={data.heroImages[`image${num}` as keyof typeof data.heroImages] || ""}
                  onChange={(value) =>
                    setData({
                      ...data,
                      heroImages: {
                        ...data.heroImages,
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
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Manifesto Metinleri</h3>
          <Tabs defaultValue="tr" className="w-full">
            <TabsList>
              <TabsTrigger value="tr">Türkçe</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TabsContent value="tr" className="space-y-4">
              <div>
                <Label>Başlık</Label>
                <Textarea
                  value={data.manifesto.tr.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      manifesto: {
                        ...data.manifesto,
                        tr: {
                          ...data.manifesto.tr,
                          title: e.target.value,
                        },
                      },
                    })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Açıklama</Label>
                <Textarea
                  value={data.manifesto.tr.description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      manifesto: {
                        ...data.manifesto,
                        tr: {
                          ...data.manifesto.tr,
                          description: e.target.value,
                        },
                      },
                    })
                  }
                  rows={4}
                />
              </div>
            </TabsContent>
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Textarea
                  value={data.manifesto.en.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      manifesto: {
                        ...data.manifesto,
                        en: {
                          ...data.manifesto.en,
                          title: e.target.value,
                        },
                      },
                    })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={data.manifesto.en.description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      manifesto: {
                        ...data.manifesto,
                        en: {
                          ...data.manifesto.en,
                          description: e.target.value,
                        },
                      },
                    })
                  }
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
