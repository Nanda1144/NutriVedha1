# NutriVedha — Security Guidelines & Compliance

## 1. Zero Trust Architectural Principles
1. **Never Trust Frontend Context**: The API Gateway and downstream microservices re-verify JWT claims, user identity, and permissions on every incoming request.
2. **Never Expose Secrets in Client Bundles**: Frontend environment variables prefixed with `VITE_` must strictly contain public non-sensitive configuration (`VITE_API_BASE_URL`, `VITE_APP_NAME`). Secrets (JWT signing keys, database passwords, Gemini API keys, AES encryption keys) are restricted exclusively to backend microservices.
3. **No Hardcoded Administrative Credentials**: All administrative accounts are provisioned via database seed scripts with hashed passwords (`bcrypt` cost factor 12) or created dynamically via the Auth Service.

---

## 2. Authentication & Session Security
- **Algorithm**: `HMAC-SHA256` (HS256) or `RS256` with strong 256-bit entropy secrets.
- **Token Expiry**:
  - Access Token: 15 minutes.
  - Refresh Token: 7 days.
- **Refresh Token Rotation**: Refresh tokens are single-use. When a refresh token is presented, it is immediately revoked and replaced with a newly generated token pair.
- **Brute Force Protection**: Rate limiting enforced on `/api/v1/auth/login` (maximum 5 attempts per 15 minutes per IP address) using `express-rate-limit`.

---

## 3. Cryptography & Health Record Encryption
- **Algorithm**: `AES-256-GCM` (Galois/Counter Mode).
- **Initialization Vector**: Cryptographically random 12-byte or 16-byte IV generated uniquely for every encryption operation (`crypto.randomBytes(16)`).
- **Authentication Tag**: 16-byte auth tag verified on decryption to prevent cipher-text tampering.
- **Key Management**: Encryption key sourced strictly from backend environment variable `MEDICAL_ENCRYPTION_KEY` (must be 64-character hex string representing 32 bytes).

---

## 4. Input Validation & Defense-in-Depth
- **Strict Schema Validation**: Every API route validates request bodies and query parameters with Zod schemas prior to reaching controller logic. Unrecognized parameters are stripped.
- **SQL Injection Prevention**: All queries execute via Prisma ORM parameterized queries or strict PostgreSQL prepared statements. Raw string concatenation in SQL is strictly prohibited.
- **Cross-Site Scripting (XSS)**: React 19 escapes rendered strings by default. User-generated content is sanitized.
- **HTTP Security Headers**: API Gateway mounts `helmet()` enforcing:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
