# NutriVedha — Documentation Purpose & AI Agent Guide

## 1. Purpose of the `docs/` Folder

The `docs/` folder is the **single source of truth** for how NutriVedha is designed, built, secured, tested and owned. It exists to:

1. **Describe the system before code is written** — architecture, services, database, API contracts and workflows are specified first, so implementation follows an agreed design instead of guesswork.
2. **Remove ambiguity** — every feature has an owner, a route, an upstream service and acceptance criteria.
3. **Enable parallel work** — developers (and AI agents) can work on separate services without stepping on each other because boundaries are written down.
4. **Preserve decisions** — conventions (layering, response envelope, error codes, security rules) stay consistent as the team grows.
5. **Make onboarding fast** — anyone can understand the project by reading the index, then the relevant document.

The entry point is [`docs/README.md`](README.md), which lists every document by topic.

---

## 2. Documentation Map

| Area | Document | What it answers |
|---|---|---|
| Index | [`README.md`](README.md) | Where is everything? |
| Architecture | [`architecture/project-requirements.md`](architecture/project-requirements.md) | What is in scope for Phase 1? |
| Architecture | [`architecture/microservices-architecture.md`](architecture/microservices-architecture.md) | Which service owns what, on which port? |
| Architecture | [`architecture/backend-architecture.md`](architecture/backend-architecture.md) | How are services layered? How are errors returned? |
| Architecture | [`architecture/frontend-architecture.md`](architecture/frontend-architecture.md) | How are the React SPAs structured? |
| Database | [`database/database-architecture.md`](database/database-architecture.md), [`database/database-er-diagram.md`](database/database-er-diagram.md) | Which tables exist and who owns them? |
| API | [`api/api-contracts.md`](api/api-contracts.md) | What endpoints exist and their access rules? |
| Workflows | [`workflows/`](workflows/) | How do user, admin and auth journeys flow? |
| Security | [`security/security-guidelines.md`](security/security-guidelines.md) | What security rules must never be broken? |
| UI | [`design-system/`](design-system/) | What components and screens exist? |
| Features | [`design-system/user-feature-inventory.md`](design-system/user-feature-inventory.md), [`design-system/admin-feature-inventory.md`](design-system/admin-feature-inventory.md) | What are the 16 user + 10 admin features? |
| Tasks | [`task-management/task-management.md`](task-management/task-management.md) | What task IDs, priorities and acceptance criteria exist? |
| Tasks | [`task-management/backend-feature-split.md`](task-management/backend-feature-split.md) | Which of the 3 developers owns which feature? |
| Testing | [`testing/testing-strategy.md`](testing/testing-strategy.md) | How is the code tested? |
| Roadmap | [`checklists/development-roadmap.md`](checklists/development-roadmap.md), [`checklists/phase-completion-checklist.md`](checklists/phase-completion-checklist.md) | What is the delivery plan and Definition of Done? |

---

## 3. How This Helps an AI Agent Do Tasks

An AI coding agent starts with limited context. These documents remove the need to guess and prevent drift. Concretely:

1. **Discover before acting.** The agent reads `docs/README.md`, then the one or two relevant documents (e.g. API contracts + microservice architecture) instead of blindly scanning the whole codebase. This saves context and prevents hallucinated APIs.
2. **Plan the work.** The feature inventories and `backend-feature-split.md` give a ready-made plan: which feature, which service, which route, which owner, which tables. The agent can turn this directly into a step list.
3. **Build in the right place.** The standardized directory layout and service ownership map tell the agent exactly which folder to create or edit, and which folders are off-limits. This prevents cross-service coupling.
4. **Match existing conventions.** The backend architecture document defines the layering, response envelope and error format. The agent copies those patterns instead of inventing new ones.
5. **Validate against acceptance criteria.** Task IDs in `task-management.md` and the Definition of Done in `backend-feature-split.md` give the agent concrete checks to verify its work (Zod validation, status codes, RBAC, health endpoint, tests).
6. **Stay safe.** The security guidelines tell the agent what it must never do (plaintext health data, client-side role checks, tokens in local storage, cross-service DB access).
7. **Keep documentation in sync.** When behavior changes, the agent updates the matching document so the next run starts from accurate information.

---

## 4. How an AI Agent Should Use These Docs

Recommended working loop:

1. **Read** `docs/README.md` and the relevant documents for the task.
2. **Locate** the feature in the inventories and in `task-management/backend-feature-split.md` to learn its owner, service, route and tables.
3. **Plan** with a short task list mapped to the service's layers (`routes → controller → service → repository → validator → types`).
4. **Implement** inside the assigned service folder only.
5. **Verify** against the acceptance criteria, the API contract, the unified error envelope and the `GET /health` standard.
6. **Test** with the service's unit and integration tests.
7. **Update** the docs (feature status, contract changes) in the same change set.

### Precedence when documents conflict

1. `security/security-guidelines.md` (safety first)
2. `api/api-contracts.md` (external contract)
3. `architecture/microservices-architecture.md` (ownership/boundaries)
4. `task-management/backend-feature-split.md` (ownership assignment)
5. `task-management/task-management.md` (task detail)
6. Any other document

If a conflict cannot be resolved from the hierarchy above, stop and ask the human owner rather than inventing a new contract.

---

## 5. Guardrails for AI Agents

- Do not introduce dependencies that are not already used in the repository unless explicitly approved.
- Do not query or mutate another service's tables; use that service's API.
- Do not place secrets in code, logs or documentation; use `.env`.
- Do not change the frozen shared contracts (DB schema, response envelope, JWT claims, forwarded headers) without a dedicated review.
- Do not mark a feature complete until its acceptance criteria and Definition of Done are actually met.

---

## 6. Keeping Docs Useful

- Every new feature must add a row to the relevant feature inventory.
- Every new/changed endpoint must update `api/api-contracts.md`.
- Every ownership or scope change must update `task-management/backend-feature-split.md`.
- Stale docs are worse than no docs: update in the same PR as the code.
