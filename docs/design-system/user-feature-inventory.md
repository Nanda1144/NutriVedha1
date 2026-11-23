# NutriVedha — Extracted User Feature Inventory

Derived from the comprehensive functional analysis of the existing codebase and README:

| # | Feature Name | Route Path | Implementation Status in Phase 1 | Upstream Service | Functional Capability |
|---|---|---|---|---|---|
| 1 | **Home / Landing** | `/` | In Scope (Full) | Gateway | Platform overview, wellness value proposition, quick access links |
| 2 | **Authentication & Register**| `/login`, `/register` | In Scope (Full) | Auth (`:3001`) | Email/password, phone OTP, session restore |
| 3 | **Wellness Dashboard** | `/dashboard` | In Scope (Full) | User (`:3002`) | Personal dosha summary, quick stats, active orders, health streaks |
| 4 | **AI Disease & Symptom Scan**| `/scan` | In Scope (Full) | AI (`:3003`) | Photo upload, symptom text input, Gemini analysis with fallback |
| 5 | **Personalized Diet Planner** | `/diet` | In Scope (Full) | AI (`:3003`) | 7-day budget-aware dosha meal schedules, calorie & macro breakdowns |
| 6 | **Recipe Discovery** | `/recipes` | In Scope (Full) | AI (`:3003`) | Pantry-ingredient search, Ayurvedic cooking steps, recipe bookmarks |
| 7 | **Encrypted Medical Vault** | `/reports` | In Scope (Full) | Medical (`:3005`) | Diagnostic report upload, AES-256-GCM encryption, decryption preview |
| 8 | **Doctor Discovery** | `/telemedicine` | In Scope (Full) | Telemedicine (`:3006`) | Verified doctor directory, filters by specialization, fee, rating |
| 9 | **Appointment Booking** | `/telemedicine/book/:id`| In Scope (Full) | Telemedicine (`:3006`) | Consultation slot selection, booking request submission |
| 10 | **Yoga & Fitness Regimens** | `/fitness` | In Scope (Full) | Fitness (`:3009`) | Yoga asana library, daily workout tracker, streak milestones |
| 11 | **Organic Herb Marketplace** | `/marketplace` | In Scope (Full) | Marketplace (`:3007`)| Organic crops, pure herbs, categories, pricing, seasonal tags |
| 12 | **Cart & Checkout** | `/cart`, `/checkout` | In Scope (Full) | Orders (`:3008`) | Address selection, inventory reservation, order placement |
| 13 | **Order & Delivery Tracking**| `/orders/:id/track` | In Scope (Full) | Orders (`:3008`) | 5-step milestone tracking (Placed -> Hub -> Out for Delivery -> Done) |
| 14 | **User Profile & Addresses** | `/profile` | In Scope (Full) | User (`:3002`) | Physical address book, dosha settings, GDPR data export |
| 15 | **Notifications Inbox** | `/notifications` | In Scope (Full) | Notification (`:3010`)| Real-time alert notifications, unread badges, category filters |
| 16 | **Global Search** | `/search` | In Scope (Full) | Gateway | Unified search across herbs, doctors, recipes, and wellness articles |
