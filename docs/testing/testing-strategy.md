# NutriVedha — Comprehensive Testing Strategy

## 1. Multi-Tier Testing Pyramid

NutriVedha adopts a disciplined testing pyramid covering unit, integration, and end-to-end (E2E) testing across all microservices and frontends.

```text
       /\
      /  \      E2E Tests (Playwright / Cypress)
     /----\     - Full user journey (Registration -> Scan -> Cart -> Checkout)
    /      \    - Admin governance (Login -> Suspend User -> Verify Lockout)
   /--------\   Integration Tests (Supertest + Testcontainers PostgreSQL)
  /          \  - Gateway proxy verification, JWT verification, DB transactions
 /------------\ Unit Tests (Jest / Vitest)
---------------- - Business calculations, Zod validators, AES cipher, bcrypt
```

---

## 2. Service-Level Unit & Integration Testing
Every service under `backend/services/<name>` includes a dedicated `tests/` directory:
- **Validators**: Test Zod schemas with valid payloads and edge-case invalid inputs.
- **Services (Business Logic)**: Test pure algorithms (e.g., diet macro calculation, coupon discounts, order totals).
- **Repositories & Database Transactions**: Test rollback mechanisms when a step inside a multi-table transaction fails.
- **Mocking Upstream Dependencies**: AI Gemini calls are mocked with deterministic fixtures during automated CI tests.

---

## 3. API Gateway Contract Testing
- Automated test suites verify that every route prefix properly targets the designated microservice port.
- Rate limiting thresholds are tested under rapid concurrent request bursts to verify `429 Too Many Requests` responses.
- CORS pre-flight `OPTIONS` requests are verified against allowed vs. disallowed origins.

---

## 4. Frontend Component & E2E Testing
- **Component Tests**: Tested using Vitest and React Testing Library for isolated UI logic (e.g., Cart quantity adjustments, form validation error rendering).
- **Critical Path E2E Scenarios**:
  1. *User Auth & Scan*: Register -> Upload symptom -> View AI analysis -> Verify report saved.
  2. *Marketplace Purchase*: Add herb to cart -> Proceed to checkout -> Confirm order -> Verify step 1 in delivery tracker.
  3. *Admin Moderation*: Log in as admin -> Suspend test user -> Verify test user receives 401 on next request.
