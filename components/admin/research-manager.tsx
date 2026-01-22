"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResearchData {
  research: {
    tr: {
      title: string;
      subtitle: string;
    };
    en: {
      title: string;
      subtitle: string;
    };
  };
}

export function ResearchManager() {
  const [data, setData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/v1/site-settings/research");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error || "Veriler yüklenemedi");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/v1/site-settings/research", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ayarlar kaydedildi");
        fetchData();
      } else {
        toast.error(result.error || "Kaydetme başarısız");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-2xl font-bold">Projelerim</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Projelerim bölümü başlıklarını yönetin
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      <Tabs defaultValue="tr" className="w-full">
        <TabsList>
          <TabsTrigger value="tr">Türkçe</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
        <TabsContent value="tr" className="space-y-4">
          <div>
            <Label>Başlık</Label>
            <Input
              value={data.research.tr.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  research: {
                    ...data.research,
                    tr: {
                      ...data.research.tr,
                      title: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Alt Başlık</Label>
            <Input
              value={data.research.tr.subtitle || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  research: {
                    ...data.research,
                    tr: {
                      ...data.research.tr,
                      subtitle: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={data.research.en.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  research: {
                    ...data.research,
                    en: {
                      ...data.research.en,
                      title: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={data.research.en.subtitle || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  research: {
                    ...data.research,
                    en: {
                      ...data.research.en,
                      subtitle: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
