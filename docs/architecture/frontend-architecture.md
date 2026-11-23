# NutriVedha — Frontend Architecture

## 1. Design Overview
NutriVedha employs **two completely decoupled frontend single-page applications (SPAs)**:
1. `frontend/user`: Focuses on consumer wellness, patient experience, AI diagnostics, and e-commerce transactions.
2. `frontend/admin`: Focuses on governance, audit review, catalog control, user status moderation, and system health.

Both frontends are built on **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**, communicating exclusively with the backend via the **API Gateway (`:8080`)**.

```mermaid
graph TD
    subgraph Browser["Client Browser"]
        UserBrowser["User Frontend (:5173)<br/>Route: /scan, /diet, /marketplace"]
        AdminBrowser["Admin Frontend (:5174)<br/>Route: /users, /audit, /broadcasts"]
    end

    subgraph UserArchitecture["User Frontend Internal Architecture"]
        U_Routes["React Router v7"]
        U_Guards["PrivateRoute & RoleGuard"]
        U_Store["Zustand Stores (User, Cart, Diet)"]
        U_API["Centralized Axios HTTP Client"]
        U_UI["Tailwind CSS + Lucide + Framer Motion"]
    end

    subgraph AdminArchitecture["Admin Frontend Internal Architecture"]
        A_Routes["React Router v7"]
        A_Guards["AdminAuthGuard (Elevated JWT check)"]
        A_Store["Zustand Store (AdminStore)"]
        A_API["Centralized Axios Admin Client"]
        A_UI["Tailwind CSS + Recharts + Lucide"]
    end

    UserBrowser --> U_Routes
    U_Routes --> U_Guards
    U_Guards --> U_Store
    U_Store --> U_API
    U_Routes --> U_UI

    AdminBrowser --> A_Routes
    A_Routes --> A_Guards
    A_Guards --> A_Store
    A_Store --> A_API
    A_Routes --> A_UI

    U_API -->|VITE_API_BASE_URL (http://localhost:8080/api/v1)| Gateway["API Gateway (:8080)"]
    A_API -->|VITE_API_BASE_URL (http://localhost:8080/api/v1)| Gateway
```

---

## 2. Frontend State Management Architecture
State is decoupled into two primary categories:
1. **Global Ephemeral & Cached State (Zustand)**:
   - `useUserStore`: Current authenticated user identity, role, profile details, and authentication status.
   - `useCartStore`: Current shopping cart items, quantities, totals, and active coupon codes (persisted in `sessionStorage`).
   - `useAdminStore`: Admin authentication token, selected metrics filters, and active audit log pagination state.
2. **Server Cache & Mutation State**:
   - Centralized API service functions paired with custom data hooks (`useApi`, `useScanReport`, `useOrders`) manage async lifecycle states (`isLoading`, `error`, `data`, `refetch`).

---

## 3. Route Protection & RBAC
- Frontends implement declarative route guards:
  - `<PrivateRoute allowedRoles={['User', 'Admin']}>`: Ensures presence of an active JWT and non-expired token.
  - `<AdminAuthGuard>`: Strictly verifies that the decoded JWT contains `role === 'Admin'` and redirects unauthorized users to `/admin/login`.
- Tokens are held securely in memory with non-sensitive session metadata kept in browser storage.
