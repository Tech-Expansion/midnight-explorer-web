/**
 * API Proxy Utility
 * Forwards all requests to external API service
 * Only validates token, never auto-refreshes
 */

import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "./token-manager";

const API_BASE_URL =
  process.env.API_URL || "https://testnet-service.midnightexplorer.com";
const API_VERSION = "v1";

/**
 * Proxy a request to the external API
 * Returns 401 if token is invalid/missing (browser will handle refresh)
 */
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    // 1. Validate token (no auto-refresh)
    const token = validateToken(request);

    if (!token) {
      console.error("[Proxy] No valid token, returning 401");
      return NextResponse.json(
        { error: "Token required", code: "TOKEN_REQUIRED" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const queryString = url.search;

    // Build full URL with /api/v1 prefix
    const fullUrl = endpoint.includes("?")
      ? `${API_BASE_URL}/api/${API_VERSION}${endpoint}`
      : `${API_BASE_URL}/api/${API_VERSION}${endpoint}${queryString}`;

    console.log(`[Proxy] Forwarding request to: ${fullUrl}`);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);

    // Forward encryption key
    const encryptKey = request.headers.get("x-mek");
    if (encryptKey) {
      headers.set("x-mek", encryptKey);
    }

    // 2. Forward request with token
    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[Proxy] External API error: ${response.status} ${response.statusText}`
      );

      let errorMessage = "External API request failed";
      try {
        const errBody = await response.json();
        errorMessage = errBody?.message || errorMessage;
      } catch {}

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // resultType: { isSuccess, data, message }
    const result = await response.json();
    if (result?.isSuccess === false) {
      return NextResponse.json(
        { error: result.message || "Request failed" },
        { status: 500 }
      );
    }
    const nextResponse = NextResponse.json(result?.data);
    // Forward isEncrypted header if present
    const isEncrypted = response.headers.get("x-ect");
    if (isEncrypted) {
      nextResponse.headers.set("x-ect", isEncrypted);
    }
    return nextResponse;
  } catch (error: any) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to proxy request" },
      { status: 500 }
    );
  }
}
