"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { PortfolioItem } from "@/lib/portfolio-data";
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
      const response = await fetch("/api/portfolio");
      const result = await response.json();
      if (result.success) {
        setPortfolioItems(result.data);
      }
    } catch (error) {
      toast.error("Portfolio verileri yüklenemedi");
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
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Portfolio öğesi silindi");
        fetchPortfolio();
      } else {
        toast.error(result.error || "Silme işlemi başarısız");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title?.tr || !formData.category?.tr) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    try {
      const method = editingItem ? "PUT" : "POST";
      const response = await fetch("/api/portfolio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingItem ? "Güncellendi" : "Eklendi");
        setIsDialogOpen(false);
        fetchPortfolio();
      } else {
        toast.error(result.error || "İşlem başarısız");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const handleTagsChange = (lang: "tr" | "en", value: string) => {
    const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
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
                  <h3 className="text-xl font-semibold mb-2">{item.title.tr}</h3>
                  <p className="text-muted-foreground mb-2">
                    {item.category.tr} • {item.year}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{item.description.tr}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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
            <p className="text-muted-foreground mb-4">Henüz portfolio öğesi yok</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Öğeyi Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
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
                    title: { ...formData.title, tr: e.target.value, en: formData.title?.en || "" },
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
                    title: { ...formData.title, en: e.target.value, tr: formData.title?.tr || "" },
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
                      category: { ...formData.category, tr: e.target.value, en: formData.category?.en || "" },
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
                      category: { ...formData.category, en: e.target.value, tr: formData.category?.tr || "" },
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
                      description: { ...formData.description, tr: e.target.value, en: formData.description?.en || "" },
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
                      description: { ...formData.description, en: e.target.value, tr: formData.description?.tr || "" },
                    })
                  }
                  placeholder="English description"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <Label>Ana Görsel URL</Label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/image.jpg veya https://..."
              />
            </div>

            <div>
              <Label>Yıl</Label>
              <Input
                type="text"
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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

