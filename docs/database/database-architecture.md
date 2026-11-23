# NutriVedha — Database Architecture Specification

## 1. Engine & Strategy
- **Engine**: PostgreSQL 16 (Relational OLTP).
- **Identifier Strategy**: `UUIDv4` generated via PostgreSQL `gen_random_uuid()` for all primary keys to guarantee collision resistance across distributed environments.
- **Data Access Approach**: Consistent PostgreSQL data-access layer using **Prisma ORM** as the primary schema definition & type generator, backed by clean raw SQL migration scripts (`database/migrations/*.sql`) for production version control.
- **Character Encoding & Timezone**: `UTF-8` character encoding, `UTC` timestamps stored as `TIMESTAMPTZ`.

---

## 2. Table Ownership Matrix

Every table is owned by exactly **one** backend microservice. Cross-service writes are prohibited.

| Microservice | Owned Tables | Description |
|---|---|---|
| **Auth Service** | `roles`, `permissions`, `role_permissions`, `users`, `admin_accounts`, `refresh_tokens` | Identity, authentication credentials, permissions, session tokens |
| **User Service** | `user_profiles`, `user_addresses`, `user_preferences` | User profiles, physical delivery addresses, dosha and notification preferences |
| **AI Service** | `ai_requests`, `diet_plans`, `saved_recipes` | AI consultation history, generated 7-day diet plans, bookmarked recipes |
| **Medical Service** | `medical_reports` | AES-256-GCM encrypted medical records and diagnostic files |
| **Telemedicine Service** | `doctor_profiles`, `appointments` | Verified practitioner profiles, appointment slots and consultation states |
| **Marketplace Service** | `product_categories`, `products`, `wishlists`, `carts` | Catalog items, inventory levels, pricing, user wishlists and active shopping carts |
| **Orders Service** | `orders`, `order_items`, `payments`, `tracking_events` | Orders, transactional item rows, payment intents/receipts, milestone delivery logs |
| **Fitness Service** | `fitness_logs` | Workout completion logs, daily active minutes, streak records |
| **Notification Service** | `notifications` | Direct and broadcast messages, unread status flags |
| **Analytics Service** | `audit_logs`, `activity_events`, `system_settings` | System-wide audit trails, administrative telemetry, dynamic platform configurations |

---

## 3. Indexing Strategy
1. **Primary & Unique Key B-Trees**: Automatically created on all `id` columns and unique constraints (`email`, `phone`, `order_number`, `token_hash`).
2. **Foreign Key Indexes**: Explicit B-tree indexes placed on every foreign key column (e.g., `user_id`, `order_id`, `product_id`) to optimize join queries and cascading referential checks.
3. **Composite Filtering Indexes**:
   - `appointments(doctor_id, appointment_date, status)` for rapid slot availability checks.
   - `orders(user_id, status, created_at DESC)` for high-performance order history pagination.
   - `audit_logs(service_name, action, created_at DESC)` for admin telemetry queries.
4. **Full-Text Search (GIN)**:
   - GIN index on `products(title, tags)` using PostgreSQL `to_tsvector` for fast catalog searches.

---

## 4. Transaction Management & Concurrency
- **ACID Transactions**: Workflows that touch multiple related records within a service (e.g., placing an order, decrementing stock, creating payment record, appending tracking milestone) execute inside a PostgreSQL `SERIALIZABLE` or `READ COMMITTED` transaction block using `prisma.$transaction` or explicit `BEGIN ... COMMIT`.
- **Optimistic Locking**: Inventory updates utilize version checks (`WHERE stock >= requested_quantity`) to prevent race conditions during high-concurrency checkouts.

---

## 5. Backup, Restore & Maintenance Plan
- **Daily Automated Backups**: `pg_dump` compressed snapshots stored in encrypted off-site cloud storage with 30-day retention.
- **Point-in-Time Recovery (PITR)**: Write-Ahead Logging (WAL) archiving enabled for continuous backup, allowing recovery to any specific second.
- **Routine Maintenance**: Automated weekly `VACUUM ANALYZE` on high-churn tables (`notifications`, `tracking_events`, `audit_logs`).
