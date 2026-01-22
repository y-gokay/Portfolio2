/**
 * Portfolio Validators
 */

import { PortfolioItem } from "../portfolio-data";

export function validatePortfolioItem(item: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
    errors.push("❌ 'id' alanı boş olamaz");
  }

  if (!item.title || typeof item.title !== "object") {
    errors.push("❌ 'title' alanı eksik");
  } else {
    if (!item.title.tr || typeof item.title.tr !== "string" || item.title.tr.trim() === "") {
      errors.push("❌ 'title.tr' (Türkçe başlık) boş olamaz");
    }
    if (!item.title.en || typeof item.title.en !== "string" || item.title.en.trim() === "") {
      errors.push("❌ 'title.en' (İngilizce başlık) boş olamaz");
    }
  }

  if (!item.category || typeof item.category !== "object") {
    errors.push("❌ 'category' alanı eksik");
  } else {
    if (!item.category.tr || typeof item.category.tr !== "string" || item.category.tr.trim() === "") {
      errors.push("❌ 'category.tr' (Türkçe kategori) boş olamaz");
    }
    if (!item.category.en || typeof item.category.en !== "string" || item.category.en.trim() === "") {
      errors.push("❌ 'category.en' (İngilizce kategori) boş olamaz");
    }
  }

  if (!item.description || typeof item.description !== "object") {
    errors.push("❌ 'description' alanı eksik");
  } else {
    if (!item.description.tr || typeof item.description.tr !== "string" || item.description.tr.trim() === "") {
      errors.push("❌ 'description.tr' (Türkçe açıklama) boş olamaz");
    }
    if (!item.description.en || typeof item.description.en !== "string" || item.description.en.trim() === "") {
      errors.push("❌ 'description.en' (İngilizce açıklama) boş olamaz");
    }
  }

  if (!item.image || typeof item.image !== "string" || item.image.trim() === "") {
    errors.push("❌ 'image' (ana görsel URL) boş olamaz");
  }

  if (!item.year || typeof item.year !== "string" || item.year.trim() === "") {
    errors.push("❌ 'year' (yıl) boş olamaz");
  }

  if (!item.tags || typeof item.tags !== "object") {
    errors.push("❌ 'tags' alanı eksik");
  } else {
    if (!Array.isArray(item.tags.tr)) {
      errors.push("❌ 'tags.tr' bir array olmalı");
    }
    if (!Array.isArray(item.tags.en)) {
      errors.push("❌ 'tags.en' bir array olmalı");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
