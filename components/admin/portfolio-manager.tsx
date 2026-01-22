"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { PortfolioItem, MediaItem } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MediaManager } from "./media-manager";
import { ImageUpload } from "./image-upload";

export function PortfolioManager() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    id: "",
    title: { tr: "", en: "" },
    category: { tr: "", en: "" },
    description: { tr: "", en: "" },
    image: "",
    year: new Date().getFullYear().toString(),
    tags: { tr: [], en: [] },
    media: [],
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/v1/portfolio");

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Portfolio verileri yüklenemedi`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += `\n\n${errorData.details.slice(0, 3).join("\n")}`;
          }
        } catch {
          // If JSON parse fails, use status text
          errorMessage = `HTTP ${response.status} ${response.statusText}`;
        }
        toast.error(errorMessage, { duration: 10000 });
        console.error(
          "Portfolio fetch HTTP error:",
          response.status,
          response.statusText
        );
        setPortfolioItems([]);
        return;
      }

      // Parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        toast.error("Sunucudan geçersiz yanıt alındı", { duration: 10000 });
        console.error("Portfolio JSON parse error:", parseError);
        setPortfolioItems([]);
        return;
      }

      // Check if result is valid
      if (result && result.success) {
        setPortfolioItems(Array.isArray(result.data) ? result.data : []);
      } else {
        const errorMessage = result?.error || "Portfolio verileri yüklenemedi";
        const detailsMessage =
          result?.details && Array.isArray(result.details)
            ? `\n\n${result.details.slice(0, 5).join("\n")}`
            : "";
        toast.error(`${errorMessage}${detailsMessage}`, {
          duration: 10000,
        });
        console.error(
          "Portfolio fetch API error:",
          errorMessage,
          result?.details || result
        );
        setPortfolioItems([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Bağlantı hatası: ${error.message}`
          : "Portfolio verileri yüklenemedi";
      toast.error(errorMessage, {
        duration: 10000,
      });
      console.error("Portfolio fetch exception:", error);
      setPortfolioItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setFormData({
      id: newId,
      title: { tr: "", en: "" },
      category: { tr: "", en: "" },
      description: { tr: "", en: "" },
      image: "",
      year: new Date().getFullYear().toString(),
      tags: { tr: [], en: [] },
      media: [],
    });
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu öğeyi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/v1/portfolio?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Portfolio öğesi silindi");
        fetchPortfolio();
      } else {
        let errorMessage = result.error || "Silme işlemi başarısız";
        if (
          result.details &&
          Array.isArray(result.details) &&
          result.details.length > 0
        ) {
          errorMessage = `${errorMessage}\n\nDetaylar: ${result.details.join(
            "\n"
          )}`;
        }
        toast.error(errorMessage, {
          duration: 10000,
        });
        console.error("Delete error:", result);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Bağlantı hatası: ${error.message}`
          : "Bilinmeyen bir hata oluştu";
      toast.error(errorMessage, {
        duration: 10000,
      });
      console.error("Delete error:", error);
    }
  };

  const handleSave = async () => {
    // Detaylı client-side validasyon
    const errors: string[] = [];

    if (!formData.id || formData.id.trim() === "") {
      errors.push("❌ ID boş olamaz");
    }

    if (!formData.title?.tr || formData.title.tr.trim() === "") {
      errors.push("❌ Türkçe başlık (title.tr) boş olamaz");
    }
    if (!formData.title?.en || formData.title.en.trim() === "") {
      errors.push("❌ İngilizce başlık (title.en) boş olamaz");
    }

    if (!formData.category?.tr || formData.category.tr.trim() === "") {
      errors.push("❌ Türkçe kategori (category.tr) boş olamaz");
    }
    if (!formData.category?.en || formData.category.en.trim() === "") {
      errors.push("❌ İngilizce kategori (category.en) boş olamaz");
    }

    if (!formData.description?.tr || formData.description.tr.trim() === "") {
      errors.push("❌ Türkçe açıklama (description.tr) boş olamaz");
    }
    if (!formData.description?.en || formData.description.en.trim() === "") {
      errors.push("❌ İngilizce açıklama (description.en) boş olamaz");
    }

    if (!formData.image || formData.image.trim() === "") {
      errors.push("❌ Ana görsel (image) URL'i boş olamaz");
    }

    if (!formData.year || formData.year.trim() === "") {
      errors.push("❌ Yıl (year) boş olamaz");
    }

    if (errors.length > 0) {
      const errorMessage = `Validasyon hatası (${
        errors.length
      } hata):\n\n${errors.slice(0, 10).join("\n")}${
        errors.length > 10 ? `\n\n...ve ${errors.length - 10} hata daha` : ""
      }`;
      toast.error(errorMessage, {
        duration: 10000,
      });
      console.error("Portfolio Validasyon Hataları:", errors);
      return;
    }

    try {
      const method = editingItem ? "PUT" : "POST";
      const response = await fetch("/api/v1/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          editingItem
            ? "Portfolio öğesi güncellendi"
            : "Portfolio öğesi eklendi"
        );
        setIsDialogOpen(false);
        fetchPortfolio();
      } else {
        // Detaylı hata mesajı göster
        let errorMessage = result.error || "İşlem başarısız";

        if (
          result.details &&
          Array.isArray(result.details) &&
          result.details.length > 0
        ) {
          const detailsText = result.details.slice(0, 10).join("\n");
          const moreText =
            result.details.length > 10
              ? `\n\n...ve ${result.details.length - 10} hata daha`
              : "";
          errorMessage = `${errorMessage}\n\nHata Detayları (${
            result.errorCount || result.details.length
          } hata):\n${detailsText}${moreText}`;
          console.error("Sunucu Validasyon Hataları:", result.details);
        }

        toast.error(errorMessage, {
          duration: 15000,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Bağlantı hatası: ${error.message}`
          : "Bilinmeyen bir hata oluştu";
      toast.error(errorMessage, {
        duration: 10000,
      });
      console.error("Save error:", error);
    }
  };

  const handleTagsChange = (lang: "tr" | "en", value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData({
      ...formData,
      tags: {
        ...formData.tags,
        [lang]: tags,
      },
    });
  };

  if (loading) {
    return <div className="text-muted-foreground">Yükleniyor...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Portfolio Ekle
        </Button>
      </div>

      <div className="grid gap-4">
        {portfolioItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title.tr}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title.tr}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {item.category.tr} • {item.year}
                  </p>
                  <p className="text-sm mb-2 line-clamp-2">
                    {item.description.tr}
                  </p>
                  {item.media && item.media.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-4">
                      {item.media.length} medya öğesi (
                      {item.media.filter((m) => m.type === "image").length}{" "}
                      görsel,{" "}
                      {item.media.filter((m) => m.type === "video").length}{" "}
                      video)
                    </p>
                  )}
                  {item.tags?.tr && item.tags.tr.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.tr.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.tr.length > 3 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                          +{item.tags.tr.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolioItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Henüz portfolio öğesi yok
            </p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Öğeyi Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Portfolio Düzenle" : "Yeni Portfolio Ekle"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>ID</Label>
              <Input
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                placeholder="benzersiz-id"
              />
            </div>

            <div>
              <Label>Başlık (TR) *</Label>
              <Input
                value={formData.title?.tr || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: {
                      ...formData.title,
                      tr: e.target.value,
                      en: formData.title?.en || "",
                    },
                  })
                }
                placeholder="Türkçe başlık"
              />
            </div>

            <div>
              <Label>Title (EN) *</Label>
              <Input
                value={formData.title?.en || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: {
                      ...formData.title,
                      en: e.target.value,
                      tr: formData.title?.tr || "",
                    },
                  })
                }
                placeholder="English title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kategori (TR) *</Label>
                <Input
                  value={formData.category?.tr || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: {
                        ...formData.category,
                        tr: e.target.value,
                        en: formData.category?.en || "",
                      },
                    })
                  }
                  placeholder="Tasarım"
                />
              </div>
              <div>
                <Label>Category (EN) *</Label>
                <Input
                  value={formData.category?.en || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: {
                        ...formData.category,
                        en: e.target.value,
                        tr: formData.category?.tr || "",
                      },
                    })
                  }
                  placeholder="Design"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Açıklama (TR)</Label>
                <Textarea
                  value={formData.description?.tr || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        tr: e.target.value,
                        en: formData.description?.en || "",
                      },
                    })
                  }
                  placeholder="Türkçe açıklama"
                  rows={4}
                />
              </div>
              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={formData.description?.en || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        en: e.target.value,
                        tr: formData.description?.tr || "",
                      },
                    })
                  }
                  placeholder="English description"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <ImageUpload
                value={formData.image || ""}
                onChange={(value) => setFormData({ ...formData, image: value })}
                label="Ana Görsel"
                placeholder="/image.jpg veya https://..."
                showPreview={true}
              />
            </div>

            <div>
              <Label>Yıl</Label>
              <Input
                type="text"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Etiketler (TR) - virgülle ayırın</Label>
                <Input
                  value={formData.tags?.tr?.join(", ") || ""}
                  onChange={(e) => handleTagsChange("tr", e.target.value)}
                  placeholder="Tasarım, Tipografi, Renk"
                />
              </div>
              <div>
                <Label>Tags (EN) - separate with commas</Label>
                <Input
                  value={formData.tags?.en?.join(", ") || ""}
                  onChange={(e) => handleTagsChange("en", e.target.value)}
                  placeholder="Design, Typography, Color"
                />
              </div>
            </div>

            {/* Media Manager */}
            <div className="pt-4 border-t">
              <MediaManager
                media={formData.media || []}
                onChange={(media) => setFormData({ ...formData, media })}
                title="Portfolio Medya Galerisi"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              İptal
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
