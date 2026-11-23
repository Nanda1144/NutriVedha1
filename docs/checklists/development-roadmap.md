# NutriVedha — Development Roadmap (Phase 1)

## Phase 1 Execution Timeline

```mermaid
gantt
    title NutriVedha Phase 1 Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation & Database
    Architecture Design & ADR Approval   :done,    des1, 2026-11-20, 2026-11-22
    Database DDL & Prisma Migration Setup :active,  db1,  2026-11-23, 2026-11-26
    Database Seed Baseline               :         db2,  2026-11-27, 2026-11-28
    section Backend Microservices Core
    Gateway & Auth Service (:3001)       :         bk1,  2026-11-29, 2026-12-04
    User Service (:3002) & Medical (:3005):        bk2,  2026-12-05, 2026-12-09
    AI Service (:3003) & Fitness (:3009) :         bk3,  2026-12-10, 2026-12-14
    Marketplace (:3007) & Orders (:3008) :         bk4,  2026-12-15, 2026-12-20
    Notification (:3010) & Analytics (:3011):      bk5,  2026-12-21, 2026-12-25
    section Frontend Applications
    User Frontend App Skeleton & Auth    :         fe1,  2026-12-26, 2027-01-02
    User Clinical Modules (Scan, Diet)   :         fe2,  2027-01-03, 2027-01-10
    User Commerce (Market, Checkout)     :         fe3,  2027-01-11, 2027-01-18
    Admin Frontend App & Governance      :         fe4,  2027-01-19, 2027-01-26
    section Integration & Hardening
    End-to-End System Testing & Hardening:         e2e,  2027-01-27, 2027-02-05
    Security Audit & Production Ready    :         sec,  2027-02-06, 2027-02-12
```

---

## Milestone Milestones
- **M1: Core Engine & Data Plane Ready** — PostgreSQL schema migrated, Auth and User services running behind Gateway with verified JWT generation.
- **M2: Clinical & AI Intelligence Operational** — Medical AES vault encrypted and AI scan service responding with live/fallback payloads.
- **M3: End-to-End Commerce Flow Verified** — Marketplace catalog browse -> Add to Cart -> Checkout -> Orders record created -> 5-step delivery tracker active.
- **M4: Admin Governance Active** — Admin can inspect live user audit logs, suspend accounts, and dispatch system-wide broadcasts.
- **M5: Phase 1 Production Sign-off** — 100% of integration test suites green, zero high-severity security findings.
