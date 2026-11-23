# NutriVedha — Data Synchronization Workflows

## 1. Overview & Strategy
In a microservices architecture sharing a centralized PostgreSQL database, data synchronization must be reliable, auditable, and clearly demarcated by service boundaries.

The core workflows below illustrate exact data paths between Frontend clients, Gateway, Microservices, and the PostgreSQL database.

---

## 2. Core Synchronization Workflows

### 1. User Registration Flow
```text
User Frontend
   ↓ (POST /api/v1/auth/register)
API Gateway (:8080)
   ↓ (Validates rate limits & request schema)
Auth Service (:3001)
   ↓ (Hashes password with bcrypt, generates default role)
PostgreSQL Database
   ├── INSERT INTO users (email, password_hash, role_id)
   └── INSERT INTO user_profiles (user_id, updated_at)
   ↓
Admin User Management
   ↓ (Admin Frontend queries /api/v1/analytics/overview or /api/v1/users)
Admin table reflects new user registration dynamically.
```

### 2. User Profile Update Flow
```text
User Frontend
   ↓ (PUT /api/v1/users/profile - Height, Weight, Dosha)
API Gateway (:8080)
   ↓ (Verifies JWT, attaches X-User-ID)
User Service (:3002)
   ↓ (Validates dosha constraints & numeric ranges via Zod)
PostgreSQL Database
   └── UPDATE user_profiles SET height_cm = ..., weight_kg = ..., updated_at = NOW() WHERE user_id = ...
   ↓
Admin Frontend
   ↓ (Admin fetches user details: GET /api/v1/users/:id)
Admin UI instantly reflects updated profile upon refetch.
```

### 3. Admin Account Suspension & Session Revocation
```text
Admin Frontend
   ↓ (POST /api/v1/users/:id/status { isActive: false })
API Gateway (:8080)
   ↓ (Verifies Admin JWT role claims)
User Service (:3002) / Auth Service (:3001)
   ↓ (Executes atomic update & revocation)
PostgreSQL Database
   ├── UPDATE users SET is_active = FALSE WHERE id = :id
   └── UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = :id
   ↓
User Frontend
   ↓ (Next API call or token refresh attempt)
Gateway / Auth Service rejects with 401 Account Suspended.
User Frontend clears session storage and transitions to Account Suspended screen.
```

### 4. Admin Broadcast to User Notification Inbox
```text
Admin Frontend
   ↓ (POST /api/v1/notifications/broadcast { title, message, category })
API Gateway (:8080)
Notification Service (:3010)
   ↓ (Iterates user IDs or applies query criteria)
PostgreSQL Database
   └── INSERT INTO notifications (user_id, title, message, category, is_read)
   ↓
User Notification Inbox
   ↓ (User navbar polls GET /api/v1/notifications/unread-count or SSE)
Notification Bell badge updates; clicking displays message.
```

### 5. Product Availability Update Flow
```text
Admin Frontend
   ↓ (PATCH /api/v1/marketplace/products/:id/stock { stockQuantity: 0, isActive: false })
API Gateway (:8080)
Marketplace Service (:3007)
   ↓ (Updates inventory records)
PostgreSQL Database
   └── UPDATE products SET stock_quantity = 0, is_active = FALSE WHERE id = :id
   ↓
User Marketplace
   ↓ (User searches catalog or refreshes page)
Product is immediately marked 'Out of Stock' or removed from active catalog queries.
```

### 6. Order Creation & Admin Visibility
```text
User Frontend
   ↓ (POST /api/v1/orders/checkout { cartItems, addressId, paymentMethod })
API Gateway (:8080)
Orders Service (:3008)
   ↓ (Begins PostgreSQL Transaction)
PostgreSQL Database
   ├── INSERT INTO orders (order_number, user_id, final_amount, status='CONFIRMED')
   ├── INSERT INTO order_items (order_id, product_id, quantity, unit_price)
   ├── INSERT INTO payments (order_id, transaction_reference, status='PAID')
   └── INSERT INTO tracking_events (order_id, milestone='ORDER_PLACED')
   ↓ (Commits Transaction)
Admin Order Management
   ↓ (Admin views /admin/orders)
New order appears with verified payment status and items breakdown.
```
