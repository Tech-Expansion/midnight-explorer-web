# 🔄 Proxy Flow Architecture

## Tổng quan

Project sử dụng **Next.js Backend-for-Frontend (BFF) Pattern** để proxy tất cả API requests đến backend external API. Kiến trúc này đảm bảo:

1. ✅ Token không bị expose ra client
2. ✅ CORS được xử lý tốt
3. ✅ Centralized error handling
4. ✅ Request/response transformation
5. ✅ Automatic retry logic

---

## 🏗️ Kiến trúc

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   Browser    │ ◄────► │  Next.js BFF │ ◄────► │   Backend    │
│   (Client)   │         │  (Proxy)     │         │   API        │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
   Cookie (__et)          Validates token           Bearer token
```

---

## 📁 File Structure

```
src/
├── lib/
│   ├── proxy.ts              # Core proxy logic
│   ├── api.ts                # API client wrapper
│   ├── fetch-utils.ts        # Retry utilities
│   └── token-manager.ts      # Token validation
│
└── app/api/
    ├── blocks/
    │   └── route.ts          # Proxy /blocks endpoint
    ├── transactions/
    │   └── route.ts          # Proxy /transactions endpoint
    ├── pool/
    │   └── route.ts          # Proxy /pool endpoint
    └── [other endpoints]/
```

---

## 🔄 Complete Request Flow

### 1️⃣ **Client Request**

```typescript
// Component code
import { blockAPI } from '@/lib/api'

const blocks = await blockAPI.getRecentBlocks()
```

### 2️⃣ **API Client Routing**

```typescript
// lib/api.ts - Tự động detect environment
function getApiBaseUrl(): string {
  // Server-side: call backend directly
  if (typeof window === 'undefined') {
    return `${BACKEND_API_URL}/api/v1` // Direct to backend
  }
  // Client-side: use Next.js proxy
  return '/api' // Next.js API routes
}
```

**Result:**
- Server (SSR): `https://backend.com/api/v1/blocks/recent`
- Client (Browser): `/api/blocks/recent` → Proxy

---

### 3️⃣ **Proxy Route Handler**

```typescript
// app/api/blocks/route.ts
import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  return proxyToExternalAPI(request, '/blocks')
}
```

**Responsibility:**
- Map Next.js route to backend endpoint
- Delegate to `proxyToExternalAPI` function

---

### 4️⃣ **Token Validation**

```typescript
// lib/proxy.ts
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  
  // 1. Validate token from cookie
  const token = validateToken(request)
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token required', code: 'TOKEN_REQUIRED' },
      { status: 401 }
    )
  }
  
  // Continue to forward request...
}
```

**Token Validation Steps:**
```typescript
// token-manager.ts
export function validateToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const token = getTokenFromCookie(cookieHeader) // Extract from __et cookie
  
  if (!token) {
    console.log('[Token] No token found in cookie')
    return null
  }
  
  if (!isTokenValid(token)) { // Check expiry
    console.log('[Token] Token is expired')
    return null
  }
  
  return token
}
```

---

### 5️⃣ **Forward to Backend**

```typescript
// lib/proxy.ts (continued)
const url = new URL(request.url)
const queryString = url.search 

// Build full URL: /api/v1/blocks?page=1
const fullUrl = `${API_BASE_URL}/api/${API_VERSION}${endpoint}${queryString}`

const response = await fetch(fullUrl, {
  method: request.method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Add Bearer token
  },
  cache: 'no-store',
})
```

**URL Transformation:**
```
Client request:  /api/blocks?page=1&limit=10
                      ↓
Proxy transforms: https://backend.com/api/v1/blocks?page=1&limit=10
```

---

### 6️⃣ **Response Handling**

```typescript
// lib/proxy.ts (continued)
if (!response.ok) {
  console.error(`[Proxy] External API error: ${response.status}`)
  return NextResponse.json(
    { error: 'External API request failed', status: response.status },
    { status: response.status }
  )
}

const data = await response.json()
return NextResponse.json(data) // Forward response to client
```

