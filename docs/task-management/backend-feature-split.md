# NutriVedha — Backend Feature Split for 3 Developers

## 1. Purpose

This document divides the **User module** and **Admin module** backend features into **3 independent ownership tracks** so that three backend developers can build in parallel and merge safely.

- Source of truth for feature lists:
  - [User Feature Inventory](../design-system/user-feature-inventory.md) — 16 features
  - [Admin Feature Inventory](../design-system/admin-feature-inventory.md) — 10 features
- Backend service specification: [Microservices Architecture](../architecture/microservices-architecture.md)
- API routes: [API Contracts](../api/api-contracts.md)

Each developer owns a set of **microservice folders**, so code ownership does not overlap. Merge conflicts are limited to the small set of shared files listed in [Section 6](#6-shared-files--merge-strategy).

---

## 2. Total Feature Count

| Module | Features | Backend Services Involved |
|---|---|---|
| User Module | **16** | Gateway, Auth, User, AI, Medical, Telemedicine, Fitness, Marketplace, Orders, Notification, Analytics |
| Admin Module | **10** | Auth, User, Analytics, Notification, Marketplace, Orders, Telemedicine, Gateway |
| **Total** | **26 features** | 10 microservices + API Gateway |

Distribution across the 3 developers:

| Developer | User Features | Admin Features | Total Features | Services Owned |
|---|---|---|---|---|
| **Dev A — Identity & Governance** | 6 | 3 | **9** | `auth`, `user`, `notification`, `gateway` |
| **Dev B — Health & Wellness** | 7 | 1 | **8** | `ai`, `medical`, `telemedicine`, `fitness` |
| **Dev C — Commerce & Analytics** | 3 | 6 | **9** | `marketplace`, `orders`, `analytics` |
| **Total** | **16** | **10** | **26** | — |

---

## 3. Feature Assignment Matrix

Legend: `U-xx` = User feature number, `A-xx` = Admin feature number (as in the inventory files).

| ID | Feature | Route | Owner | Backend Service |
|---|---|---|---|---|
| U-01 | Home / Landing | `/` | Dev A | Gateway (aggregation) |
| U-02 | Authentication & Register | `/login`, `/register` | Dev A | Auth |
| U-03 | Wellness Dashboard | `/dashboard` | Dev A | User + aggregation |
| U-04 | AI Disease & Symptom Scan | `/scan` | Dev B | AI |
| U-05 | Personalized Diet Planner | `/diet` | Dev B | AI |
| U-06 | Recipe Discovery | `/recipes` | Dev B | AI |
| U-07 | Encrypted Medical Vault | `/reports` | Dev B | Medical |
| U-08 | Doctor Discovery | `/telemedicine` | Dev B | Telemedicine |
| U-09 | Appointment Booking | `/telemedicine/book/:id` | Dev B | Telemedicine |
| U-10 | Yoga & Fitness Regimens | `/fitness` | Dev B | Fitness |
| U-11 | Organic Herb Marketplace | `/marketplace` | Dev C | Marketplace |
| U-12 | Cart & Checkout | `/cart`, `/checkout` | Dev C | Orders + Marketplace |
| U-13 | Order & Delivery Tracking | `/orders/:id/track` | Dev C | Orders |
| U-14 | User Profile & Addresses | `/profile` | Dev A | User |
| U-15 | Notifications Inbox | `/notifications` | Dev A | Notification |
| U-16 | Global Search | `/search` | Dev A | Gateway (aggregation) |
| A-01 | Admin Login Gate | `/admin/login` | Dev A | Auth |
| A-02 | Executive Dashboard | `/admin` | Dev C | Analytics |
| A-03 | User Governance | `/admin/users` | Dev A | User (+ Auth revocation) |
| A-04 | Global Audit Telemetry | `/admin/audit-logs` | Dev C | Analytics |
| A-05 | System Broadcast Center | `/admin/broadcasts` | Dev A | Notification |
| A-06 | Marketplace Product Control | `/admin/marketplace` | Dev C | Marketplace |
| A-07 | Order Oversight | `/admin/orders` | Dev C | Orders |
| A-08 | Infrastructure Health Monitor | `/admin/system-health` | Dev C | Analytics (consumes Gateway health) |
| A-09 | Doctor Verification Oversight | `/admin/doctors` | Dev B | Telemedicine |
| A-10 | Platform Settings | `/admin/settings` | Dev C | Analytics |

---

## 4. Developer Ownership Details

### Developer A — Identity & Governance (9 features)

Branch: `feature/backend-a-identity`

| Owned Service | Feature IDs | Key Endpoints | Owned Tables |
|---|---|---|---|
| **Auth** (`backend/services/auth`, `:3001`) | U-02, A-01 | `POST /register`, `POST /login`, `POST /admin/login`, `POST /refresh`, `POST /logout`, `GET /me`, `POST /forgot-password`, `POST /reset-password` | `users`, `admin_accounts`, `roles`, `permissions`, `role_permissions`, `refresh_tokens` |
| **User** (`backend/services/user`, `:3002`) | U-03, U-14, A-03 | `GET/PUT /profile`, addresses CRUD, `GET/PUT /preferences`, `POST /export-data`, `DELETE /account`, `POST /:id/status` | `user_profiles`, `user_addresses`, `user_preferences` |
| **Notification** (`backend/services/notification`, `:3010`) | U-15, A-05 | `GET /`, `GET /unread-count`, `PATCH /:id/read`, `PATCH /read-all`, `POST /broadcast` | `notifications` |
| **Gateway** (`backend/gateway`, `:8080`) | U-01, U-16 | Proxy routes, JWT gate, rate limiting, search aggregation | *stateless* |

**Also owns the foundation:** gateway bootstrap (TSK-GW-01/02/03) and shared DB schema coordination (TSK-DB-01/02/03).

---

### Developer B — Health & Wellness (8 features)

Branch: `feature/backend-b-health`

| Owned Service | Feature IDs | Key Endpoints | Owned Tables |
|---|---|---|---|
| **AI** (`backend/services/ai`, `:3003`) | U-04, U-05, U-06 | `POST /scan`, `POST /diet/generate`, `GET /diet/current`, `POST /recipes/recommend`, `GET/POST /recipes/saved`, `GET /history` | `ai_requests`, `diet_plans`, `saved_recipes` |
| **Medical** (`backend/services/medical`, `:3005`) | U-07 | `POST /reports/upload`, `GET /reports`, `GET /reports/:id`, `DELETE /reports/:id` | `medical_reports` |
| **Telemedicine** (`backend/services/telemedicine`, `:3006`) | U-08, U-09, A-09 | `GET /doctors`, `GET /doctors/:id`, `POST /appointments`, `GET /appointments/my`, `POST /appointments/:id/cancel` | `doctor_profiles`, `appointments` |
| **Fitness** (`backend/services/fitness`, `:3009`) | U-10 | `GET /workouts`, `POST /logs`, `GET /logs/my` | `fitness_logs` |

**Note:** The AI service must keep the deterministic Ayurvedic rule-based fallback (TSK-AI-02) so U-04/U-05 work even when Gemini is unavailable.

---

### Developer C — Commerce & Analytics (9 features)

Branch: `feature/backend-c-commerce`

| Owned Service | Feature IDs | Key Endpoints | Owned Tables |
|---|---|---|---|
| **Marketplace** (`backend/services/marketplace`, `:3007`) | U-11, A-06 | `GET /categories`, `GET /products`, `GET /products/:id`, wishlist CRUD, cart, admin stock/price/active toggle | `product_categories`, `products`, `wishlists`, `carts` |
| **Orders** (`backend/services/orders`, `:3008`) | U-12, U-13, A-07 | `POST /checkout`, `GET /my-orders`, `GET /:id`, `GET /:id/tracking`, `GET /admin/all` | `orders`, `order_items`, `payments`, `tracking_events` |
| **Analytics** (`backend/services/analytics`, `:3011`) | A-02, A-04, A-08, A-10 | `GET /overview`, `GET /audit-logs`, `GET /health-status`, settings maintenance/banners/toggles | `audit_logs`, `activity_events`, `system_settings` |

**Note:** U-12 checkout calls the internal stock validation endpoint of Marketplace (same owner), and A-08 reads health pings from the Gateway owned by Dev A.

---

## 5. Feature Count Verification

| Owner | User Features | Admin Features | Sum |
|---|---|---|---|
| Dev A | U-01, U-02, U-03, U-14, U-15, U-16 (6) | A-01, A-03, A-05 (3) | **9** |
| Dev B | U-04, U-05, U-06, U-07, U-08, U-09, U-10 (7) | A-09 (1) | **8** |
| Dev C | U-11, U-12, U-13 (3) | A-02, A-04, A-06, A-07, A-08, A-10 (6) | **9** |
| **Total** | **16** | **10** | **26** |

No feature is assigned twice and no feature is left unassigned.

---

## 6. Shared Files & Merge Strategy

### 6.1 Shared contracts to freeze before parallel work (Day 0)

1. `database/schema/initial_schema.sql` and `database/schema/schema.prisma` (TSK-DB-01/02/03).
2. Response envelope and error format — see [Backend Architecture](../architecture/backend-architecture.md).
3. JWT claims (`sub`, `role`, `jti`) and gateway-forwarded headers (`X-User-ID`, `X-User-Role`, `X-Request-ID`).
4. Environment variable names (`.env.example`).
5. Internal service-to-service endpoints (e.g. stock validation).

Once frozen, all three developers build against them.

### 6.2 Branching

| Branch | Owner | Base |
|---|---|---|
| `develop` | Integration | `main` |
| `feature/backend-a-identity` | Dev A | `develop` |
| `feature/backend-b-health` | Dev B | `develop` |
| `feature/backend-c-commerce` | Dev C | `develop` |

### 6.3 Merge order

1. **Phase 1 (foundation):** merge `feature/backend-a-identity` first — DB schema, gateway, auth. All other services depend on the gateway and token contract.
2. **Phase 2 (parallel):** merge `feature/backend-b-health` and `feature/backend-c-commerce`; they touch disjoint service folders, so order between them is flexible.
3. **Phase 3 (integration):** run cross-service smoke tests — login → scan → checkout → track → admin dashboard → broadcast.

### 6.4 Conflict avoidance rules

- Only touch service folders you own under `backend/services/<your-services>` plus your branch's tests.
- Never edit another developer's service. Request changes through an issue or PR comment.
- Shared file edits (`database/schema/*`, `.env.example`, `tsconfig.base.json`) require a small dedicated PR reviewed by all three.
- Each service must keep `GET /health` returning the standard health envelope.

---

## 7. Definition of Done (per feature)

A feature is complete when all of the following are true:

1. Endpoints implemented in the correct layer (`routes → controller → service → repository → validator`).
2. Zod validation on every request body, query and route param.
3. Correct HTTP status codes and the unified error envelope.
4. RBAC enforced (`user` vs `admin`) for protected routes.
5. Unit + integration tests pass for the service.
6. `GET /health` reports `UP` and `database: CONNECTED`.
7. API contract in [api-contracts.md](../api/api-contracts.md) matches the implementation.
8. Feature flipped to complete in [task-management.md](task-management.md).
