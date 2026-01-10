"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Görsel URL",
  placeholder = "/image.jpg veya https://...",
  showPreview = true,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/cloudinary", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      // Detaylı hata mesajını göster
      const errorMessage = result.error || "Upload başarısız";
      const errorDetails = result.details ? `\n\n${result.details}` : "";
      throw new Error(`${errorMessage}${errorDetails}`);
    }

    return result.url;
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece görsel dosyası yükleyebilirsiniz");
      return;
    }

    // Dosya boyutu kontrolü (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10 MB'dan küçük olmalıdır");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simüle edilmiş progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const url = await uploadToCloudinary(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      onChange(url);
      toast.success("Görsel başarıyla Cloudinary'ye yüklendi");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Upload başarısız";
      
      // Uzun hata mesajları için toast süresini artır
      const duration = errorMessage.length > 100 ? 8000 : 5000;
      
      toast.error(errorMessage, {
        duration,
        description: errorMessage.includes("Cloudinary") 
          ? "Vercel Dashboard > Settings > Environment Variables bölümünden Cloudinary bilgilerinizi kontrol edin."
          : undefined,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);

      // File input'u temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Drag & Drop Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Cloudinary'ye yükleniyor... {uploadProgress}%
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Tıklayarak seçin veya sürükleyip bırakın
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP (Max: 10 MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* URL Input (Manuel URL girişi için) */}
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isUploading}
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange("")}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      {showPreview && value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      )}

      {/* Cloudinary Optimized URL Helper */}
      {value && value.includes("cloudinary.com") && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            💡 <strong>İpucu:</strong> Cloudinary URL'sine transformation parametreleri ekleyebilirsiniz:
          </p>
          <p className="text-xs font-mono break-all bg-background p-2 rounded mt-1">
            {value.split("/upload/")[0]}/upload/w_800,h_600,c_fill,q_auto{fetch_format}/upload/{value.split("/upload/")[1]}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Örnek: <code>w_800</code> (genişlik), <code>h_600</code> (yükseklik), <code>c_fill</code> (crop), <code>q_auto</code> (kalite)
          </p>
        </div>
      )}
    </div>
  );
}
