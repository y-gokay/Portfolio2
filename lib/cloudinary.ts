import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
// Environment variables'lar .env.local veya Vercel Dashboard'dan geliyor
export function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn(
      "Cloudinary environment variables are not set. Upload functionality will not work."
    );
    return null;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

// Cloudinary client instance
export const cloudinaryClient = configureCloudinary();

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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
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

