"use client";

import { useState, useEffect } from "react";
import { ResumeData } from "@/lib/resume-data";

export function useResume() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const response = await fetch("/api/v1/resume");
        const result = await response.json();

        if (result.success && result.data) {
          setResumeData(result.data);
        } else {
          setError(result.error || "Veri alınamadı");
        }
      } catch (err) {
        setError("Bağlantı hatası");
        console.error("Resume fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResume();
  }, []);

  return { resumeData, loading, error };
}
