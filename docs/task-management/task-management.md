# NutriVedha — Task Management & Work Breakdown Structure (WBS)

## 1. Task Breakdown Structure

Every task includes: **Task ID**, **Description**, **Priority**, **Dependencies**, **Acceptance Criteria**, and **Status**.

### Database Tasks (DB)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-DB-01** | Create PostgreSQL 16 DDL & Prisma Schema | P0 | None | All Phase 1 tables, foreign keys, indexes created cleanly | In Progress |
| **TSK-DB-02** | Implement Baseline Database Seed Scripts | P1 | TSK-DB-01 | Default roles, permissions, admin account, verified doctors, products seeded | Pending |
| **TSK-DB-03** | Configure PostgreSQL Docker Compose Stack | P0 | None | Docker Compose spins up PostgreSQL with health checks | Pending |

### Gateway Tasks (GW)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-GW-01** | Bootstrap Express API Gateway on Port 8080 | P0 | None | Gateway starts, handles reverse proxying to all 10 microservices | Pending |
| **TSK-GW-02** | Configure Gateway Rate Limiting & Helmet | P0 | TSK-GW-01 | 100 req/15min default rate limit; security headers verified | Pending |
| **TSK-GW-03** | Implement Gateway JWT Gate & Correlation ID | P0 | TSK-GW-01 | Rejects invalid tokens; injects X-Request-ID and X-User-ID headers | Pending |

### Authentication Service Tasks (AUTH)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-AUTH-01**| Bootstrap Auth Microservice (:3001) | P0 | TSK-DB-01 | Standard layered layout, TypeScript compilation, /health endpoint | Pending |
| **TSK-AUTH-02**| Implement User & Admin Registration & Login | P0 | TSK-AUTH-01 | bcrypt password hashing; returns short-lived JWT + refresh token | Pending |
| **TSK-AUTH-03**| Implement Refresh Token Rotation & Revocation | P0 | TSK-AUTH-02 | Single-use refresh token exchange; session revocation endpoint | Pending |

### User Service Tasks (USR)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-USR-01** | Bootstrap User Microservice (:3002) | P0 | TSK-DB-01 | Layered architecture, DB connection pool, /health endpoint | Pending |
| **TSK-USR-02** | Implement User Profile & Address CRUD | P1 | TSK-USR-01 | Users can read/update personal details, manage multiple addresses | Pending |
| **TSK-USR-03** | Implement Admin User Status Moderation | P0 | TSK-USR-01 | Admin endpoint to suspend/activate account with session invalidation | Pending |

### AI Service Tasks (AI)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-AI-01**  | Bootstrap AI Microservice (:3003) | P0 | TSK-DB-01 | Service scaffold, Zod validation, /health endpoint | Pending |
| **TSK-AI-02**  | Integrate Gemini API with Rule-Based Fallback | P0 | TSK-AI-01 | Symptom scan returns structured dosha imbalance; fallback works offline | Pending |
| **TSK-AI-03**  | Implement 7-Day Diet & Recipe Recommender | P1 | TSK-AI-01 | Budget-aware Ayurvedic meal generation and bookmarking | Pending |

### Medical Service Tasks (MED)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-MED-01** | Bootstrap Medical Microservice (:3005) | P0 | TSK-DB-01 | Scaffold, AES-256-GCM cipher utility, /health endpoint | Pending |
| **TSK-MED-02** | Implement Encrypted Report Upload & Retrieval | P0 | TSK-MED-01 | Uploaded data encrypted with AES-256-GCM; verified decryption | Pending |

### Orders Service Tasks (ORD)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-ORD-01** | Bootstrap Orders Microservice (:3008) | P0 | TSK-DB-01 | Scaffold, layered database transactions, /health endpoint | Pending |
| **TSK-ORD-02** | Implement Transactional Cart Checkout | P0 | TSK-ORD-01 | Creates order, order_items, payment, tracking_events atomically | Pending |
| **TSK-ORD-03** | Implement 5-Step Delivery Tracking Retrieval | P1 | TSK-ORD-02 | Returns sequential milestone logs with timestamps | Pending |

### Marketplace Service Tasks (MKT)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-MKT-01** | Bootstrap Marketplace Microservice (:3007) | P0 | TSK-DB-01 | Scaffold, catalog queries, /health endpoint | Pending |
| **TSK-MKT-02** | Implement Product Search, Filter & Stock Checks | P1 | TSK-MKT-01 | Paginated product browsing with category and dosha filtering | Pending |

### Notification & Analytics Tasks (NOTIF & ANALYTICS)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-NOT-01** | Bootstrap Notification Service (:3010) | P1 | TSK-DB-01 | Scaffold, notifications CRUD, broadcast dispatcher | Pending |
| **TSK-ANL-01** | Bootstrap Analytics & Audit Service (:3011) | P0 | TSK-DB-01 | Audit log ingestion, aggregate platform health overview | Pending |

### Frontend Tasks (FE-USR & FE-ADM)
| Task ID | Description | Priority | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|
| **TSK-FEU-01** | Initialize User Frontend (React 19 + Vite) | P0 | None | Tailwind configured, React Router setup, Axios client wired | Pending |
| **TSK-FEU-02** | Implement User Auth & Protected Routes | P0 | TSK-FEU-01 | Login/Register UI, Zustand auth store, PrivateRoute guard | Pending |
| **TSK-FEU-03** | Implement AI Disease Scan & Vault UI | P0 | TSK-FEU-02 | File uploader, analysis display, encrypted report vault | Pending |
| **TSK-FEU-04** | Implement Marketplace, Cart & Checkout UI | P0 | TSK-FEU-02 | Catalog browsing, cart drawer, checkout form, order tracking | Pending |
| **TSK-FEA-01** | Initialize Admin Frontend (React 19 + Vite) | P0 | None | Tailwind configured, Admin layout, metrics dashboard | Pending |
| **TSK-FEA-02** | Implement Admin User Management & Audit UI | P0 | TSK-FEA-01 | Filterable user table, suspend button, audit log viewer | Pending |
| **TSK-FEA-03** | Implement Broadcast Dispatcher UI | P1 | TSK-FEA-01 | Compose and send system notifications to all users | Pending |
