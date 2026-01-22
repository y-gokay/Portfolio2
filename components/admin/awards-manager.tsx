"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AwardsData, AwardItem, ExhibitionItem } from "@/lib/awards-data";

interface AwardsManagerProps {
  defaultTab?: "awards" | "exhibitions";
}

export function AwardsManager({ defaultTab = "awards" }: AwardsManagerProps) {
  const [awardsData, setAwardsData] = useState<AwardsData>({
    awards: [],
    exhibitions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"awards" | "exhibitions">(defaultTab);

  useEffect(() => {
    fetchAwards();
  }, []);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const fetchAwards = async () => {
    try {
      const response = await fetch("/api/v1/awards");
      const result = await response.json();
      if (result.success) {
        setAwardsData(result.data || { awards: [], exhibitions: [] });
      } else {
        toast.error(result.error || "Ödül ve sergi verileri yüklenemedi");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
      console.error("Awards fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/v1/awards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(awardsData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ödül ve sergi verileri başarıyla kaydedildi");
        fetchAwards();
      } else {
        toast.error(result.error || "Kaydetme başarısız");
        if (result.details) {
          console.error("Hata detayları:", result.details);
        }
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const addAward = () => {
    const newAward: AwardItem = {
      id: Date.now().toString(),
      title: { tr: "", en: "" },
      organization: { tr: "", en: "" },
      year: "",
      category: "academic",
      description: { tr: "", en: "" },
    };
    setAwardsData({
      ...awardsData,
      awards: [...awardsData.awards, newAward],
    });
  };

  const updateAward = (index: number, field: keyof AwardItem, value: any) => {
    const updated = [...awardsData.awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwardsData({ ...awardsData, awards: updated });
  };

  const removeAward = (index: number) => {
    setAwardsData({
      ...awardsData,
      awards: awardsData.awards.filter((_, i) => i !== index),
    });
  };

  const addExhibition = () => {
    const newExhibition: ExhibitionItem = {
      id: Date.now().toString(),
      title: { tr: "", en: "" },
      location: { tr: "", en: "" },
      year: "",
      description: { tr: "", en: "" },
    };
    setAwardsData({
      ...awardsData,
      exhibitions: [...awardsData.exhibitions, newExhibition],
    });
  };

  const updateExhibition = (index: number, field: keyof ExhibitionItem, value: any) => {
    const updated = [...awardsData.exhibitions];
    updated[index] = { ...updated[index], [field]: value };
    setAwardsData({ ...awardsData, exhibitions: updated });
  };

  const removeExhibition = (index: number) => {
    setAwardsData({
      ...awardsData,
      exhibitions: awardsData.exhibitions.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>;
  }

  const renderAwardsContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ödüller</h3>
        <Button onClick={addAward} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ödül Ekle
        </Button>
      </div>
      {awardsData.awards.map((award, index) => (
        <Card key={award.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Ödül {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAward(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>TR Başlık</Label>
                <Input
                  value={award.title.tr}
                  onChange={(e) =>
                    updateAward(index, "title", {
                      ...award.title,
                      tr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>EN Title</Label>
                <Input
                  value={award.title.en}
                  onChange={(e) =>
                    updateAward(index, "title", {
                      ...award.title,
                      en: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>TR Organizasyon</Label>
                <Input
                  value={award.organization.tr}
                  onChange={(e) =>
                    updateAward(index, "organization", {
                      ...award.organization,
                      tr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>EN Organization</Label>
                <Input
                  value={award.organization.en}
                  onChange={(e) =>
                    updateAward(index, "organization", {
                      ...award.organization,
                      en: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Yıl</Label>
              <Input
                value={award.year}
                onChange={(e) => updateAward(index, "year", e.target.value)}
                placeholder="2024"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <select
                value={award.category}
                onChange={(e) => updateAward(index, "category", e.target.value as AwardItem["category"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="academic">Akademik</option>
                <option value="competition">Yarışma</option>
                <option value="recognition">Takdir</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div>
              <Label>TR Açıklama</Label>
              <Textarea
                value={award.description?.tr || ""}
                onChange={(e) =>
                  updateAward(index, "description", {
                    ...(award.description || { tr: "", en: "" }),
                    tr: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label>EN Description</Label>
              <Textarea
                value={award.description?.en || ""}
                onChange={(e) =>
                  updateAward(index, "description", {
                    ...(award.description || { tr: "", en: "" }),
                    en: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderExhibitionsContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sergiler</h3>
        <Button onClick={addExhibition} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Sergi Ekle
        </Button>
      </div>
      {awardsData.exhibitions.map((exhibition, index) => (
        <Card key={exhibition.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Sergi {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExhibition(index)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>TR Başlık</Label>
                <Input
                  value={exhibition.title.tr}
                  onChange={(e) =>
                    updateExhibition(index, "title", {
                      ...exhibition.title,
                      tr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>EN Title</Label>
                <Input
                  value={exhibition.title.en}
                  onChange={(e) =>
                    updateExhibition(index, "title", {
                      ...exhibition.title,
                      en: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>TR Konum</Label>
                <Input
                  value={exhibition.location.tr}
                  onChange={(e) =>
                    updateExhibition(index, "location", {
                      ...exhibition.location,
                      tr: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>EN Location</Label>
                <Input
                  value={exhibition.location.en}
                  onChange={(e) =>
                    updateExhibition(index, "location", {
                      ...exhibition.location,
                      en: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Yıl</Label>
              <Input
                value={exhibition.year}
                onChange={(e) => updateExhibition(index, "year", e.target.value)}
                placeholder="2024"
              />
            </div>
            <div>
              <Label>TR Açıklama</Label>
              <Textarea
                value={exhibition.description?.tr || ""}
                onChange={(e) =>
                  updateExhibition(index, "description", {
                    ...(exhibition.description || { tr: "", en: "" }),
                    tr: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label>EN Description</Label>
              <Textarea
                value={exhibition.description?.en || ""}
                onChange={(e) =>
                  updateExhibition(index, "description", {
                    ...(exhibition.description || { tr: "", en: "" }),
                    en: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            {activeTab === "awards" ? "Ödüller Yönetimi" : "Sergiler Yönetimi"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeTab === "awards"
              ? "Ödül bilgilerinizi buradan yönetin"
              : "Sergi bilgilerinizi buradan yönetin"}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {activeTab === "awards" ? renderAwardsContent() : renderExhibitionsContent()}
    </div>
  );
}
