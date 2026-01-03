# 🔐 Ephemeral Token System

## Tổng quan

Hệ thống **Ephemeral Token** được thiết kế để bảo vệ API backend khỏi curl abuse và bot scraping bằng cách sử dụng browser fingerprinting và HttpOnly cookies.

---

## 🎯 Mục tiêu

1. **Chống Curl Abuse**: Token chỉ có thể được lấy từ real browser với fingerprint thực
2. **Token ngắn hạn**: Expire sau 2 phút để giảm thiểu rủi ro
3. **Auto-refresh**: Browser tự động refresh token mỗi 90 giây
4. **Secure Cookie**: HttpOnly cookie không thể bị đọc bởi JavaScript
5. **Dual Environment**: Hỗ trợ cả SSR (server) và CSR (client)

---

## 📁 Kiến trúc File

```
src/lib/
├── token-client.ts      # Token manager (class-based singleton)
├── server-token.ts      # Token fetcher cho SSR (server-side)
├── token-manager.ts     # Utilities (decode, validate, cookie)
└── fetch-utils.ts       # Retry logic với token refresh

src/components/
├── token-provider.tsx   # React wrapper khởi động token system
└── query-provider.tsx   # React Query provider

src/app/api/auth/refresh/
└── route.ts            # Endpoint để browser refresh token
```

---

## 🔄 Luồng hoạt động

### 1️⃣ **Initial Page Load (SSR)**

```
User request page → Next.js Server
         ↓
fetchServerToken() - Tạo token tạm
         ↓
Call Backend API với Bearer token
         ↓
Render HTML + data → Send to Browser
         ↓
Token bị discard (không lưu)
```

**Đặc điểm:**
- ✅ Token tạm thời chỉ dùng cho 1 request SSR
- ✅ Không có browser fingerprint thực
- ❌ Không set cookie cho client
- ❌ Bảo mật thấp (có thể fake)

**Code:**
```typescript
// server-token.ts
export async function fetchServerToken(): Promise<string | null> {
  const response = await fetch(`${BACKEND_API_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  
  const data = await response.json()
  return data.token
}
```

---

### 2️⃣ **Browser Initialization (Client-Side)**

```
Browser receives HTML
         ↓
React hydration → QueryProvider → TokenProvider mounted
         ↓
useEffect triggers → startTokenRefresh()
         ↓
Ngay lập tức: fetchInitialToken()
         ↓
POST /api/auth/refresh (với real fingerprint)
         ↓
Backend validates fingerprint → issues token
         ↓
Token stored in HttpOnly cookie (__et)
         ↓
TokenProvider shows loading until ready
         ↓
Set interval: refresh mỗi 90s
         ↓
Children components render (React Query hooks active)
```

**Đặc điểm:**
- ✅ Real browser fingerprint (User-Agent, Accept-Language)
- ✅ HttpOnly cookie → JS không đọc được
- ✅ Tự động refresh → user không cần làm gì
- ✅ Bảo mật cao

**Code:**
```typescript
// token-client.ts - Class-based singleton
class TokenManager {
  async start(): Promise<void> {
    if (this.isReady) return
    
    // Create ready promise
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve
    })
    
    // Fetch initial token
    await this.fetchInitialToken()
    
    // Start auto-refresh every 90s
    this.refreshTimer = setInterval(() => {
      this.refresh()
    }, REFRESH_INTERVAL)
  }
  
  async refresh(): Promise<boolean> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
    
    return response.ok
  }
  
  async waitUntilReady(): Promise<boolean> {
    if (this.isReady) return true
    return this.readyPromise || Promise.resolve(false)
  }
}

// Singleton instance
const tokenManager = new TokenManager()

// Public API
export const startTokenRefresh = () => tokenManager.start()
export const stopTokenRefresh = () => tokenManager.stop()
export const waitForToken = () => tokenManager.waitUntilReady()
```

---

### 3️⃣ **API Calls từ Browser**

```
Component calls API
         ↓
fetchWithTokenRetry(url)
         ↓
Cookie (__et) tự động gửi kèm request
         ↓
Next.js proxy validates token
         ↓
Token valid?
   ├─→ YES: Forward to backend with Bearer token
   └─→ NO: Return 401
             ↓
       fetchWithRetry triggers refreshToken()
             ↓
       Retry request với token mới
```

**Đặc điểm:**
- ✅ Tự động retry khi token expire
- ✅ Exponential backoff cho network errors
- ✅ Max 3 retries

**Code:**
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

// Components just use hooks - no manual waiting needed
const { data, isLoading } = useQuery({
  queryKey: ['blocks'],
  queryFn: () => blockAPI.getRecentBlocks(),
})
```

