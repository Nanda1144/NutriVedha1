# NutriVedha — Authentication & Authorization Workflow

## 1. Authentication Architecture (JWT + Refresh Token Rotation)

NutriVedha implements a dual-token authentication scheme to ensure security without sacrificing performance.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Admin
    participant Client as Frontend SPA
    participant GW as API Gateway (:8080)
    participant Auth as Auth Service (:3001)
    participant DB as PostgreSQL Database

    User->>Client: Enters Email & Password
    Client->>GW: POST /api/v1/auth/login
    GW->>Auth: Forward Login Request
    Auth->>DB: Query user by email (SELECT users JOIN roles)
    DB-->>Auth: User Record & password_hash
    Auth->>Auth: Verify password via bcrypt.compare()
    
    alt Invalid Password
        Auth-->>GW: 401 Unauthorized
        GW-->>Client: 401 Invalid Credentials
    else Valid Password
        Auth->>Auth: Generate Access Token (15m expiry, HMAC-SHA256)
        Auth->>Auth: Generate Refresh Token (7d expiry, cryptographically random)
        Auth->>DB: INSERT INTO refresh_tokens (token_hash, expires_at)
        Auth-->>GW: { accessToken, refreshToken, user: { id, email, role } }
        GW-->>Client: 200 OK + Auth Payload
        Client->>Client: Store accessToken in memory & refreshToken in secure storage
    end

    Note over Client, GW: Subsequent Authenticated Requests
    Client->>GW: GET /api/v1/users/profile (Authorization: Bearer <accessToken>)
    GW->>GW: Verify JWT signature & expiration
    GW->>GW: Inject headers: X-User-ID, X-User-Role
    GW->>InternalSvc: Proxy to User Service (:3002)
    InternalSvc-->>GW: 200 OK (Profile Data)
    GW-->>Client: 200 OK
```

---

## 2. Token Refresh & Rotation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Axios Interceptor
    participant GW as API Gateway (:8080)
    participant Auth as Auth Service (:3001)
    participant DB as PostgreSQL Database

    Client->>GW: POST /api/v1/auth/refresh { refreshToken }
    GW->>Auth: Forward Refresh Request
    Auth->>DB: SELECT FROM refresh_tokens WHERE token_hash = hash(token)
    DB-->>Auth: Token Record

    alt Token Expired or Revoked
        Auth-->>GW: 401 Unauthorized (Session Expired)
        GW-->>Client: 401 Revoked Session
        Client->>Client: Clear state & Redirect to /login
    else Valid Token
        Auth->>DB: UPDATE refresh_tokens SET is_revoked = TRUE (Single Use)
        Auth->>Auth: Generate New Access Token & New Refresh Token
        Auth->>DB: INSERT INTO refresh_tokens (new_token_hash)
        Auth-->>GW: { accessToken, refreshToken }
        GW-->>Client: 200 OK (New Tokens)
        Client->>Client: Resume Queued API Requests
    end
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint Route Pattern | Required Role | Unauthenticated | User Role | Admin Role |
|---|---|---|---|---|
| `POST /api/v1/auth/register` | Public | Allowed | Allowed | Allowed |
| `POST /api/v1/auth/login` | Public | Allowed | Allowed | Allowed |
| `GET /api/v1/users/profile` | Authenticated | 401 Unauthorized | Allowed | Allowed |
| `POST /api/v1/ai/scan` | Authenticated | 401 Unauthorized | Allowed | Allowed |
| `GET /api/v1/medical/reports` | Authenticated | 401 Unauthorized | Allowed (Own records) | 403 Forbidden |
| `GET /api/v1/marketplace/products` | Public | Allowed | Allowed | Allowed |
| `POST /api/v1/orders/checkout` | User | 401 Unauthorized | Allowed | 403 Forbidden |
| `GET /api/v1/analytics/overview` | Admin | 401 Unauthorized | 403 Forbidden | Allowed |
| `POST /api/v1/notifications/broadcast`| Admin | 401 Unauthorized | 403 Forbidden | Allowed |
| `POST /api/v1/users/:id/status` | Admin | 401 Unauthorized | 403 Forbidden | Allowed |
