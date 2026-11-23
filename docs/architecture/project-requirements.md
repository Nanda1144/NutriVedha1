# NutriVedha — Project Requirements & Scope Specification

## 1. Scope Boundary (Phase 1 vs Future Scope)

### In-Scope (Phase 1 Implementation)
1. **User Frontend Application**:
   - Modern, responsive SPA for patients, wellness seekers, and organic consumers.
   - User authentication, registration, password recovery, profile and address management.
   - AI disease scan (image upload + symptom description) with risk assessment and recommendations.
   - 7-day budget-aware, dosha-aligned Ayurvedic meal planning & recipe discovery.
   - Fitness and yoga exploration, workout streak tracking, and daily adherence logs.
   - Doctor directory discovery, profile reviews, consultation booking, and history.
   - Organic marketplace catalogue browsing, search, category filtering, cart management, and checkout.
   - Order history and step-by-step delivery tracking.
   - Secure encrypted medical report uploads and vault access.
   - Notifications inbox and search discovery across the platform.

2. **Admin Frontend Application**:
   - Administrative portal with strict access verification (administrative credentials/MFA).
   - Global user and role governance (view, filter, suspend, activate).
   - Audit logs inspection and activity telemetry across all services.
   - System broadcast management (dispatch targeted or global user announcements).
   - Marketplace product catalog management (approvals, stock, pricing, category oversight).
   - Platform health, service status, and operational analytics.

3. **Backend Microservices (10 Services + 1 Gateway)**:
   - API Gateway (`gateway`)
   - Authentication Service (`auth`)
   - User Profile & Identity Service (`user`)
   - Artificial Intelligence & Clinical Assist Service (`ai`)
   - Medical Records & Encryption Vault Service (`medical`)
   - Telemedicine & Appointment Service (`telemedicine` - User discovery & booking)
   - Fitness & Yoga Regimen Service (`fitness`)
   - Marketplace & Herb Catalog Service (`marketplace`)
   - Notification & Dispatch Service (`notification`)
   - Analytics, Audit & Health Service (`analytics`)
   - Orders, Checkout & Tracking Service (`orders`)

4. **Centralized PostgreSQL Database**:
   - Single relational engine hosting isolated, well-indexed schemas and table ownership per microservice.

---

### Explicitly Out-of-Scope (Preserved for Future Phases)
The following four dedicated professional portals and specialized partner microservices are **NOT** to be built in Phase 1:
1. **Doctor Portal**: Practitioner dashboard, clinical notes editor, availability scheduling calendar, WebRTC room host.
2. **Trainer Portal**: Coach dashboard, trainee client roster, custom training plan publisher, compliance review.
3. **Farmer Portal**: Cultivator inventory manager, farm yield forecasting, bulk harvest batch registration, payout ledger.
4. **Delivery Partner Portal**: Driver courier dispatch app, live GPS telemetry broadcaster, physical proof-of-delivery capture.

*Note: Future integration boundaries, schema foreign keys, and event schemas are designed to cleanly plug these modules in without breaking Phase 1 services.*

---

## 2. Functional Requirements (User Module)

| Ref ID | Feature Category | Functional Description | Acceptance Criteria |
|---|---|---|---|
| **REQ-USR-01** | Identity & Auth | Email/Password & Phone OTP registration and authentication. | JWT issued upon valid credentials; refresh token stored securely; rate-limited. |
| **REQ-USR-02** | Profile Management | Edit profile, manage multiple delivery addresses, dosha preferences. | Updates persist to PostgreSQL; audit event generated; sanitized inputs. |
| **REQ-USR-03** | AI Symptom & Scan | Upload dermatological/symptom photos and description for Ayurvedic assessment. | Gemini AI analysis with fallback rule engine; records saved in `ai_requests`. |
| **REQ-USR-04** | Medical Vault | Upload lab and diagnostic reports with client-side or gateway authenticated encryption. | Report encrypted with AES-256-GCM; metadata stored in `medical_reports`. |
| **REQ-USR-05** | Diet & Nutrition | Generate 7-day budget and dosha-specific meals (Vata, Pitta, Kapha). | Returns structured daily breakdown (breakfast, lunch, dinner, herbs); printable. |
| **REQ-USR-06** | Recipe Discovery | Search recipes based on pantry items and dosha compatibility. | Filterable by dietary restrictions, preparation time, and season. |
| **REQ-USR-07** | Fitness & Yoga | View guided yoga asanas and workout regimens by fitness goal. | User can log completed sessions; adherence streaks calculated accurately. |
| **REQ-USR-08** | Doctor Discovery | Search verified Ayurvedic doctors, filter by specialization and fee. | Doctor listing loaded via Telemedicine service; slot booking records created. |
| **REQ-USR-09** | Marketplace | Browse organic herbs and crops with pricing, stock status, and seasonal badges. | Full-text search and category filtering; real-time stock availability check. |
| **REQ-USR-10** | Cart & Checkout | Add products to cart, apply delivery address, select payment method. | Transactional checkout; inventory reservations handled atomically. |
| **REQ-USR-11** | Order Tracking | View real-time status of orders (Placed -> Confirmed -> Dispatched -> Delivered). | 5-step milestone tracking display with estimated delivery timestamps. |
| **REQ-USR-12** | Notifications | Real-time and persistent notification inbox for orders, appointments, and alerts. | Mark as read, mark all read, delete; badge count syncs across tabs. |

---

## 3. Functional Requirements (Admin Module)

| Ref ID | Feature Category | Functional Description | Acceptance Criteria |
|---|---|---|---|
| **REQ-ADM-01** | Admin Authentication | Isolated administrative login with elevated credentials and optional passkey. | Dedicated admin claims in JWT; standard user accounts denied access. |
| **REQ-ADM-02** | User Governance | Search, filter, view details, activate, or suspend platform accounts. | Account suspension revokes active JWT sessions immediately; audit logged. |
| **REQ-ADM-03** | Audit Telemetry | Centralized query interface for all system events, logins, scans, and mutations. | Paginated, filterable by service, user, date range, and severity level. |
| **REQ-ADM-04** | Broadcast Messaging | Compose and dispatch broadcast notifications to all or filtered user cohorts. | Batched notification insertion into `notifications` table; instant delivery. |
| **REQ-ADM-05** | Marketplace Oversight | View product listings, modify availability, adjust pricing, toggle visibility. | Mutations reflect instantly in the User marketplace. |
| **REQ-ADM-06** | System Health Monitor | View response times, service availability, error rates, and resource utilization. | Gateway aggregates `/health` pings across all microservices. |

---

## 4. Non-Functional Requirements
- **Performance**: 95% of API requests completed within < 200ms; Gateway overhead < 15ms.
- **Reliability & Availability**: Microservices designed to fail independently without bringing down the gateway or peer services.
- **Security & Compliance**: OWASP Top 10 mitigations, strict input validation using Zod, bcrypt cost factor 12, AES-256-GCM authenticated encryption for health data.
- **Scalability**: Stateless microservices capable of horizontal scaling inside Docker containers behind an ALB.
- **Maintainability**: Unified TypeScript codebase sharing strict type contracts via packages.
