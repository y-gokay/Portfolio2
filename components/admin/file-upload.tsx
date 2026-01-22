"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FileUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  accept?: string; // e.g., "application/pdf" for PDF, "image/*" for images
  maxSizeMB?: number;
  fileType?: "pdf" | "image";
}

export function FileUpload({
  value,
  onChange,
  label = "Dosya URL",
  placeholder = "/file.pdf veya https://...",
  accept = "application/pdf",
  maxSizeMB = 10,
  fileType = "pdf",
}: FileUploadProps) {
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
      const errorMessage = result.error || "Upload başarısız";
      const errorDetails = result.details ? `\n\n${result.details}` : "";
      throw new Error(`${errorMessage}${errorDetails}`);
    }

    return result.url;
  };

  const handleFileUpload = async (file: File) => {
    // PDF kontrolü
    if (fileType === "pdf" && file.type !== "application/pdf") {
      toast.error("Sadece PDF dosyası yükleyebilirsiniz");
      return;
    }

    // Image kontrolü
    if (fileType === "image" && !file.type.startsWith("image/")) {
      toast.error("Sadece görsel dosyası yükleyebilirsiniz");
      return;
    }

    // Dosya boyutu kontrolü
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Dosya boyutu ${maxSizeMB} MB'dan küçük olmalıdır`);
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
      toast.success(`${fileType === "pdf" ? "PDF" : "Görsel"} başarıyla Cloudinary'ye yüklendi`);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Upload başarısız";
      
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
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground truncate">
                  {value}
                </span>
              </div>
              {!isUploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline block"
              >
                Dosyayı Görüntüle
              </a>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Yükleniyor... {uploadProgress}%
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="text-primary hover:underline"
                    >
                      Dosya seç
                    </button>{" "}
                    veya sürükle-bırak
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileType === "pdf" ? "PDF" : "Görsel"} dosyası ({maxSizeMB}MB'a kadar)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {!value && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs"
        />
      )}
    </div>
  );
}
