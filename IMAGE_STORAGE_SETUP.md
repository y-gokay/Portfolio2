# Cloudinary Görsel Depolama Kurulumu

## 🎯 Neden Cloudinary?

**Bu proje için Cloudinary önerilir** çünkü:

✅ **Görsel Optimizasyonu**: Otomatik format dönüşümü (WebP, AVIF), kalite optimizasyonu  
✅ **Responsive Images**: Farklı ekran boyutları için otomatik boyutlandırma  
✅ **CDN**: Global CDN ile hızlı görüntüleme  
✅ **Ücretsiz Tier**: 25 GB storage, 25 GB bandwidth/ay (portfolyo için yeterli)  
✅ **Video Desteği**: Video thumbnail ve dönüşüm desteği  
✅ **URL-based Transformations**: URL parametreleriyle görsel manipülasyonu  
✅ **Admin Panel Entegrasyonu**: Kolay upload ve yönetim  

---

## 📋 İçindekiler

1. [Cloudinary Hesabı Oluşturma](#1-cloudinary-hesabı-oluşturma)
2. [API Bilgilerini Alma](#2-api-bilgilerini-alma)
3. [Environment Variables Ekleme](#3-environment-variables-ekleme)
4. [NPM Paketlerini Yükleme](#4-npm-paketlerini-yükleme)
5. [Upload Preset Ayarlama](#5-upload-preset-ayarlama)
6. [Kod Entegrasyonu](#6-kod-entegrasyonu)
7. [Maliyet Bilgileri](#7-maliyet-bilgileri)

---

## 1. Cloudinary Hesabı Oluşturma

### Adım 1: Kayıt Olma

1. [Cloudinary](https://cloudinary.com/users/register/free) adresine gidin
2. Ücretsiz hesap oluşturun:
   - E-posta adresinizi girin
   - İsim ve şifre belirleyin
   - **"Create Account"** tıklayın
3. E-posta adresinize gelen doğrulama linkine tıklayın

### Adım 2: Dashboard'a Giriş

1. [Cloudinary Console](https://console.cloudinary.com/) adresine gidin
2. E-posta ve şifrenizle giriş yapın

---

## 2. API Bilgilerini Alma

Dashboard'a giriş yaptıktan sonra:

1. Sağ üst köşede **Dashboard** butonuna tıklayın
2. Ana sayfada şu bilgileri göreceksiniz:

```
Cloud Name: xxxxxx
API Key: 123456789012345
API Secret: xxxxxxxxxxxxxxxx
```

**⚠️ ÖNEMLİ**: 
- API Secret'ı **GÜVENLİ TUTUN**
- **ASLA** client-side kodda kullanmayın
- Sadece server-side API route'larda kullanın

Bu bilgileri not alın, bir sonraki adımda kullanacağız.

---

## 3. Environment Variables Ekleme

### Vercel Dashboard'da

1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. Projenize gidin
3. **Settings** sekmesine tıklayın
4. **Environment Variables** bölümüne gidin
5. Şu değişkenleri ekleyin:

```
CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxx
```

**Her biri için**:
- **Key**: Yukarıdaki isimleri girin
- **Value**: Cloudinary Dashboard'dan aldığınız değerleri girin
- **Environment**: **Production, Preview, Development** hepsini seçin
- **Add** butonuna tıklayın

### Lokal Geliştirme için (.env.local)

Proje klasörünüzde `.env.local` dosyası oluşturun (yoksa):

```bash
# .env.local dosyası
CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxx
```

**⚠️ ÖNEMLİ**: 
- `.env.local` dosyasını `.gitignore`'a ekleyin (zaten olmalı)
- Bu dosyayı **ASLA** commit etmeyin

---

## 4. NPM Paketlerini Yükleme

Proje klasörünüzde terminal açın ve şu komutu çalıştırın:

```bash
npm install cloudinary
```

veya pnpm kullanıyorsanız:

```bash
pnpm add cloudinary
```

Yükleme tamamlandıktan sonra `package.json` dosyasında `cloudinary` dependency'sinin eklendiğini kontrol edin.

---

## 5. Upload Preset Ayarlama

Upload preset, güvenlik ve organizasyon için önerilir:

### Adım 1: Upload Preset Oluşturma

1. Cloudinary Dashboard'a gidin
2. **Settings** (⚙️) > **Upload** sekmesine gidin
3. **Upload presets** bölümüne gidin
4. **Add upload preset** butonuna tıklayın

### Adım 2: Preset Ayarları (Detaylı Rehber)

Cloudinary Upload Preset ayarlarını şu şekilde yapın:

#### 1. **Upload preset name**
```
portfolio-unsigned
```
veya
```
portfolio-images
```
- Açıklayıcı bir isim kullanın
- Türkçe karakter kullanmayın

#### 2. **Signing mode**
✅ **Unsigned** seçin (zaten seçmişsiniz - doğru!)
- Browser'dan direkt upload için gerekli
- Signed mode API secret gerektirir, bizim kullanım senaryomuzda gerek yok

#### 3. **Asset folder**
```
portfolio
```
- Dosyaları organize etmek için klasör adı
- Tek klasör (slash olmadan) veya `portfolio/hero` gibi alt klasörler kullanabilirsiniz
- **Not**: Bu ayar sadece Media Library'de görünüm için, public ID'yi etkilemez

#### 4. **Disallow public ID**
❌ **İşaretlemeyin** (kapalı bırakın)
- Public ID'nin manuel olarak ayarlanmasına izin verir
- Server-side kodda public ID kontrolü yapabiliyoruz

#### 5. **Generated public ID**
✅ **"Append a unique suffix"** seçin
- Bu seçenek dosya ismine benzersiz bir ek ekler
- Örnek: `image.jpg` → `image_abc123.jpg`
- **Neden?**: Aynı isimli dosyaların üzerine yazılmasını önler
- **Alternatif**: "Auto-generate an unguessable public ID" da kullanılabilir (daha güvenli ama dosya ismi kaybolur)

#### 6. **Prepend a path to the public ID**
```
portfolio/
```
- **Opsiyonel**: Public ID'ye klasör yolu ekler
- Örnek: `portfolio/image_abc123.jpg`
- Bu ayarı kullanırsanız, public ID `portfolio/` ile başlar
- **Tavsiye**: Kullanmayın, çünkü kodda `folder: "portfolio"` zaten belirtiyoruz

#### 7. **Generated display name**
✅ **"Use the filename of the uploaded file"** seçin
- Media Library'de dosyanın orijinal ismini gösterir
- Kullanıcı dostu bir görünüm sağlar
- **Alternatif**: "Use the last segment of the public ID" - daha teknik ama tutarlı

#### 8. **Incoming transformation** (Gelişmiş Ayarlar)
**Settings** > **Upload** > **Upload presets** > Preset'inizi seçin > **Edit** > **Incoming transformation** bölümünde:

```
q_auto,f_auto
```

veya daha detaylı:

```
q_auto:best,f_auto,w_auto:breakpoints_20_15:svg,dpr_auto
```

Bu transformation:
- `q_auto`: Otomatik kalite optimizasyonu
- `f_auto`: Format otomatik seçimi (WebP, AVIF, vb.)
- `w_auto:breakpoints_20_15:svg`: Responsive breakpoints için
- `dpr_auto`: Device Pixel Ratio için otomatik ayarlama

**Basit kullanım için**: `q_auto,f_auto` yeterli!

#### 9. **Use filename**
✅ **"Unique"** seçin (varsa bu seçenek)
- Aynı isimli dosyaların üzerine yazılmasını önler

#### 10. **Overwrite**
✅ **"Never"** seçin (varsa bu seçenek)
- Dosyaların üzerine yazılmasını önler

#### 11. **Save**
✅ **Save** butonuna tıklayın

### Adım 3: Preset'i Environment Variable'a Ekleme

Vercel Dashboard'da:

```
CLOUDINARY_UPLOAD_PRESET=portfolio-unsigned
```

Lokal `.env.local` dosyasına da ekleyin:

```env
CLOUDINARY_UPLOAD_PRESET=portfolio-unsigned
```

---

## 6. Kod Entegrasyonu

### 6.1. API Route Oluşturma

`app/api/upload/cloudinary/route.ts` dosyası oluşturun:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü (sadece görseller)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Sadece görsel dosyası yüklenebilir" },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10 MB'dan küçük olmalıdır" },
        { status: 400 }
      );
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary'ye upload
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: "auto", // auto-detect image/video
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" }, // WebP/AVIF otomatik seçimi
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const result = uploadResult as {
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    };

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload başarısız",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
```

### 6.2. ImageUpload Component Güncelleme

`components/admin/image-upload.tsx` dosyasını güncelleyin:

```typescript
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload başarısız");
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Upload başarısız");
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
      toast.error(
        error instanceof Error ? error.message : "Upload başarısız"
      );
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

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        <div
          className={`
            flex-1 border-2 border-dashed rounded-lg p-4 transition-colors
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
          <p className="text-xs font-mono break-all">
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
```

---

## 7. Maliyet Bilgileri

### Ücretsiz Plan (Free Tier)

| Özellik | Limit |
|---------|-------|
| **Storage** | 25 GB |
| **Bandwidth** | 25 GB/ay |
| **Transformations** | Sınırsız |
| **Video Storage** | 25 GB |
| **Video Bandwidth** | 25 GB/ay |
| **CDN** | ✅ Dahil |
| **Fiyat** | **$0/ay** |

**✅ Portfolyo sitesi için yeterli!**

### Ücretli Planlar

| Plan | Storage | Bandwidth | Fiyat |
|------|---------|-----------|-------|
| **Advanced** | 83 GB | 166 GB/ay | $89/ay |
| **Enterprise** | Custom | Custom | Custom |

---

## 🧪 Test Etme

### 1. Lokal Test

1. Terminal'de projeyi çalıştırın:
   ```bash
   npm run dev
   ```

2. Admin panele gidin: `http://localhost:3000/admin`

3. Site Ayarları > Hero sekmesine gidin

4. Bir görsel dosyası seçin veya sürükleyip bırakın

5. Upload işleminin başarılı olduğunu kontrol edin

6. Cloudinary Dashboard'da Media Library'de görseli görün

### 2. Production Test

1. Değişiklikleri commit edin ve push edin:
   ```bash
   git add .
   git commit -m "feat: Cloudinary integration"
   git push
   ```

2. Vercel otomatik deploy edecek

3. Production URL'de admin panele gidin

4. Upload işlemini test edin

5. Environment variables'ların doğru yüklendiğini kontrol edin

---

## 🔒 Güvenlik Notları

### ⚠️ ÖNEMLİ:

1. ✅ **API Secret'ı ASLA client-side kodda kullanmayın**
   - Sadece server-side API route'larda kullanın
   - Environment variables ile güvenli şekilde saklayın

2. ✅ **Dosya tipi kontrolü yapın**
   - Sadece görsel dosyalarına izin verin
   - `file.type.startsWith("image/")` kontrolü

3. ✅ **Dosya boyutu kontrolü yapın**
   - 10 MB limit (veya istediğiniz limit)

4. ✅ **Upload Preset kullanın**
   - Unsigned preset ile güvenliği artırın
   - Folder organizasyonu için kullanın

5. ✅ **Environment variables güvenliği**
   - `.env.local` dosyasını `.gitignore`'a ekleyin
   - Production'da Vercel Dashboard'dan ayarlayın

---

## 📚 Ek Kaynaklar

- [Cloudinary Dokümantasyonu](https://cloudinary.com/documentation)
- [Cloudinary React/Next.js Entegrasyonu](https://cloudinary.com/documentation/react_integration)
- [Cloudinary Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## 🎯 Sonraki Adımlar

1. ✅ Cloudinary hesabı oluşturun
2. ✅ Environment variables'ları ekleyin
3. ✅ NPM paketini yükleyin
4. ✅ API route'u oluşturun
5. ✅ ImageUpload component'ini güncelleyin
6. ✅ Upload preset oluşturun
7. ✅ Test edin

**Kurulum tamamlandığında admin panelden görselleri Cloudinary'ye yükleyebileceksiniz! 🚀**
