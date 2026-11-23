# NutriVedha — Component Inventory

## 1. Reusable Core UI Components

| Component Name | File Path | Props & Description |
|---|---|---|
| **Button** | `components/common/Button.tsx` | Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`. Sizes: `sm`, `md`, `lg`. Supports loading spinner. |
| **Input** | `components/common/Input.tsx` | Label, error message, leading/trailing Lucide icons, full accessible ARIA support. |
| **Modal / Dialog** | `components/common/Modal.tsx` | Backdrop blur, keyboard ESC dismissal, focus trap, customizable header/body/footer. |
| **Card** | `components/common/Card.tsx` | Reusable glassmorphic container with customizable padding, border, and elevation. |
| **Badge / Pill** | `components/common/Badge.tsx` | Status indicators: `success`, `warning`, `danger`, `info`, `neutral`. |
| **DataTable** | `components/common/DataTable.tsx` | Universal sortable, filterable, paginated table with empty-state handling. |
| **NotificationToast**| `components/common/Toast.tsx` | Floating alert toast supporting `success`, `error`, `info` auto-dismissing after 3s. |

---

## 2. User Experience Feature Components

| Component Name | Feature Domain | Description |
|---|---|---|
| **ScanUploader** | AI Disease Scan | Drag-and-drop file uploader with live preview, camera capture, format validator. |
| **ScanResultCard** | AI Disease Scan | Structured card displaying detected dosha imbalance, severity score, suggested herbs. |
| **DietWeekGrid** | Diet & Nutrition | 7-day responsive grid breaking down breakfast, lunch, and dinner with nutritional metrics. |
| **DoctorCard** | Telemedicine | Practitioner profile card with experience years, rating stars, fee, and instant Book button. |
| **ProductCard** | Marketplace | Organic crop listing card with stock indicator, weight selector, and Add to Cart. |
| **DeliveryTracker** | Orders | 5-stage visual progress timeline displaying historical tracking timestamps. |
| **MedicalReportCard**| Medical Vault | Encrypted record item with report date, AES shield badge, and Secure Download button. |

---

## 3. Admin Experience Feature Components

| Component Name | Feature Domain | Description |
|---|---|---|
| **MetricStatCard** | Overview | High-level KPI card with current value, delta percentage change, and trend micro-chart. |
| **UserAuditTable** | User Governance | Paginated table of platform users with status badges, quick suspend/activate actions. |
| **AuditLogInspector**| Telemetry | Log viewer with JSON metadata expandable drawer and severity color coding. |
| **BroadcastComposer**| Notifications | Rich message composer with audience selection filters (all users, specific roles). |
| **SystemHealthPanel**| Monitoring | Live health check indicator showing response latencies across all 10 microservices. |
