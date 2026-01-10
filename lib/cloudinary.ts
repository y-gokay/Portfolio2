import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
// Cloudinary SDK, CLOUDINARY_URL environment variable'ını otomatik olarak okur
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
export function configureCloudinary() {
  const cloudinaryUrlRaw = process.env.CLOUDINARY_URL;
  const cloudinaryUrl = cloudinaryUrlRaw?.trim();
  
  // CLOUDINARY_URL varsa, parse edip manuel config yap (boşlukları temizlemek için)
  if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
    try {
      // CLOUDINARY_URL'i parse et: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
      const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+?)(?:\s|$)/);
      
      if (urlMatch && urlMatch.length >= 4) {
        const apiKey = urlMatch[1]?.trim();
        const apiSecret = urlMatch[2]?.trim();
        let cloudName = urlMatch[3]?.trim();
        
        // Cloud name'in sonundaki boşlukları temizle (regex sonunda kalan boşluklar için)
        cloudName = cloudName.replace(/\s+$/, '').trim();
        
        // Validasyon
        if (!cloudName || cloudName.length < 3 || cloudName === "Root") {
          console.error(`Invalid cloud_name parsed from CLOUDINARY_URL: "${cloudName}"`);
          return null;
        }
        
        if (!apiKey || !apiSecret) {
          console.error("Missing API key or secret in CLOUDINARY_URL");
          return null;
        }
        
        // Manuel config yap (boşlukları temizlenmiş değerlerle)
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
        
        // Config'in doğru yüklendiğini kontrol et
        const config = cloudinary.config();
        const configuredCloudName = config.cloud_name;
        
        if (!configuredCloudName || configuredCloudName.trim() !== cloudName) {
          console.error(`Config mismatch. Expected: "${cloudName}", Got: "${configuredCloudName}"`);
          return null;
        }
        
        // Son boşluk kontrolü
        if (configuredCloudName !== configuredCloudName.trim()) {
          console.error(`Cloudinary cloud_name still has spaces after config: "${configuredCloudName}"`);
          return null;
        }
        
        console.log(`Cloudinary configured successfully (cloud_name: "${configuredCloudName}")`);
        return cloudinary;
      } else {
        console.error(`Failed to parse CLOUDINARY_URL. Format should be: cloudinary://API_KEY:API_SECRET@CLOUD_NAME`);
        console.error(`Received URL (first 50 chars): ${cloudinaryUrl.substring(0, 50)}...`);
        return null;
      }
    } catch (error) {
      console.error("Failed to configure Cloudinary with CLOUDINARY_URL:", error);
      return null;
    }
  }

  // CLOUDINARY_URL yoksa, ayrı ayrı değişkenlerden oluştur (fallback)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    const missing: string[] = [];
    if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
    if (!apiKey) missing.push("CLOUDINARY_API_KEY");
    if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");
    
    console.warn(
      `Cloudinary environment variables are missing. Either set CLOUDINARY_URL or set: ${missing.join(", ")}. Upload functionality will not work.`
    );
    return null;
  }

  // Geçersiz değerleri kontrol et
  if (cloudName === "Root" || cloudName.length < 3) {
    console.error(
      `Invalid CLOUDINARY_CLOUD_NAME value: "${cloudName}". Please check your Vercel environment variables.`
    );
    return null;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
    });

    const config = cloudinary.config();
    if (!config.cloud_name) {
      console.error("Cloudinary config failed: cloud_name is missing after manual config");
      return null;
    }

    console.log(`Cloudinary configured using separate env vars (cloud_name: ${config.cloud_name})`);
    return cloudinary;
  } catch (error) {
    console.error("Failed to configure Cloudinary:", error);
    return null;
  }
}

// Cloudinary client instance
export function getCloudinaryClient() {
  return configureCloudinary();
}

// Lazy initialization - ilk kullanımda yapılandır
let cloudinaryClientInstance: ReturnType<typeof configureCloudinary> | null = null;

export const cloudinaryClient = (() => {
  if (!cloudinaryClientInstance) {
    cloudinaryClientInstance = configureCloudinary();
  }
  return cloudinaryClientInstance;
})();

// Helper function to generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  }
): string {
  if (!publicId || !cloudinaryClient) {
    return publicId; // Return original if Cloudinary not configured
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options || {};

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Cloud name'i config'den al (CLOUDINARY_URL kullanılıyorsa buradan gelir)
  const config = cloudinaryClient.config();
  const cloudName = config.cloud_name || process.env.CLOUDINARY_CLOUD_NAME?.trim();
  
  if (!cloudName) {
    console.warn("Cloudinary cloud_name not found, returning original URL");
    return publicId;
  }
  
  const transformationString = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

// Helper function to extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url.includes("cloudinary.com")) {
    return null;
  }

  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
    const parts = url.split("/upload/");
    if (parts.length > 1) {
      // Remove version if exists (v1234567890/)
      const publicIdPart = parts[1];
      return publicIdPart.replace(/^v\d+\//, "").split(".")[0];
    }
    return null;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
}

