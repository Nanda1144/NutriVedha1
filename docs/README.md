# NutriVedha — Technical Documentation Index

Welcome to the comprehensive technical documentation for **NutriVedha**.

---

## 1. Documentation Index

### Architecture
- [Project Overview](architecture/project-overview.md) — Strategic motives, executive summary, high-level architecture.
- [Project Requirements & Scope](architecture/project-requirements.md) — Scope boundary (Phase 1 vs Future Modules) and functional specifications.
- [Architecture Overview](architecture/architecture-overview.md) — Architectural styles, ADRs, and communication patterns.
- [Microservices Architecture](architecture/microservices-architecture.md) — 10 microservices specifications, responsibilities, and standardized directory layout.
- [Root Folder Structure](architecture/root-folder-structure.md) — Complete monorepo file tree breakdown.
- [Frontend Architecture](architecture/frontend-architecture.md) — React 19 SPAs, Zustand state management, and route protection.
- [Backend Architecture](architecture/backend-architecture.md) — Layered service patterns, controller-service-repository hierarchy, error handling.
- [Future Module Integration](architecture/future-module-integration.md) — Preserved boundaries for Doctor, Trainer, Farmer, and Delivery portals.

### Database
- [Database Architecture](database/database-architecture.md) — Engine specs, table ownership, indexing strategy, and backup routines.
- [Database ER Diagram](database/database-er-diagram.md) — Complete visual and entity-relationship schema.

### Workflows
- [User Workflow](workflows/user-workflow.md) — End-to-end patient & consumer user journeys.
- [Admin Workflow](workflows/admin-workflow.md) — Administrative governance, user suspension, and broadcast workflows.
- [Authentication Workflow](workflows/authentication-workflow.md) — JWT issuance, refresh token rotation, and RBAC matrix.
- [Data Synchronization](workflows/data-synchronization.md) — Cross-service synchronization and transaction paths.

### API & Contracts
- [API Contracts](api/api-contracts.md) — Complete route inventory, request/response envelopes across all 10 services.

### Security & Deployment
- [Security Guidelines](security/security-guidelines.md) — Zero-trust rules, AES-256-GCM encryption, and OWASP compliance.
- [CORS & Deployment](deployment/cors-and-deployment.md) — Separate domain topology, CORS whitelisting, and Docker ECS topology.

### UI/UX Design System
- [UI/UX Design System](design-system/ui-ux-design-system.md) — Ayurvedic palette tokens, typography, and glassmorphic card patterns.
- [Component Inventory](design-system/component-inventory.md) — Reusable atomic and feature-specific component library.
- [User Feature Inventory](design-system/user-feature-inventory.md) — Exhaustive checklist of User module functionalities.
- [Admin Feature Inventory](design-system/admin-feature-inventory.md) — Exhaustive checklist of Admin governance functionalities.

### Testing & Roadmaps
- [Testing Strategy](testing/testing-strategy.md) — Unit, integration, and E2E testing pyramid.
- [Development Roadmap](checklists/development-roadmap.md) — Phase 1 Gantt chart and milestone deliverables.
- [Task Management](task-management/task-management.md) — Work breakdown structure (WBS) with task IDs, priorities, and acceptance criteria.
- [Phase Completion Checklist](checklists/phase-completion-checklist.md) — Definition of Done (DoD) verification criteria.
