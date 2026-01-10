"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Video, Plus, Trash2, Save, GripVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaItem } from "@/lib/portfolio-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  title?: string;
}

export function MediaManager({ media, onChange, title = "Medya Yönetimi" }: MediaManagerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(media || []);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync media items when prop changes
  useEffect(() => {
    setMediaItems(media || []);
  }, [media]);

  const handleAddMedia = () => {
    setMediaItems([
      ...mediaItems,
      {
        type: "image",
        url: "",
        thumbnail: undefined,
      },
    ]);
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = mediaItems.filter((_, i) => i !== index);
    setMediaItems(newMedia);
    onChange(newMedia);
  };

  const handleMediaChange = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...mediaItems];
    newMedia[index] = {
      ...newMedia[index],
      [field]: value,
    };
    setMediaItems(newMedia);
    onChange(newMedia);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = event instanceof File ? event : event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Sadece görsel veya video dosyası yükleyebilirsiniz");
      return;
    }

    // Check file size (max 10MB for base64)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu çok büyük (maksimum 10MB)");
      return;
    }

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newMediaItem: MediaItem = {
        type: isImage ? "image" : "video",
        url: base64String,
        thumbnail: isVideo ? undefined : undefined,
      };

      const newMedia = [...mediaItems, newMediaItem];
      setMediaItems(newMedia);
      onChange(newMedia);
      toast.success("Medya eklendi");
    };

    reader.onerror = () => {
      toast.error("Dosya okunurken bir hata oluştu");
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (dragItem.current === null || dragItem.current === index) return;

    const newMedia = [...mediaItems];
    const draggedItem = newMedia[dragItem.current];
    newMedia.splice(dragItem.current, 1);
    newMedia.splice(index, 0, draggedItem);
    
    setMediaItems(newMedia);
    onChange(newMedia);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      handleFileUpload(file);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Dosya Yükle
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleAddMedia}>
              <Plus className="mr-2 h-4 w-4" />
              URL Ekle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {mediaItems.length === 0 && (
          <div
            className={`text-center py-12 border-2 border-dashed rounded-lg ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">Henüz medya eklenmemiş</p>
            <p className="text-sm text-muted-foreground mb-4">
              Dosyaları buraya sürükleyip bırakın veya yükleme butonunu kullanın
            </p>
            {isDragging && (
              <p className="text-primary font-semibold">Bırakın!</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item, index) => (
            <Card
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`cursor-move ${
                dragItem.current === index ? "opacity-50" : ""
              } ${dragOverItem.current === index ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Drag Handle */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GripVertical className="w-4 h-4" />
                      <span>#{index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setPreviewItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Preview */}
                  <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setPreviewItem(item)}
                  >
                    {item.type === "image" && item.url ? (
                      <img
                        src={item.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" && item.url ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === "image" ? (
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        ) : (
                          <Video className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Type Selector */}
                  <div>
                    <Label>Tip</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={item.type}
                      onChange={(e) =>
                        handleMediaChange(index, "type", e.target.value as "image" | "video")
                      }
                    >
                      <option value="image">Görsel</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {/* URL Input */}
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={item.url || ""}
                      onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                      placeholder="/image.jpg veya https://..."
                    />
                  </div>

                  {/* Thumbnail Input (for videos) */}
                  {item.type === "video" && (
                    <div>
                      <Label>Thumbnail URL (isteğe bağlı)</Label>
                      <Input
                        value={item.thumbnail || ""}
                        onChange={(e) => handleMediaChange(index, "thumbnail", e.target.value)}
                        placeholder="/thumbnail.jpg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

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
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <Input value={previewItem.url || ""} readOnly className="font-mono text-xs" />
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
    </Card>
  );
}