---

### 7️⃣ **Client Retry Logic (if 401)**

```typescript
// fetch-utils.ts
if (response.status === 401 && onTokenRefresh) {
  console.log('[FetchUtils] Got 401, refreshing token...')
  
  const refreshed = await onTokenRefresh()
  if (refreshed) {
    // Wait for cookie propagation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Retry với token mới
    const retryResponse = await fetch(url, fetchOptions)
    return retryResponse
  }
}
```

---

## 📊 Complete Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         BROWSER                                     │
│                                                                     │
│  Component                                                          │
│     │                                                               │
│     ▼                                                               │
│  blockAPI.getRecentBlocks()                                        │
│     │                                                               │
│     ▼                                                               │
│  apiFetch('/api/blocks/recent')                                    │
│     │                                                               │
│     ▼                                                               │
│  fetchWithTokenRetry()                                             │
│     │                                                               │
│     │ (Cookie __et auto-sent)                                      │
└─────┼──────────────────────────────────────────────────────────────┘
      │
      │ GET /api/blocks/recent
      │ Cookie: __et=<token>
      ▼
┌────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS BFF (Proxy)                           │
│                                                                     │
│  app/api/blocks/route.ts                                           │
│     │                                                               │
│     ▼                                                               │
│  proxyToExternalAPI(request, '/blocks')                            │
│     │                                                               │
│     ├─► 1. Extract token from cookie                               │
│     │                                                               │
│     ├─► 2. Validate token (check expiry)                           │
│     │      ├─ Valid? Continue                                      │
│     │      └─ Invalid? Return 401 ────┐                            │
│     │                                 │                            │
│     ├─► 3. Build backend URL          │                            │
│     │    /api/v1/blocks/recent        │                            │
│     │                                 │                            │
│     ├─► 4. Add Bearer token           │                            │
│     │    Authorization: Bearer <token>│                            │
│     │                                 │                            │
│     ▼                                 │                            │
└─────┼──────────────────────────────────┼────────────────────────────┘
      │                                 │
      │ GET /api/v1/blocks/recent       │
      │ Authorization: Bearer <token>   │
      ▼                                 │
┌────────────────────────────────────   │                            
│   EXTERNAL BACKEND API                │                            
│                                       │                            
│  - Validate Bearer token              │                            
│  - Process request                    │                            
│  - Return data                        │                            
│     │                                 │                            
│     ▼                                 │                            
└─────┼──────────────────────────────   │                            
      │                                 │
      │ 200 OK                          │
      │ { blocks: [...] }               │
      ▼                                 │
┌────────────────────────────────────   │                            
│  NEXT.JS BFF                          │                            
│     │                                 │                            
│     ├─► Forward response              │                            
│     │                                 │                            
│     ▼                                 │                            
└─────┼──────────────────────────────   │                            
      │                                 │
      │ 200 OK                          │ 401 Unauthorized
      │ { blocks: [...] }               │ { error: "Token required" }
      ▼                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  BROWSER                                                            │
│     │                                                               │
│     ├─► Success: Use data             │                            │
│     │                                 │                            │
│     └─► 401: Trigger token refresh ◄──┘                            │
│            │                                                        │
│            ▼                                                        │
│         POST /api/auth/refresh                                     │
│            │                                                        │
│            ▼                                                        │
│         Get new token → Retry request                              │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Detailed Code Flow

### Example: Get Recent Blocks

#### Step 1: Component calls API

```typescript
// app/blocks/page.tsx
import { blockAPI } from '@/lib/api'

export default async function BlocksPage() {
  const blocks = await blockAPI.getRecentBlocks()
  
  return <BlocksList blocks={blocks} />
}
```

#### Step 2: API Client (Client-side)

```typescript
// lib/api.ts
export const blockAPI = {
  getRecentBlocks: <T = unknown>() =>
    apiFetch<T>('/blocks/recent'),
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl() // Returns '/api' for client
  const url = `${baseUrl}${endpoint}` // '/api/blocks/recent'
  
  // Client-side: use fetchWithTokenRetry (auto-waits for token)
  const response = await fetchWithTokenRetry(url, options)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}
```

