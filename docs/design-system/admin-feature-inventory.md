# NutriVedha — Extracted Admin Feature Inventory

Derived from the comprehensive functional analysis of the existing codebase and README:

| # | Feature Name | Route Path | Implementation Status in Phase 1 | Upstream Service | Functional Capability |
|---|---|---|---|---|---|
| 1 | **Admin Login Gate** | `/admin/login` | In Scope (Full) | Auth (`:3001`) | Secure administrative authentication with role verification |
| 2 | **Executive Dashboard** | `/admin` | In Scope (Full) | Analytics (`:3011`) | Platform-wide KPIs: active users, orders count, total volume, health score |
| 3 | **User Governance** | `/admin/users` | In Scope (Full) | User (`:3002`) | List, search, filter users; view detailed profile; suspend/reactivate account |
| 4 | **Global Audit Telemetry** | `/admin/audit-logs` | In Scope (Full) | Analytics (`:3011`) | System audit records, actor tracking, IP logs, mutation history |
| 5 | **System Broadcast Center** | `/admin/broadcasts` | In Scope (Full) | Notification (`:3010`)| Dispatch system announcements to all users or specific cohorts |
| 6 | **Marketplace Product Control**| `/admin/marketplace`| In Scope (Full) | Marketplace (`:3007`)| Product catalog management: edit stock, adjust pricing, toggle product active state |
| 7 | **Order Oversight** | `/admin/orders` | In Scope (Full) | Orders (`:3008`) | View all platform orders, inspect item details, payment status |
| 8 | **Infrastructure Health Monitor**| `/admin/system-health`| In Scope (Full) | Gateway / Analytics| Real-time latency, health pings, database connection status of all 10 microservices |
| 9 | **Doctor Verification Oversight**| `/admin/doctors` | In Scope (Read-only)| Telemedicine (`:3006`)| View practitioner directory and licensing records |
| 10 | **Platform Settings** | `/admin/settings` | In Scope (Full) | Analytics (`:3011`) | Configure maintenance banners, global platform feature toggles |
