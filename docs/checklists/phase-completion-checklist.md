# NutriVedha — Phase 1 Completion Checklist

## 1. Database & Infrastructure Verification
- [ ] Single PostgreSQL 16 database running with `pgcrypto` and `uuid-ossp` extensions enabled.
- [ ] All Phase 1 tables verified with primary keys, unique constraints, and foreign key relations.
- [ ] Explicit B-tree and composite indexes created for query optimization.
- [ ] Baseline seeds populated (default roles, verified Ayurvedic doctors, organic products, admin account).
- [ ] Automated backup script (`pg_dump`) tested and verified.

## 2. API Gateway & Microservices Verification
- [ ] API Gateway running on port 8080 as the single ingress point.
- [ ] All 10 microservices expose a responsive `GET /health` endpoint.
- [ ] Gateway properly proxies route prefixes (`/api/v1/auth`, `/api/v1/users`, etc.) without path errors.
- [ ] Helmet security headers present on all responses.
- [ ] CORS policies enforce whitelisted origins without allowing wildcard in production.
- [ ] Rate limiting enforces thresholds and emits HTTP 429 upon excess traffic.

## 3. Security & Cryptography Verification
- [ ] Zero secrets present in frontend bundles (`.env` vs `.env.example`).
- [ ] No hardcoded passwords, passkeys, or API credentials anywhere in the repository.
- [ ] Passwords hashed with `bcrypt` (cost factor 12).
- [ ] JWT access tokens expire in 15 minutes; refresh tokens rotate on single use.
- [ ] Medical reports encrypted at rest using AES-256-GCM with verified auth tag checks.

## 4. User Frontend Functional Verification
- [ ] User registration, login, and token refresh workflows operate seamlessly.
- [ ] AI scan accepts photo and symptom inputs; returns accurate diagnostic response (or clean fallback).
- [ ] 7-day Ayurvedic diet plans generate and render cleanly in a responsive grid.
- [ ] Doctor directory displays verified practitioner cards with working booking modal.
- [ ] Marketplace catalog loads products, supports search/category filters, and handles Add to Cart.
- [ ] Checkout creates order, settles payment, and displays 5-step delivery tracker.
- [ ] Medical vault allows secure file download and preview.

## 5. Admin Frontend Functional Verification
- [ ] Admin login gate strictly enforces elevated role claims.
- [ ] Executive dashboard displays live platform metrics (active users, orders, health status).
- [ ] User governance enables searching, inspecting, and suspending user accounts.
- [ ] Suspending an account instantly invalidates the user's refresh token and active session.
- [ ] Audit logs viewer displays real-time system mutation events with expandable metadata.
- [ ] System broadcast dispatch successfully distributes notification to targeted user inboxes.
