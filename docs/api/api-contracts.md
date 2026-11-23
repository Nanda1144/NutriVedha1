# NutriVedha — API Contracts & Gateway Specification

## 1. Global API Conventions
- **Base URL**: `http://localhost:8080/api/v1` (Development) / `https://api.nutrivedha.example/api/v1` (Production)
- **Content Type**: `application/json` (except multipart file uploads)
- **Authorization**: `Authorization: Bearer <accessToken>`
- **Response Format**:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_12345",
    "timestamp": "2026-11-22T15:40:00.000Z"
  }
}
```

---

## 2. Microservice API Routes Inventory

### 1. Auth Service (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user account |
| `POST` | `/login` | Public | Authenticate user with email & password |
| `POST` | `/admin/login` | Public | Authenticate administrator |
| `POST` | `/refresh` | Public | Rotate refresh token & issue new access token |
| `POST` | `/logout` | Authenticated | Revoke refresh token |
| `GET` | `/me` | Authenticated | Get current authenticated user profile & role |
| `POST` | `/forgot-password` | Public | Initiate password reset flow |
| `POST` | `/reset-password` | Public | Complete password reset with token |

### 2. User Service (`/api/v1/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/profile` | Authenticated | Get user profile, dosha, health indicators |
| `PUT` | `/profile` | Authenticated | Update user profile |
| `GET` | `/addresses` | Authenticated | List saved delivery addresses |
| `POST` | `/addresses` | Authenticated | Create new delivery address |
| `DELETE`| `/addresses/:id`| Authenticated | Delete saved address |
| `GET` | `/preferences`| Authenticated | Get notification and dietary preferences |
| `PUT` | `/preferences`| Authenticated | Update user preferences |
| `POST` | `/export-data`| Authenticated | Request full personal data export (GDPR) |
| `DELETE`| `/account` | Authenticated | Request account deletion |
| `POST` | `/:id/status` | Admin | Activate or suspend user account |

### 3. AI Service (`/api/v1/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/scan` | Authenticated | Submit symptom description and photo for Ayurvedic scan |
| `POST` | `/diet/generate` | Authenticated | Generate 7-day budget-aware dosha diet plan |
| `GET` | `/diet/current` | Authenticated | Retrieve active user diet plan |
| `POST` | `/recipes/recommend` | Authenticated | Get recipe suggestions from available ingredients |
| `GET` | `/recipes/saved` | Authenticated | List bookmarked user recipes |
| `POST` | `/recipes/saved` | Authenticated | Bookmark recipe to user vault |
| `GET` | `/history` | Authenticated | Get user AI request and diagnosis audit trail |

### 4. Medical Service (`/api/v1/medical`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/reports/upload` | Authenticated | Upload and encrypt medical diagnostic report |
| `GET` | `/reports` | Authenticated | List user encrypted medical reports |
| `GET` | `/reports/:id` | Authenticated | Retrieve & decrypt single medical report |
| `DELETE`| `/reports/:id` | Authenticated | Delete medical report record |

### 5. Telemedicine Service (`/api/v1/telemedicine`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/doctors` | Public | Browse verified Ayurvedic doctor directory |
| `GET` | `/doctors/:id` | Public | View doctor profile, experience, fees |
| `POST` | `/appointments` | User | Book appointment slot with practitioner |
| `GET` | `/appointments/my`| User | View user scheduled consultations |
| `POST` | `/appointments/:id/cancel` | User | Cancel scheduled appointment |

### 6. Marketplace Service (`/api/v1/marketplace`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | List organic product categories |
| `GET` | `/products` | Public | Search & filter products (pagination, dosha tag) |
| `GET` | `/products/:id` | Public | Get product details, stock, organic origin |
| `GET` | `/wishlist` | User | Get current user wishlist |
| `POST` | `/wishlist/:productId` | User | Add product to wishlist |
| `DELETE`| `/wishlist/:productId`| User | Remove product from wishlist |
| `GET` | `/cart` | User | Fetch active shopping cart |
| `PUT` | `/cart` | User | Update items in shopping cart |

### 7. Orders Service (`/api/v1/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/checkout` | User | Execute cart checkout and create order |
| `GET` | `/my-orders` | User | List user historical orders |
| `GET` | `/:id` | User/Admin | Get detailed order status and items |
| `GET` | `/:id/tracking` | User/Admin | Retrieve 5-step milestone tracking events |
| `GET` | `/admin/all` | Admin | List all platform orders with status filters |

### 8. Fitness Service (`/api/v1/fitness`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/workouts` | Public | Browse yoga asanas and workout library |
| `POST` | `/logs` | User | Log completed workout or yoga session |
| `GET` | `/logs/my` | User | Retrieve personal workout logs & streak metrics |

### 9. Notification Service (`/api/v1/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Authenticated | List user notifications (paginated) |
| `GET` | `/unread-count`| Authenticated | Get total unread notifications count |
| `PATCH`| `/:id/read` | Authenticated | Mark notification as read |
| `PATCH`| `/read-all` | Authenticated | Mark all notifications as read |
| `POST` | `/broadcast` | Admin | Send broadcast notification to users |

### 10. Analytics Service (`/api/v1/analytics`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/overview` | Admin | High-level system metrics (users, orders, revenue) |
| `GET` | `/audit-logs` | Admin | Filterable, paginated system audit trail |
| `GET` | `/health-status`| Admin | Aggregate uptime and health pings of all microservices |
