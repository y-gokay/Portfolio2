"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SkillsData {
  skills: {
    tr: {
      title: string;
      expertise: {
        title: string;
      };
      tools: {
        title: string;
        items: string[];
      };
    };
    en: {
      title: string;
      expertise: {
        title: string;
      };
      tools: {
        title: string;
        items: string[];
      };
    };
  };
}

export function SkillsManager() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/v1/site-settings/skills");
      const result = await response.json();
      if (result.success) {
        // Migrate old category structure to new flat structure if needed
        const migratedData = migrateData(result.data);
        setData(migratedData);
      } else {
        toast.error(result.error || "Veriler yüklenemedi");
      }
    } catch (error) {
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  // Migrate old category structure to new flat structure
  const migrateData = (data: any): SkillsData => {
    if (!data || !data.skills) return data;

    const migrateLang = (lang: any) => {
      if (!lang?.tools) return lang;
      
      // If already migrated (has items array), return as is
      if (lang.tools.items && Array.isArray(lang.tools.items)) {
        return lang;
      }

      // Migrate from categories to flat items
      const allItems: string[] = [];
      if (lang.tools.categories) {
        if (lang.tools.categories.design?.items) {
          allItems.push(...lang.tools.categories.design.items);
        }
        if (lang.tools.categories.prototyping?.items) {
          allItems.push(...lang.tools.categories.prototyping.items);
        }
        if (lang.tools.categories.development?.items) {
          allItems.push(...lang.tools.categories.development.items);
        }
      }

      return {
        ...lang,
        tools: {
          title: lang.tools.title || "",
          items: allItems,
        },
      };
    };

    return {
      skills: {
        tr: migrateLang(data.skills?.tr),
        en: migrateLang(data.skills?.en),
      },
    };
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/v1/site-settings/skills", {
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
    return (
      <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-destructive">Veriler yüklenemedi</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Yetenekler</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Yetenekler bölümü içeriğini yönetin
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
            <Label>Bölüm Başlığı</Label>
            <Input
              value={data.skills.tr.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    tr: {
                      ...data.skills.tr,
                      title: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Uzmanlık Başlığı</Label>
            <Input
              value={data.skills.tr.expertise?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    tr: {
                      ...data.skills.tr,
                      expertise: {
                        ...data.skills.tr.expertise,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Araçlar Başlığı</Label>
            <Input
              value={data.skills.tr.tools?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    tr: {
                      ...data.skills.tr,
                      tools: {
                        ...data.skills.tr.tools,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Yetenekler</Label>
              <Button
                onClick={() => {
                  const currentItems = data.skills.tr.tools?.items || [];
                  setData({
                    ...data,
                    skills: {
                      ...data.skills,
                      tr: {
                        ...data.skills.tr,
                        tools: {
                          ...data.skills.tr.tools,
                          items: [...currentItems, ""],
                        },
                      },
                    },
                  });
                }}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Yetenek Ekle
              </Button>
            </div>
            <div className="space-y-2">
              {(data.skills.tr.tools?.items || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(data.skills.tr.tools?.items || [])];
                      newItems[index] = e.target.value;
                      setData({
                        ...data,
                        skills: {
                          ...data.skills,
                          tr: {
                            ...data.skills.tr,
                            tools: {
                              ...data.skills.tr.tools,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    placeholder="Yetenek adı (örn: Adobe Photoshop)"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(data.skills.tr.tools?.items || [])];
                      newItems.splice(index, 1);
                      setData({
                        ...data,
                        skills: {
                          ...data.skills,
                          tr: {
                            ...data.skills.tr,
                            tools: {
                              ...data.skills.tr.tools,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!data.skills.tr.tools?.items || data.skills.tr.tools.items.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Henüz yetenek eklenmemiş
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input
              value={data.skills.en.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    en: {
                      ...data.skills.en,
                      title: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Expertise Title</Label>
            <Input
              value={data.skills.en.expertise?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    en: {
                      ...data.skills.en,
                      expertise: {
                        ...data.skills.en.expertise,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Tools Title</Label>
            <Input
              value={data.skills.en.tools?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: {
                    ...data.skills,
                    en: {
                      ...data.skills.en,
                      tools: {
                        ...data.skills.en.tools,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Skills</Label>
              <Button
                onClick={() => {
                  const currentItems = data.skills.en.tools?.items || [];
                  setData({
                    ...data,
                    skills: {
                      ...data.skills,
                      en: {
                        ...data.skills.en,
                        tools: {
                          ...data.skills.en.tools,
                          items: [...currentItems, ""],
                        },
                      },
                    },
                  });
                }}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>
            <div className="space-y-2">
              {(data.skills.en.tools?.items || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(data.skills.en.tools?.items || [])];
                      newItems[index] = e.target.value;
                      setData({
                        ...data,
                        skills: {
                          ...data.skills,
                          en: {
                            ...data.skills.en,
                            tools: {
                              ...data.skills.en.tools,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    placeholder="Skill name (e.g., Adobe Photoshop)"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(data.skills.en.tools?.items || [])];
                      newItems.splice(index, 1);
                      setData({
                        ...data,
                        skills: {
                          ...data.skills,
                          en: {
                            ...data.skills.en,
                            tools: {
                              ...data.skills.en.tools,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!data.skills.en.tools?.items || data.skills.en.tools.items.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
