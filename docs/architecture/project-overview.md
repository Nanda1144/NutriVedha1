# NutriVedha — Project Overview

## 1. Executive Summary
**NutriVedha** is an enterprise-grade, precision Ayurvedic intelligence and integrated HealthTech ecosystem that bridges 5,000 years of traditional Ayurvedic principles with modern clinical artificial intelligence, microservices architecture, and secure personal health record management.

The platform eliminates the dichotomy between traditional wellness wisdom and scientific evidence-based digital health. NutriVedha delivers:
- Precision Prakriti (constitution) and Vikriti (imbalance) dosha assessments.
- AI-driven non-invasive symptom and dermatological image screening with confidence scores.
- Clinical-grade encrypted medical records vault (AES-256-GCM).
- Budget-aware, dosha-aligned personalized nutrition, diet, and recipe intelligence.
- Telemedicine consultations and verified practitioner discovery.
- Ayurvedic lifestyle, yoga routines, and circadian fitness regimens.
- Farm-to-home organic produce and Ayurvedic medicinal herbs marketplace with end-to-end order delivery tracking.
- Centralized administrative governance, audit trails, and telemetric oversight.

---

## 2. Strategic Objectives
1. **Holistic Modernization of Ayurveda**: Modernize classical Ayurvedic diagnosis using machine learning without diluting traditional diagnostic authenticity.
2. **Clinical Security & Privacy First**: Safeguard sensitive patient records with authenticated encryption at rest and role-based access control.
3. **Decoupled Scalability**: Architect an independent, microservices-driven backend orchestrated through an API Gateway, facilitating continuous delivery and zero-downtime scaling.
4. **Transparent Farm-to-Home Supply Chain**: Connect verified organic cultivators directly to health-conscious consumers for pure, unadulterated herbs and medicinal produce.
5. **Phase-Gated Development**: Establish a rock-solid foundation for the **User** and **Admin** ecosystems in Phase 1, preserving clear domain boundaries for future Doctor, Trainer, Farmer, and Delivery Partner portals.

---

## 3. High-Level System Landscape

```mermaid
flowchart TB
    subgraph Clients["Frontend Applications (Vite + React 19)"]
        UserApp["User Web App<br/>(user.nutrivedha.example)"]
        AdminApp["Admin Control Panel<br/>(admin.nutrivedha.example)"]
    end

    subgraph Ingress["Ingress & Perimeter Security"]
        Gateway["API Gateway (Port 8080)<br/>Reverse Proxy, Rate Limiting, JWT Auth Gate, Correlation IDs"]
    end

    subgraph Services["Core Microservices Cluster (Node.js + Express + TypeScript)"]
        AuthSvc["Auth Service (:3001)"]
        UserSvc["User Service (:3002)"]
        AISvc["AI Intelligence Service (:3003)"]
        MedSvc["Medical Records Service (:3005)"]
        TeleSvc["Telemedicine Service (:3006)"]
        FitSvc["Fitness & Yoga Service (:3009)"]
        MktSvc["Marketplace Service (:3007)"]
        NotifSvc["Notification Service (:3010)"]
        AnalyticsSvc["Analytics & Audit Service (:3011)"]
        OrderSvc["Orders & Logistics Service (:3008)"]
    end

    subgraph DataPlane["Centralized Data Store"]
        Postgres[("PostgreSQL 16 Cluster<br/>Dedicated Service Schemas / Tables")]
    end

    UserApp -->|HTTPS / REST| Gateway
    AdminApp -->|HTTPS / REST| Gateway

    Gateway -->|/api/v1/auth| AuthSvc
    Gateway -->|/api/v1/users| UserSvc
    Gateway -->|/api/v1/ai| AISvc
    Gateway -->|/api/v1/medical| MedSvc
    Gateway -->|/api/v1/telemedicine| TeleSvc
    Gateway -->|/api/v1/fitness| FitSvc
    Gateway -->|/api/v1/marketplace| MktSvc
    Gateway -->|/api/v1/notifications| NotifSvc
    Gateway -->|/api/v1/analytics| AnalyticsSvc
    Gateway -->|/api/v1/orders| OrderSvc

    AuthSvc --> Postgres
    UserSvc --> Postgres
    AISvc --> Postgres
    MedSvc --> Postgres
    TeleSvc --> Postgres
    FitSvc --> Postgres
    MktSvc --> Postgres
    NotifSvc --> Postgres
    AnalyticsSvc --> Postgres
    OrderSvc --> Postgres
```

---

## 4. Architectural Tenets
- **Zero Frontend Secrets**: Secrets, cryptographic keys, and database credentials remain strictly within backend microservices and secure vault environments.
- **Stateless Authorization**: JWT with cryptographically secure asymmetric or HMAC-SHA256 signatures paired with server-managed refresh token rotation.
- **Dedicated Data Ownership**: While leveraging a unified PostgreSQL 16 cluster, each microservice strictly owns its domain tables and data access constraints.
- **Fail-Safe Graceful Degradation**: Real AI capabilities with deterministic fallbacks prevent downtime if upstream AI or external APIs experience transient network failure.
