# NutriVedha — Database Specification & Operations Manual

## 1. Overview
This directory contains the database blueprints, migration files, seed assets, and schema documentation for NutriVedha.

NutriVedha uses a **single PostgreSQL 16 server** where each microservice owns specific tables.

---

## 2. Directory Layout
- `schema/`: Declarative SQL schemas and the master Prisma schema.
  - `schema.prisma`: Unified typed schema for Prisma client generation.
  - `initial_schema.sql`: Raw DDL script initializing all Phase 1 tables, UUID extensions, and indexes.
- `migrations/`: Timestamped, forward-only SQL migration files.
- `seed/`: Initial baseline data (default roles, permissions, administrative seed, verified doctors, herb products).
- `diagrams/`: Visual ER diagram definitions.
- `documentation/`: Data dictionaries and column-level descriptions.

---

## 3. Quickstart & Migrations

### Local Provisioning with Docker
```bash
# Start PostgreSQL 16 container
docker compose up -d postgres

# Verify PostgreSQL is accepting connections
docker compose exec postgres pg_isready -U postgres
```

### Applying Migrations
```bash
# Option A: Using Prisma
cd backend
npx prisma migrate dev --name init

# Option B: Direct psql execution
psql -h localhost -p 5432 -U postgres -d nutrivedha -f database/schema/initial_schema.sql
```

### Seeding Baseline Data
```bash
cd backend
npm run db:seed
```
