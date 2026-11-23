# NutriVedha — Complete Root Folder Structure

```text
NutriVedha/
├── frontend/
│   ├── user/                               # Dedicated User SPA (Vite + React 19)
│   │   ├── public/                         # Public static assets, icons, manifest
│   │   ├── src/
│   │   │   ├── app/                        # App root providers, error boundaries
│   │   │   ├── assets/                     # Images, illustrations, branding
│   │   │   ├── components/                 # Atomic UI components (Buttons, Modals, Cards)
│   │   │   ├── features/                   # Feature slices (scan, diet, cart, orders)
│   │   │   ├── hooks/                      # Custom React hooks (useAuth, useCart)
│   │   │   ├── layouts/                    # AppLayout, Navbar, Footer, UserSidebar
│   │   │   ├── pages/                      # Page components (Home, Scan, Diet, Marketplace)
│   │   │   ├── routes/                     # React Router configurations & PrivateRoute
│   │   │   ├── services/                   # Gateway HTTP clients (apiClient, authService)
│   │   │   ├── store/                      # Zustand state slices (userStore, cartStore)
│   │   │   ├── types/                      # Frontend TypeScript definitions
│   │   │   ├── utils/                      # Formatting, date helpers, dosha calculators
│   │   │   └── styles/                     # Tailwind globals, animations, theme tokens
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.ts
│   │
│   └── admin/                              # Dedicated Admin SPA (Vite + React 19)
│       ├── public/                         # Admin static assets
│       ├── src/
│       │   ├── app/                        # Admin app bootstrap
│       │   ├── assets/                     # Admin illustrations
│       │   ├── components/                 # Admin data tables, metrics cards, charts
│       │   ├── features/                   # Admin features (users, audits, broadcasts)
│       │   ├── hooks/                      # Admin hooks (useAdminAuth, useMetrics)
│       │   ├── layouts/                    # AdminLayout, AdminHeader, AdminSidebar
│       │   ├── pages/                      # Dashboard, UserManagement, AuditLogs, System
│       │   ├── routes/                     # Admin router & AdminAuthGuard
│       │   ├── services/                   # Admin API client services
│       │   ├── store/                      # Zustand admin state (adminStore)
│       │   ├── types/                      # Admin TypeScript definitions
│       │   ├── utils/                      # Analytics parsers, audit formatters
│       │   └── styles/                     # Admin dashboard styling
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── tailwind.config.ts
│
├── backend/
│   ├── gateway/                            # Central API Gateway (:8080)
│   │   ├── src/
│   │   │   ├── index.ts                    # Gateway bootstrap
│   │   │   ├── proxy.ts                    # Reverse proxy routing rules
│   │   │   ├── middleware/                 # Rate limiting, correlation ID, JWT gate
│   │   │   └── config.ts                   # Gateway configuration & routes map
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                             # Shared backend library
│   │   ├── src/
│   │   │   ├── db/                         # PostgreSQL client pool & transaction runner
│   │   │   ├── errors/                     # Centralized AppError, NotFoundError, AuthError
│   │   │   ├── middleware/                 # Global error handler, request logger
│   │   │   ├── security/                   # AES-256-GCM cipher, bcrypt helpers, JWT sign
│   │   │   └── utils/                      # Response wrapper (sendSuccess, sendError)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── packages/                           # Internal monorepo packages
│   │   ├── shared-types/                   # Common domain TypeScript interfaces
│   │   │   ├── src/
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── order.types.ts
│   │   │   │   ├── medical.types.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   ├── shared-validation/              # Common Zod validation schemas
│   │   │   ├── src/
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── user.schema.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   └── shared-config/                  # Common environment and logging configs
│   │       ├── src/
│   │       └── package.json
│   │
│   ├── services/                           # 10 Independent Microservices
│   │   ├── auth/                           # Port 3001
│   │   ├── user/                           # Port 3002
│   │   ├── ai/                             # Port 3003
│   │   ├── medical/                        # Port 3005
│   │   ├── telemedicine/                   # Port 3006
│   │   ├── fitness/                        # Port 3009
│   │   ├── marketplace/                    # Port 3007
│   │   ├── notification/                   # Port 3010
│   │   ├── analytics/                      # Port 3011
│   │   └── orders/                         # Port 3008
│   │
│   ├── tests/                              # Global end-to-end integration tests
│   ├── docker-compose.yml                  # Local development stack composition
│   ├── package.json                        # Backend workspaces root
│   └── tsconfig.base.json                  # Base TypeScript settings
│
├── database/
│   ├── schema/                             # Consolidated SQL schema & Prisma schema
│   │   ├── 01_auth_schema.sql
│   │   ├── 02_user_schema.sql
│   │   ├── 03_health_ai_schema.sql
│   │   ├── 04_commerce_schema.sql
│   │   └── schema.prisma
│   ├── migrations/                         # Timestamped sequential SQL migrations
│   ├── seed/                               # Database initial seeds (doctors, products)
│   ├── diagrams/                           # ER diagram assets & source files
│   ├── documentation/                      # Schema data dictionaries
│   └── README.md
│
├── docs/                                   # Complete Engineering Documentation
│   ├── architecture/
│   ├── workflows/
│   ├── design-system/
│   ├── database/
│   ├── api/
│   ├── security/
│   ├── testing/
│   ├── deployment/
│   ├── checklists/
│   ├── task-management/
│   └── README.md
│
├── scripts/                                # Maintenance & build utility scripts
├── .env.example                            # Committed environment variables template
├── .gitignore                              # Git exclusion rules
├── package.json                            # Root orchestration scripts
└── README.md                               # Primary project README
```
