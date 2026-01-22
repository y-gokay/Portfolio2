"use client";

import { useState, useEffect } from "react";
import { PortfolioItem } from "@/lib/portfolio-data";

export function usePortfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch("/api/v1/portfolio");
        const result = await response.json();

        if (result.success) {
          setPortfolioItems(result.data);
        } else {
          setError(result.error || "Veri alınamadı");
        }
      } catch (err) {
        setError("Bağlantı hatası");
        console.error("Portfolio fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  return { portfolioItems, loading, error };
}