---

## 🔑 Token Lifecycle

```
Token Creation
    ↓
├─ Server Token (SSR)
│    └─ Lifespan: 1 request
│    └─ Storage: None (in-memory)
│    └─ Security: Low
│
└─ Browser Token (Client)
     └─ Lifespan: 2 minutes (120s)
     └─ Refresh: Every 90s
     └─ Storage: HttpOnly Cookie
     └─ Security: High
```

### Timeline Example:

```
t=0s    → User loads page
t=0s    → SSR fetch với server token
t=0.5s  → HTML rendered, sent to browser
t=1s    → TokenProvider starts, fetch browser token
t=1.2s  → Browser token set in cookie (__et)
t=90s   → Auto refresh #1
t=180s  → Auto refresh #2
t=270s  → Auto refresh #3
...     → Continues every 90s
```

---

## 🍪 Cookie Details

```javascript
Set-Cookie: __et=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=120; Secure
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `__et` | Token string | Cookie name |
| `HttpOnly` | true | JS không đọc được → chống XSS |
| `Path` | / | Áp dụng cho toàn site |
| `SameSite` | Lax | Chống CSRF |
| `Max-Age` | 120s | Expire cùng token |
| `Secure` | production | Chỉ gửi qua HTTPS |

**Code:**
```typescript
// token-manager.ts
export function createTokenCookie(token: string): string {
  return [
    `${TOKEN_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=120',
    isProduction ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}
```

---

## 🛡️ Security Features

### 1. **Browser Fingerprinting**

Backend validates:
- User-Agent
- Accept-Language
- Request pattern
- IP address (optional)

```typescript
// /api/auth/refresh/route.ts
const userAgent = request.headers.get('user-agent') || 'unknown'
const acceptLanguage = request.headers.get('accept-language') || 'en-US'

const token = await fetchNewToken(userAgent, acceptLanguage)
```

### 2. **Short-lived Tokens**

- Token expire: 2 minutes
- Refresh interval: 90 seconds
- Overlap: 30 seconds buffer

### 3. **HttpOnly Cookie**

```javascript
// JavaScript không thể đọc cookie
document.cookie // không thấy __et
```

### 4. **No Token in URL/LocalStorage**

- ❌ Không store trong localStorage
- ❌ Không truyền qua URL parameters
- ✅ Chỉ trong HttpOnly cookie

---

## 🔧 Token Utilities

### Decode JWT

```typescript
export function decodeJWT(token: string): TokenPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  
  const payload = parts[1]
  const decoded = Buffer.from(payload, 'base64').toString('utf-8')
  return JSON.parse(decoded)
}
```

### Validate Token

```typescript
export function isTokenValid(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) return false
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}
```

### Extract from Cookie

```typescript
export function getTokenFromCookie(cookies: string): string | null {
  const cookieArray = cookies.split(';').map(c => c.trim())
  const tokenCookie = cookieArray.find(c => c.startsWith(`${TOKEN_COOKIE_NAME}=`))
  
  if (!tokenCookie) return null
  return tokenCookie.split('=')[1]
}
```

---

## 📊 Flow Diagrams

### Complete Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER REQUEST                          │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │   Next.js SSR  │
    └────────┬───────┘
             │
             ├─────────────────────────────────────────┐
             │                                         │
             ▼                                         ▼
    ┌────────────────┐                       ┌────────────────┐
    │ fetchServerToken│                       │ Render HTML   │
    │   (temporary)   │                       │  + Send to    │
    └────────┬───────┘                       │   Browser     │
             │                                └────────┬───────┘
             ▼                                         │
    ┌────────────────┐                                │
    │ Call Backend   │                                │
    │   with token   │                                │
    └────────┬───────┘                                │
             │                                         │
             └─────────────────────────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │  Browser Receives│
                        │      HTML        │
                        └──────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │  TokenProvider   │
                        │    mounted       │
                        └──────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │ startTokenRefresh│
                        └──────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │ POST /api/auth/  │
                        │     refresh      │
                        └──────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │ Set Cookie (__et)│
                        └──────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │ Refresh every 90s│
                        └──────────────────┘
```

---

## ⚠️ Error Handling

### Token Refresh Failed

```typescript
async function refreshTokenSync() {
  const success = await refreshToken()
  
  if (success) {
    initialTokenFetched = true
  } else {
    // Retry sau 2 seconds
    setTimeout(refreshTokenSync, 2000)
  }
}
```

### API Call Failed (401)

```typescript
// fetch-utils.ts
if (response.status === 401 && onTokenRefresh) {
  console.log('[FetchUtils] Got 401, refreshing token...')
  
  const refreshed = await onTokenRefresh()
  if (!refreshed) {
    console.error('[FetchUtils] Token refresh failed')
    return response // Return 401 to caller
  }
  
  // Retry với token mới
  return await fetch(url, fetchOptions)
}
```

### Max Retries Exceeded

```typescript
for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
  try {
    const response = await fetch(url, fetchOptions)
    
    if (response.ok) {
      return response
    }
    
    if (isRetryableError(response.status) && attempt < MAX_RETRIES - 1) {
      const delay = getBackoffDelay(attempt) // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }
    
    return response // Give up after max retries
  } catch (error) {
    // Handle network errors
  }
}
```

---

## 🧪 Testing
Browser Token Test

```typescript
// Browser console
// Check cookie
document.cookie // Won't see __et (HttpOnly)

// Check token refresh
// Open Network tab → Filter "refresh" → See POST every 90s
```

### React Query Integration Test

```typescript
// Any component
import { useQuery } from '@tanstack/react-query'
import { blockAPI } from '@/lib/api'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['blocks'],
    queryFn: () => blockAPI.getRecentBlocks(),
  })
  
  // Token automatically handled
  // No manual waitForToken needed
}
// Open Network tab → Filter "refresh" → See POST every 90s
```

### Token Decode Test

```typescript
import { decodeJWT } from '@/lib/token-manager'

