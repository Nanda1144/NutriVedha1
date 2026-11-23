# NutriVedha — Microservices Architecture Specification

## 1. Microservice Responsibilities & Port Allocations

| # | Service Name | Directory Path | Port | Core Responsibilities | Owned Database Tables |
|---|---|---|---|---|---|
| **0** | **API Gateway** | `backend/gateway` | `8080` | Reverse proxying, rate limiting, request ID injection, authentication gate, CORS headers | *None (Stateless)* |
| **1** | **Auth Service** | `backend/services/auth` | `3001` | User registration, login, JWT issuance, refresh token rotation, logout, password reset | `users`, `admin_accounts`, `roles`, `permissions`, `role_permissions`, `refresh_tokens` |
| **2** | **User Service** | `backend/services/user` | `3002` | User profile data, addresses, dietary preferences, privacy settings, account export & deletion | `user_profiles`, `user_addresses`, `user_preferences` |
| **3** | **AI Service** | `backend/services/ai` | `3003` | Gemini AI integration, symptom analysis, image diagnosis, diet generation, recipe generation | `ai_requests`, `diet_plans`, `saved_recipes` |
| **4** | **Medical Service** | `backend/services/medical` | `3005` | AES-256-GCM encrypted health reports, file references, medical record retrieval | `medical_reports` |
| **5** | **Telemedicine Service**| `backend/services/telemedicine`| `3006` | Doctor directory, doctor profiles, consultation booking requests, appointment history | `doctor_profiles`, `appointments` |
| **6** | **Marketplace Service** | `backend/services/marketplace` | `3007` | Organic herb & crop catalog, categories, pricing, stock levels, search, wishlist | `products`, `product_categories`, `wishlists`, `carts` |
| **7** | **Orders Service** | `backend/services/orders` | `3008` | Checkout processing, order placement, order items, payment status, delivery tracking events | `orders`, `order_items`, `payments`, `tracking_events` |
| **8** | **Fitness Service** | `backend/services/fitness` | `3009` | Yoga asanas, workout routines, exercise goals, workout logs, adherence streaks | `fitness_logs` |
| **9** | **Notification Service**| `backend/services/notification`| `3010` | User notifications, read/unread states, admin broadcasts, notification preferences | `notifications` |
| **10**| **Analytics Service** | `backend/services/analytics` | `3011` | Admin telemetry, registration stats, audit trails, activity events, system health metrics | `audit_logs`, `activity_events`, `system_settings` |

---

## 2. Standardized Microservice Directory Layout

Every service under `backend/services/<name>` strictly conforms to the following clean architecture structure:

```
backend/services/<service-name>/
├── src/
│   ├── index.ts                # Service bootstrap & Express listen
│   ├── app.ts                  # Express application setup, middleware mounting
│   ├── routes/                 # Express router definitions
│   │   └── <entity>.routes.ts
│   ├── controllers/            # HTTP request/response handlers
│   │   └── <entity>.controller.ts
│   ├── services/               # Pure business logic implementation
│   │   └── <entity>.service.ts
│   ├── repositories/           # PostgreSQL data-access layer / queries
│   │   └── <entity>.repository.ts
│   ├── validators/             # Zod input schemas for validation
│   │   └── <entity>.validator.ts
│   ├── middleware/             # Service-specific middlewares (auth, permissions)
│   │   └── auth.middleware.ts
│   └── types/                  # Internal service domain types
│       └── index.ts
├── tests/                      # Jest/Vitest unit and integration tests
│   ├── unit/
│   └── integration/
├── Dockerfile                  # Production container definition
├── package.json                # Service-specific dependencies & scripts
└── tsconfig.json               # TypeScript configuration extending tsconfig.base.json
```

---

## 3. Service Health Check Standard
Every microservice must expose a standard non-authenticated `GET /health` endpoint returning:
```json
{
  "service": "orders",
  "status": "UP",
  "timestamp": "2026-11-22T15:30:00.000Z",
  "database": "CONNECTED",
  "uptimeSeconds": 1420
}
```
The API Gateway consumes these endpoints to generate unified platform health metrics.
