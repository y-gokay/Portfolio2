"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaItem } from "@/lib/portfolio-data";

export function MediaGallery() {
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const fetchAllMedia = async () => {
    try {
      // Fetch all portfolio items and extract their media
      const response = await fetch("/api/portfolio");
      const result = await response.json();
      
      if (result.success) {
        const media: MediaItem[] = [];
        result.data.forEach((item: any) => {
          if (item.media && Array.isArray(item.media)) {
            item.media.forEach((m: MediaItem) => {
              media.push({
                ...m,
                // Add portfolio item info for reference
                id: `${item.id}-${media.length}`,
              } as MediaItem & { id: string });
            });
          }
          // Also include main image
          if (item.image) {
            media.push({
              type: "image",
              url: item.image,
              id: `${item.id}-main`,
            } as MediaItem & { id: string });
          }
        });
        
        setAllMedia(media);
      }
    } catch (error) {
      toast.error("Medya yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = allMedia.filter((item) => {
    if (!searchTerm) return true;
    return item.url.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="text-muted-foreground">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tüm Medya Galerisi</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Portfolyodaki tüm görsel ve videoları buradan görebilirsiniz
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Ara</Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="URL ile ara..."
            />
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Toplam {allMedia.length} medya öğesi
            {filteredMedia.length !== allMedia.length && ` (${filteredMedia.length} gösteriliyor)`}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Medya bulunamadı</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setPreviewItem(item)}
              >
                <CardContent className="p-2">
                  <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                    {item.type === "image" && item.url ? (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" && item.url ? (
                      <>
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={`Video thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === "image" ? (
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        ) : (
                          <Video className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medya Önizleme</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              {previewItem.type === "image" && previewItem.url ? (
                <img
                  src={previewItem.url}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : previewItem.type === "video" && previewItem.url ? (
                <video
                  src={previewItem.url}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p>Önizleme mevcut değil</p>
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Tip</Label>
                  <Input value={previewItem.type} readOnly className="font-mono text-xs capitalize" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input
                    value={previewItem.url || ""}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>
                {previewItem.thumbnail && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Thumbnail</Label>
                    <Input value={previewItem.thumbnail} readOnly className="font-mono text-xs" />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