const token = 'eyJhbGc...'
const payload = decodeJWT(token)
console.log('Payload:', payload)
// { fingerprint: "...", iat: 1234567890, exp: 1234567890 }
``Wrap app with QueryProvider → TokenProvider hierarchy
- Use React Query hooks (useQuery) for data fetching
- Let `fetchWithTokenRetry` handle token waiting automatically
- Monitor token refresh trong Network tab
- Use `apiFetch` từ `api.ts` để tự động xử lý SSR/CSR

### ❌ DON'T

- Không manually call `waitForToken` trong components
- Không lưu token trong localStorage
- Không gửi token qua URL
- Không tắt `credentials: 'include'`
- Không manually manage token cookie
- Không dùng server token cho client requests
- Không tạo custom token fetching logic

### ❌ DON'T

- Không lưu token trong localStorage
- Không gửi token qua URL
- Không tắt `credentials: 'include'`
- Không manually manage token cookie
- Không dùng server token cho client requests

---

## 🎓 Summary

| Feature | Server Token | Browser Token |
|---------|--------------|---------------|
| **Environment** | Node.js (SSR) | Browser (Client) |
| **Fingerprint** | Fake/None | Real (User-Agent, etc.) |
| **Storage** | None (ephemeral) | HttpOnly Cookie |
| **Lifespan** | 1 request | 2 minutes |
| **Refresh** | None | Every 90s |
| **Security** | Low | High |
| **Purpose** | SSR data fetching | Client interactions |
| **Auto-retry** | ❌ No | ✅ Yes |

---
Class-based token manager singleton
- [server-token.ts](../src/lib/server-token.ts) - SSR token fetcher
- [token-manager.ts](../src/lib/token-manager.ts) - Token utilities
- [token-provider.tsx](../src/components/token-provider.tsx) - React initialization with loading gate
- [query-provider.tsx](../src/components/query-provider.tsx) - React Query setup
- [fetch-utils.ts](../src/lib/fetch-utils.ts) - Retry logic with exponential backoff
- [route.ts](../src/app/api/auth/refresh/route.ts) - Token refresh endpoint

---

## 🎯 Architecture Highlights

### Provider Hierarchy
```
QueryClientProvider (React Query)
  └─ TokenProvider (Wait for initial token)
      └─ App Components (Use React Query hooks)
```

### Token Manager (Singleton Pattern)
```typescript
class TokenManager {
  start()          // Initialize + fetch first token
  refresh()        // Refresh token from backend
  waitUntilReady() // Promise that resolves when ready
  stop()           // Cleanup
}
```

### Automatic Token Handling
```typescript
// Components just use standard React Query
const { data } = useQuery({
  queryKey: ['blocks'],
  queryFn: () => blockAPI.getRecentBlocks(),
})

// fetchWithTokenRetry handles everything:
// ✅ Wait for initial token
// ✅ Auto-retry on 401
// ✅ Exponential backoff
// ✅ No manual management needed
```
- [token-provider.tsx](../src/components/token-provider.tsx) - React initialization
- [fetch-utils.ts](../src/lib/fetch-utils.ts) - Retry logic
- [route.ts](../src/app/api/auth/refresh/route.ts) - Refresh endpoint

---

**Hệ thống này đảm bảo rằng chỉ real browsers mới có thể access API, effectively chống lại curl abuse và automated scraping!** 🛡️
