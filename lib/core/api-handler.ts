/**
 * Standard API Route Handler
 * Provides consistent error handling and response formatting
 */

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./types";

export class ApiHandler {
  /**
   * Handle GET requests
   */
  static async GET<T>(
    handler: () => Promise<T>,
    options?: { defaultOnError?: T }
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const data = await handler();
      return this.success(data);
    } catch (error) {
      console.error("API GET error:", error);
      const errorMessage = error instanceof Error ? error.message : "Veri alınamadı";
      
      if (options?.defaultOnError !== undefined) {
        return this.success(options.defaultOnError);
      }
      
      return this.error(errorMessage, 500);
    }
  }

  /**
   * Handle POST/PUT requests
   */
  static async POST<T, R = T>(
    request: NextRequest,
    handler: (data: T) => Promise<R>,
    validator?: (data: any) => { valid: boolean; errors?: string[] }
  ): Promise<NextResponse<ApiResponse<R>>> {
    try {
      const body = await this.parseBody<T>(request);
      
      // Validate if validator provided
      if (validator) {
        const validation = validator(body);
        if (!validation.valid) {
          return this.validationError(validation.errors || []);
        }
      }

      const result = await handler(body);
      return this.success(result);
    } catch (error) {
      console.error("API POST error:", error);
      const errorMessage = error instanceof Error ? error.message : "İşlem başarısız";
      return this.error(errorMessage, 500);
    }
  }

  /**
   * Handle PUT requests (same as POST)
   */
  static async PUT<T, R = T>(
    request: NextRequest,
    handler: (data: T) => Promise<R>,
    validator?: (data: any) => { valid: boolean; errors?: string[] }
  ): Promise<NextResponse<ApiResponse<R>>> {
    return this.POST(request, handler, validator);
  }

  /**
   * Handle DELETE requests
   */
  static async DELETE(
    request: NextRequest,
    handler: (id: string) => Promise<boolean>
  ): Promise<NextResponse<ApiResponse>> {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return this.error("ID gerekli", 400);
      }

      const success = await handler(id);
      if (!success) {
        return this.error("Silme işlemi başarısız", 404);
      }

      return this.success({ message: "Silindi" });
    } catch (error) {
      console.error("API DELETE error:", error);
      const errorMessage = error instanceof Error ? error.message : "Silme işlemi başarısız";
      return this.error(errorMessage, 500);
    }
  }

  /**
   * Parse request body
   */
  private static async parseBody<T>(request: NextRequest): Promise<T> {
    try {
      const body = await request.json();
      return body as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen parse hatası";
      throw new Error(`JSON parse hatası: ${errorMessage}`);
    }
  }

  /**
   * Success response
   */
  private static success<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }

  /**
   * Error response
   */
  private static error(
    message: string,
    status: number = 500,
    details?: string[]
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: details || [],
        errorCount: details?.length || 0,
      },
      {
        status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }

  /**
   * Validation error response
   */
  private static validationError(errors: string[]): NextResponse<ApiResponse> {
    return this.error("Validasyon hatası", 400, errors);
  }
}