#### Step 3: Token Retry Wrapper

```typescript
// token-client.ts
export async function fetchWithTokenRetry(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Wait for initial token automatically
  await tokenManager.waitUntilReady()
  
  // Fetch with retry logic (handles 401 auto-refresh)
  return fetchWithRetry(url, options, () => tokenManager.refresh())
}

// fetch-utils.ts
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  onTokenRefresh?: () => Promise<boolean>
): Promise<Response> {
  
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include', // Send cookies (__et)
  }
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(url, fetchOptions)
    
    if (response.ok) {
      return response
    }
    
    // Handle 401 - Token expired
    if (response.status === 401 && onTokenRefresh) {
      const refreshed = await onTokenRefresh()
      
      if (refreshed) {
        // Retry with new token
        const retryResponse = await fetch(url, fetchOptions)
        return retryResponse
      }
    }
    
    // Handle other errors (5xx, 429, etc.)
    if (isRetryableError(response.status)) {
      const delay = getBackoffDelay(attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }
    
    return response
  }
}
```

#### Step 4: Proxy Route

```typescript
// app/api/blocks/route.ts
import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(request: NextRequest) {
  // Simply delegate to proxy
  return proxyToExternalAPI(request, '/blocks')
}
```

#### Step 5: Proxy Logic

```typescript
// lib/proxy.ts
export async function proxyToExternalAPI(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    // 1. Validate token
    const token = validateToken(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token required', code: 'TOKEN_REQUIRED' },
        { status: 401 }
      )
    }
  
    // 2. Build URL
    const url = new URL(request.url)
    const queryString = url.search
    const fullUrl = `${API_BASE_URL}/api/${API_VERSION}${endpoint}${queryString}`
    
    console.log(`[Proxy] Forwarding to: ${fullUrl}`)

    // 3. Forward request
    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add token
      },
      cache: 'no-store',
    })

    // 4. Handle response
    if (!response.ok) {
      console.error(`[Proxy] Backend error: ${response.status}`)
      return NextResponse.json(
        { error: 'Backend request failed', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Proxy failed', message: String(error) },
      { status: 500 }
    )
  }
}
```

---

## 🎯 Proxy Benefits

### 1. **Token Security**

```
❌ Without Proxy:
Browser → Backend (token exposed in JS)

✅ With Proxy:
Browser → Next.js BFF → Backend
         (token in HttpOnly cookie)
```

### 2. **CORS Handling**

```
❌ Without Proxy:
Browser → Backend (CORS preflight needed)

✅ With Proxy:
Browser → Next.js (same origin, no CORS)
Next.js → Backend (server-to-server)
```

### 3. **Centralized Error Handling**

```typescript
// All errors handled in one place
if (!response.ok) {
  // Log, transform, retry logic
  console.error(`[Proxy] Error: ${response.status}`)
  
  // Can add custom error messages
  return NextResponse.json({
    error: getHumanReadableError(response.status),
    status: response.status
  }, { status: response.status })
}
```

### 4. **Request/Response Transformation**

```typescript
// Can modify requests
const response = await fetch(fullUrl, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Custom-Header': 'value', // Add custom headers
  }
})

// Can modify responses
const data = await response.json()

// Transform data if needed
const transformedData = {
  ...data,
  timestamp: Date.now(), // Add metadata
}

return NextResponse.json(transformedData)
```

### 5. **Rate Limiting & Caching**

```typescript
// Can add rate limiting
const rateLimiter = new RateLimiter({ max: 100, window: 60000 })

if (!rateLimiter.check(clientId)) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429 }
  )
}

// Can add caching
const cached = cache.get(endpoint)
if (cached) {
  return NextResponse.json(cached)
}
```

---

## 📋 API Endpoint Mapping

