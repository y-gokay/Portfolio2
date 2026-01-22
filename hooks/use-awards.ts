"use client";

import { useState, useEffect } from "react";
import { AwardsData, AwardItem, ExhibitionItem } from "@/lib/awards-data";

export function useAwards() {
  const [awardsData, setAwardsData] = useState<AwardsData>({
    awards: [],
    exhibitions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAwards() {
      try {
        const response = await fetch("/api/v1/awards");
        const result = await response.json();

        if (result.success && result.data) {
          setAwardsData(result.data);
        } else {
          setError(result.error || "Veri alınamadı");
        }
      } catch (err) {
        setError("Bağlantı hatası");
        console.error("Awards fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAwards();
  }, []);

  return { awardsData, loading, error };
}
