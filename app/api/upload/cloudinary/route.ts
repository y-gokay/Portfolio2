import { NextRequest, NextResponse } from "next/server";
import { cloudinaryClient } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Cloudinary client kontrolü
    if (!cloudinaryClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloudinary yapılandırılmamış. Environment variables'ları kontrol edin.",
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

    // Cloudinary'ye upload
    const uploadResult = await new Promise((resolve, reject) => {
      if (!cloudinaryClient) {
        reject(new Error("Cloudinary client not configured"));
        return;
      }

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