| Client Route | Next.js Proxy | Backend Endpoint |
|--------------|---------------|------------------|
| `/api/blocks` | `app/api/blocks/route.ts` | `/api/v1/blocks` |
| `/api/blocks/recent` | Forwarded with query | `/api/v1/blocks/recent` |
| `/api/transactions` | `app/api/transactions/route.ts` | `/api/v1/transactions` |
| `/api/transactions/[hash]` | `app/api/transactions/[hash]/route.ts` | `/api/v1/transactions/{hash}` |
| `/api/pool/[id]` | `app/api/pool/[id]/route.ts` | `/api/v1/pool/{id}` |

### Dynamic Routes Example

```typescript
// app/api/transactions/[hash]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  return proxyToExternalAPI(request, `/transactions/${params.hash}`)
}
```

**URL Flow:**
```
Client:  /api/transactions/0x1234abcd
           ↓
Proxy:   /api/v1/transactions/0x1234abcd
           ↓
Backend: https://backend.com/api/v1/transactions/0x1234abcd
```

---

## 🔄 SSR vs CSR Proxy

### Server-Side Rendering (SSR)

```typescript
// lib/api.ts
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  // Server-side: Call backend directly
  if (typeof window === 'undefined') {
    const token = await getServerToken() // Fetch server token
    
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`, // Direct Bearer
      }
    }
    
    const response = await fetch(url, config)
    return response.json()
  }
  
  // Client-side: Use proxy
  const response = await fetchWithTokenRetry(url, options)
  return response.json()
}
```

**SSR Flow:**
```
Next.js Server
    ↓
fetchServerToken() → Temp token
    ↓
fetch('https://backend.com/api/v1/blocks')
    ↓
Direct to backend (no proxy)
```

**CSR Flow:**
```
Browser
    ↓
fetch('/api/blocks') → Token from cookie
    ↓
Next.js Proxy → Validate & forward
    ↓
Backend
```

---

## ⚠️ Error Scenarios

### 1. Token Missing/Expired

```
Client → /api/blocks
    ↓
Proxy validates token → ❌ Invalid
    ↓
Return 401: { error: "Token required" }
    ↓
Client: fetchWithRetry catches 401
    ↓
Triggers refreshToken()
    ↓
POST /api/auth/refresh → New token
    ↓
Retry original request with new token
```

### 2. Backend Error (5xx)

```
Client → /api/blocks
    ↓
Proxy → Backend
    ↓
Backend returns 503 Service Unavailable
    ↓
Proxy forwards: { error: "Backend failed", status: 503 }
    ↓
Client: fetchWithRetry detects 503 (retryable)
    ↓
Exponential backoff: wait 1s, 2s, 4s
    ↓
Retry up to 3 times
```

### 3. Network Error

```
Client → /api/blocks
    ↓
Proxy → Backend (network timeout)
    ↓
Catch error in proxy
    ↓
Return 500: { error: "Proxy failed", message: "..." }
    ↓
Client: Retry with backoff
```

### 4. Rate Limiting (429)

```
Client → /api/blocks
    ↓
Backend returns 429 Too Many Requests
    ↓
Proxy forwards 429
    ↓
Client: fetchWithRetry detects 429 (retryable)
    ↓
Wait with exponential backoff
    ↓
Retry
```

---

## 📝 Proxy Route Template

```typescript
// app/api/[your-endpoint]/route.ts
import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

/**
 * GET /api/[your-endpoint]
 * Proxies to backend /api/v1/[your-endpoint]
 */
export async function GET(request: NextRequest) {
  return proxyToExternalAPI(request, '/[your-endpoint]')
}

/**
 * POST /api/[your-endpoint]
 * Proxies to backend /api/v1/[your-endpoint]
 */
export async function POST(request: NextRequest) {
  return proxyToExternalAPI(request, '/[your-endpoint]')
}

// Add other HTTP methods as needed: PUT, DELETE, PATCH
```

### Dynamic Route Template

```typescript
// app/api/[resource]/[id]/route.ts
import { NextRequest } from 'next/server'
import { proxyToExternalAPI } from '@/lib/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToExternalAPI(request, `/resource/${params.id}`)
}
```

---

## 🧪 Testing Proxy

### Test Token Validation

```bash
# Without token (should fail)
curl http://localhost:3000/api/blocks

