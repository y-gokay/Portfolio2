"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutData {
  about: {
    tr: {
      title: string;
      story: {
        title: string;
        content: string;
      };
      approach: {
        title: string;
        content: string;
      };
      interests: {
        title: string;
        items: string[];
      };
    };
    en: {
      title: string;
      story: {
        title: string;
        content: string;
      };
      approach: {
        title: string;
        content: string;
      };
      interests: {
        title: string;
        items: string[];
      };
    };
  };
}

export function AboutManager() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/v1/site-settings/about");
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
      const response = await fetch("/api/v1/site-settings/about", {
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
      <div className="text-center py-8 text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-destructive">
        Veriler yüklenemedi
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hakkımda</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hakkımda bölümü içeriğini yönetin
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
            <Label>Hikaye Başlığı</Label>
            <Input
              value={data.about.tr.story?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    tr: {
                      ...data.about.tr,
                      story: {
                        ...data.about.tr.story,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Hikaye İçeriği</Label>
            <Textarea
              value={data.about.tr.story?.content || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    tr: {
                      ...data.about.tr,
                      story: {
                        ...data.about.tr.story,
                        content: e.target.value,
                      },
                    },
                  },
                })
              }
              rows={4}
            />
          </div>
          <div>
            <Label>Yaklaşım Başlığı</Label>
            <Input
              value={data.about.tr.approach?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    tr: {
                      ...data.about.tr,
                      approach: {
                        ...data.about.tr.approach,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Yaklaşım İçeriği</Label>
            <Textarea
              value={data.about.tr.approach?.content || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    tr: {
                      ...data.about.tr,
                      approach: {
                        ...data.about.tr.approach,
                        content: e.target.value,
                      },
                    },
                  },
                })
              }
              rows={4}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>İlgi Alanları</Label>
              <Button
                onClick={() => {
                  const currentItems = data.about.tr.interests?.items || [];
                  setData({
                    ...data,
                    about: {
                      ...data.about,
                      tr: {
                        ...data.about.tr,
                        interests: {
                          ...data.about.tr.interests,
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
                İlgi Alanı Ekle
              </Button>
            </div>
            <div className="space-y-2">
              {(data.about.tr.interests?.items || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [
                        ...(data.about.tr.interests?.items || []),
                      ];
                      newItems[index] = e.target.value;
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          tr: {
                            ...data.about.tr,
                            interests: {
                              ...data.about.tr.interests,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    placeholder="İlgi alanı veya hobi adı"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = [
                        ...(data.about.tr.interests?.items || []),
                      ];
                      newItems.splice(index, 1);
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          tr: {
                            ...data.about.tr,
                            interests: {
                              ...data.about.tr.interests,
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
              {(!data.about.tr.interests?.items ||
                data.about.tr.interests.items.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Henüz ilgi alanı eklenmemiş
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4">
          <div>
            <Label>Story Title</Label>
            <Input
              value={data.about.en.story?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    en: {
                      ...data.about.en,
                      story: {
                        ...data.about.en.story,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Story Content</Label>
            <Textarea
              value={data.about.en.story?.content || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    en: {
                      ...data.about.en,
                      story: {
                        ...data.about.en.story,
                        content: e.target.value,
                      },
                    },
                  },
                })
              }
              rows={4}
            />
          </div>
          <div>
            <Label>Approach Title</Label>
            <Input
              value={data.about.en.approach?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    en: {
                      ...data.about.en,
                      approach: {
                        ...data.about.en.approach,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Approach Content</Label>
            <Textarea
              value={data.about.en.approach?.content || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  about: {
                    ...data.about,
                    en: {
                      ...data.about.en,
                      approach: {
                        ...data.about.en.approach,
                        content: e.target.value,
                      },
                    },
                  },
                })
              }
              rows={4}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Interests</Label>
              <Button
                onClick={() => {
                  const currentItems = data.about.en.interests?.items || [];
                  setData({
                    ...data,
                    about: {
                      ...data.about,
                      en: {
                        ...data.about.en,
                        interests: {
                          ...data.about.en.interests,
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
                Add Interest
              </Button>
            </div>
            <div className="space-y-2">
              {(data.about.en.interests?.items || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [
                        ...(data.about.en.interests?.items || []),
                      ];
                      newItems[index] = e.target.value;
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          en: {
                            ...data.about.en,
                            interests: {
                              ...data.about.en.interests,
                              items: newItems,
                            },
                          },
                        },
                      });
                    }}
                    placeholder="Interest or hobby name"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = [
                        ...(data.about.en.interests?.items || []),
                      ];
                      newItems.splice(index, 1);
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          en: {
                            ...data.about.en,
                            interests: {
                              ...data.about.en.interests,
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
              {(!data.about.en.interests?.items ||
                data.about.en.interests.items.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No interests added yet
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
