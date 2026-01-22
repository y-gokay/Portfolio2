import { useState, useCallback } from "react";
import { toast } from "sonner";
import React from "react";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchData: (url: string) => Promise<void>;
  saveData: (url: string, method: "PUT" | "POST", body: any) => Promise<boolean>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  reset: () => void;
}

/**
 * Reusable hook for API data fetching and saving
 */
export function useApi<T = any>(options: UseApiOptions = {}): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
          if (options.onSuccess) {
            options.onSuccess(result.data);
          }
        } else {
          const errorMsg = result.error || options.errorMessage || "Veriler yüklenemedi";
          setError(errorMsg);
          toast.error(errorMsg);
          if (options.onError) {
            options.onError(errorMsg);
          }
        }
      } catch (err) {
        const errorMsg = "Bağlantı hatası";
        setError(errorMsg);
        toast.error(errorMsg);
        if (options.onError) {
          options.onError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const saveData = useCallback(
    async (url: string, method: "PUT" | "POST", body: any): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (result.success) {
          if (options.successMessage) {
            toast.success(options.successMessage);
          }
          if (options.onSuccess) {
            options.onSuccess(result.data);
          }
          return true;
        } else {
          const errorMsg = result.error || options.errorMessage || "Kaydetme başarısız";
          setError(errorMsg);

          // Show detailed errors if available
          if (result.details && Array.isArray(result.details) && result.details.length > 0) {
            const errorDetails = result.details.slice(0, 5).join("\n");
            toast.error(`${errorMsg}\n\n${errorDetails}`, { duration: 10000 });
          } else {
            toast.error(errorMsg);
          }

          if (options.onError) {
            options.onError(errorMsg);
          }
          return false;
        }
      } catch (err) {
        const errorMsg = "Bağlantı hatası";
        setError(errorMsg);
        toast.error(errorMsg);
        if (options.onError) {
          options.onError(errorMsg);
        }
        return false;
      } finally {
        setSaving(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setSaving(false);
  }, []);

  return {
    data,
    loading,
    saving,
    error,
    fetchData,
    saveData,
    setData,
    reset,
  };
}