# Response: 401 { "error": "Token required" }
```

### Test with Valid Token

```bash
# Get token first (from browser)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/refresh \
  -H "User-Agent: Mozilla/5.0..." \
  --cookie-jar cookies.txt)

# Use token
curl http://localhost:3000/api/blocks \
  --cookie cookies.txt

# Response: 200 { "blocks": [...] }
```

### Test Retry Logic

```typescript
// Mock failing backend
const response = await fetch('/api/blocks')

// Should auto-retry on 5xx
// Check Network tab for multiple requests
```

---

## 📊 Performance Considerations

### 1. **Proxy Overhead**

```
Direct:  Browser → Backend (1 hop)
Proxy:   Browser → Next.js → Backend (2 hops)

Added latency: ~10-50ms (depending on Next.js server)
```

**Mitigation:**
- Deploy Next.js close to backend (same region)
- Use HTTP/2 keep-alive
- Consider caching for repeated requests

### 2. **Token Validation Cost**

```typescript
// Every request validates token
const token = validateToken(request) // Decode JWT + check expiry

// Cost: ~1-2ms per request
```

**Optimization:**
- JWT decode is fast (no crypto verification)
- Only checks expiry timestamp
- No database lookup needed

### 3. **Connection Pooling**

```typescript
// Node.js fetch uses connection pooling by default
const response = await fetch(fullUrl, {
  // Reuses TCP connections
  keepalive: true,
})
```

---

## 🎓 Summary

### Proxy Flow in 3 Steps

```
1. Client → Next.js BFF
   ├─ Token in HttpOnly cookie
   └─ Same-origin request (no CORS)

2. Next.js validates & forwards → Backend
   ├─ Extract token from cookie
   ├─ Validate expiry
   └─ Add Bearer token header

3. Backend → Response → Client
   ├─ Backend processes with token
   ├─ Next.js forwards response
   └─ Client receives data
```

### Key Files

| File | Purpose |
|------|---------|
| [proxy.ts](../src/lib/proxy.ts) | Core proxy logic with token validation |
| [api.ts](../src/lib/api.ts) | Client wrapper (SSR/CSR detection) |
| [token-client.ts](../src/lib/token-client.ts) | Class-based token manager singleton |
| [fetch-utils.ts](../src/lib/fetch-utils.ts) | Retry logic & error handling |
| [app/api/*/route.ts](../src/app/api) | Proxy route handlers |

### Why This Architecture?

1. ✅ **Security**: Token never exposed to browser JS
2. ✅ **Flexibility**: Can add middleware, caching, rate limiting
3. ✅ **Maintainability**: Centralized API logic
4. ✅ **Debugging**: All requests logged in BFF
5. ✅ **Type Safety**: TypeScript end-to-end
6. ✅ **Auto Token Management**: React Query + Token Manager handle everything

---

**This BFF pattern provides a secure, maintainable, and flexible way to handle API communication while keeping tokens safe!** 🔒

## 🎯 Modern Stack Integration

### React Query + Token Manager
```typescript
// Components use standard React Query
function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['blocks'],
    queryFn: () => blockAPI.getRecentBlocks(),
  })
  
  // Token automatically handled by:
  // 1. TokenProvider ensures token ready
  // 2. fetchWithTokenRetry waits for token
  // 3. Auto-retry on 401
  // 4. No manual management needed
}
```

### Provider Hierarchy
```
App Layout
  └─ QueryClientProvider (React Query)
      └─ TokenProvider (Token initialization + loading gate)
          └─ Components (Use useQuery hooks freely)
```

### Benefits of Integration
- ✅ **Automatic**: Token ready before any API calls
- ✅ **Declarative**: Standard React Query patterns
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Cacheable**: React Query handles caching
- ✅ **Optimistic**: Can use optimistic updates
- ✅ **Retryable**: Built-in retry + token refresh
