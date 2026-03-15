import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL;
const API_VERSION = "v1";

export async function GET(request: NextRequest) {
  try {
    const mek = request.headers.get("x-mek");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (mek) headers["x-mek"] = mek;

    const response = await fetch(
      `${API_BASE_URL}/api/${API_VERSION}/tokens`,
      { method: "GET", headers, cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`token API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch token data", status: response.status },
        { status: response.status }
      );
    }

    const body = await response.json();
    const res = NextResponse.json(body);

    if (response.headers.get("x-ect") === "1") {
      res.headers.set("x-ect", "1");
    }

    return res;
  } catch (error) {
    console.error("Token API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token data", message: String(error) },
      { status: 500 }
    );
  }
}
