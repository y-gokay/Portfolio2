import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    // Server-side password kontrolü - Environment variable'dan oku
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      return NextResponse.json({
        success: true,
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Yanlış şifre",
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}

