import { NextRequest, NextResponse } from "next/server";
import { getCloudinaryClient } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Cloudinary client al
    const cloudinaryClient = getCloudinaryClient();
    
    // Cloudinary client kontrolü - detaylı hata mesajı
    if (!cloudinaryClient) {
      const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
      const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
      const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
      
      // Debug log
      console.log("Cloudinary configuration check:", {
        hasCloudinaryUrl: !!cloudinaryUrl,
        cloudinaryUrlPreview: cloudinaryUrl ? `${cloudinaryUrl.substring(0, 30)}...` : "not set",
        hasCloudName: !!cloudName,
        cloudName: cloudName || "not set",
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      });
      
      // CLOUDINARY_URL kontrolü
      if (cloudinaryUrl) {
        if (!cloudinaryUrl.startsWith("cloudinary://")) {
          return NextResponse.json(
            {
              success: false,
              error: `CLOUDINARY_URL geçersiz format. Doğru format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME`,
              details: `Mevcut değer: "${cloudinaryUrl.substring(0, 50)}..." - Lütfen Vercel Dashboard'dan CLOUDINARY_URL değerini kontrol edin.`,
            },
            {
              status: 500,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            }
          );
        }
        
        // CLOUDINARY_URL parse kontrolü
        try {
          const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
          if (!urlMatch || urlMatch.length < 4) {
            throw new Error("Invalid CLOUDINARY_URL format");
          }
          const [, parsedApiKey, parsedApiSecret, parsedCloudName] = urlMatch;
          
          if (!parsedCloudName || parsedCloudName.trim().length < 3) {
            return NextResponse.json(
              {
                success: false,
                error: `CLOUDINARY_URL içindeki cloud_name geçersiz: "${parsedCloudName}"`,
                details: "CLOUDINARY_URL formatı: cloudinary://API_KEY:API_SECRET@CLOUD_NAME - Cloud name değerinin başında/sonunda boşluk olmamalıdır.",
              },
              {
                status: 500,
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                },
              }
            );
          }
        } catch (parseError) {
          return NextResponse.json(
            {
              success: false,
              error: `CLOUDINARY_URL parse hatası`,
              details: `CLOUDINARY_URL formatı: cloudinary://API_KEY:API_SECRET@CLOUD_NAME - Lütfen formatı kontrol edin.`,
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
      
      // Fallback: ayrı değişkenler kontrolü
      const missingVars: string[] = [];
      if (!cloudName && !cloudinaryUrl) missingVars.push("CLOUDINARY_CLOUD_NAME veya CLOUDINARY_URL");
      if (!apiKey && !cloudinaryUrl) missingVars.push("CLOUDINARY_API_KEY veya CLOUDINARY_URL");
      if (!apiSecret && !cloudinaryUrl) missingVars.push("CLOUDINARY_API_SECRET veya CLOUDINARY_URL");
      
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary yapılandırılmamış.",
          details: cloudinaryUrl
            ? `CLOUDINARY_URL set edilmiş ama Cloudinary yapılandırılamadı. Lütfen CLOUDINARY_URL formatını kontrol edin: cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
            : missingVars.length > 0 
              ? `Eksik environment variables: ${missingVars.join(", ")}. Vercel Dashboard > Settings > Environment Variables bölümünden Cloudinary bilgilerinizi ekleyin.`
              : "Cloudinary environment variables'ları kontrol edin.",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Dosya bulunamadı" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    // Dosya tipi kontrolü (sadece görseller)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Sadece görsel dosyası yüklenebilir" },
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    // Dosya boyutu kontrolü (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Dosya boyutu 10 MB'dan küçük olmalıdır" },
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary config'i kontrol et
    const config = cloudinaryClient.config();
    if (!config.cloud_name) {
      console.error("Cloudinary config.cloud_name is missing after initialization");
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary yapılandırma hatası: cloud_name bulunamadı.",
          details: "CLOUDINARY_URL veya ayrı environment variables kullanarak Cloudinary'yi yapılandırdığınızdan emin olun.",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    // Cloudinary'ye upload
    const uploadResult = await new Promise((resolve, reject) => {
      if (!cloudinaryClient) {
        reject(new Error("Cloudinary client not configured"));
        return;
      }

      try {
        const uploadStream = cloudinaryClient.uploader.upload_stream(
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
            if (error) {
              console.error("Cloudinary upload_stream error:", {
                message: error.message,
                http_code: (error as any).http_code,
                name: error.name,
              });
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      } catch (streamError) {
        console.error("Upload stream creation error:", streamError);
        reject(streamError);
      }
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
    
    // Detaylı hata mesajı
    let errorMessage = "Upload başarısız";
    let errorDetails = "";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Cloudinary özel hatalarını yakala
      if (errorMessage.includes("Invalid cloud_name")) {
        errorDetails = "Cloudinary cloud_name geçersiz. Vercel Dashboard > Settings > Environment Variables bölümünden CLOUDINARY_CLOUD_NAME değerini kontrol edin. Doğru değer Cloudinary dashboard'unuzdan alınabilir.";
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorDetails = "Cloudinary API anahtarları geçersiz. Vercel Dashboard > Settings > Environment Variables bölümünden CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET değerlerini kontrol edin.";
      } else if (errorMessage.includes("400")) {
        errorDetails = "Geçersiz dosya formatı veya dosya boyutu. Lütfen dosya formatını ve boyutunu kontrol edin.";
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(errorDetails && { details: errorDetails }),
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

