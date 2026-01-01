import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import path from "path";
import { proxyToExternalAPI } from "@/lib/proxy";
//add path dir_name
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export async function GET(request: NextRequest) {
  try {
    const response = await proxyToExternalAPI(request, "/api/token-price");

    if (!response.ok) {
      console.error(
        `token-price API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch token data", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Token API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token data", message: String(error) },
      { status: 500 }
    );
  }
}
