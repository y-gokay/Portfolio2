"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactData {
  footer: {
    tr: {
      contact: {
        title: string;
        email: string;
        role: string;
      };
      copyright: string;
    };
    en: {
      contact: {
        title: string;
        email: string;
        role: string;
      };
      copyright: string;
    };
  };
}

export function ContactManager() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/v1/site-settings/contact");
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
      const response = await fetch("/api/v1/site-settings/contact", {
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
          <h2 className="text-2xl font-bold">İletişim</h2>
          <p className="text-sm text-muted-foreground mt-1">
            İletişim bölümü içeriğini yönetin
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
            <Label>İletişim Başlığı</Label>
            <Input
              value={data.footer.tr.contact.title}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    tr: {
                      ...data.footer.tr,
                      contact: {
                        ...data.footer.tr.contact,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>E-posta</Label>
            <Input
              type="email"
              value={data.footer.tr.contact.email}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    tr: {
                      ...data.footer.tr,
                      contact: {
                        ...data.footer.tr.contact,
                        email: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Rol/Unvan</Label>
            <Input
              value={data.footer.tr.contact.role}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    tr: {
                      ...data.footer.tr,
                      contact: {
                        ...data.footer.tr.contact,
                        role: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Telif Hakkı</Label>
            <Input
              value={data.footer.tr.copyright}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    tr: {
                      ...data.footer.tr,
                      copyright: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4">
          <div>
            <Label>Contact Title</Label>
            <Input
              value={data.footer.en.contact.title}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    en: {
                      ...data.footer.en,
                      contact: {
                        ...data.footer.en.contact,
                        title: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={data.footer.en.contact.email}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    en: {
                      ...data.footer.en,
                      contact: {
                        ...data.footer.en.contact,
                        email: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Role/Title</Label>
            <Input
              value={data.footer.en.contact.role}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    en: {
                      ...data.footer.en,
                      contact: {
                        ...data.footer.en.contact,
                        role: e.target.value,
                      },
                    },
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Copyright</Label>
            <Input
              value={data.footer.en.copyright}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: {
                    ...data.footer,
                    en: {
                      ...data.footer.en,
                      copyright: e.target.value,
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
