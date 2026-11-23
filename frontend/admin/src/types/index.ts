// NutriVedha Enterprise Admin System Types

export type AdminRole = 
  | 'SUPER_ADMIN' 
  | 'SYSTEM_OPERATOR' 
  | 'CONTENT_MANAGER' 
  | 'COMPLIANCE_OFFICER' 
  | 'SUPPORT_SPECIALIST';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  permissions: string[];
  lastLogin: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface AdminSession {
  id: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  createdAt: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isSystemRole: boolean;
  isFutureRole: boolean;
  permissions: string[];
  userCount: number;
}

export type ManagedUserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_DELETION';

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Tridoshic' | 'Unassessed';
  status: ManagedUserStatus;
  registrationDate: string;
  lastActive: string;
  ordersCount: number;
  healthScansCount: number;
  appointmentsCount: number;
  avatarUrl?: string;
  city: string;
  state: string;
  deletionReason?: string;
  deletionRequestedAt?: string;
}

export interface UserStatusHistory {
  id: string;
  userId: string;
  previousStatus: ManagedUserStatus;
  newStatus: ManagedUserStatus;
  changedBy: string;
  reason: string;
  timestamp: string;
}

export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newRegistrationsToday: number;
  userGrowthPct: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueGrowthPct: number;
  systemHealthScore: number;
  activeServicesCount: number;
  totalServicesCount: number;
}

export interface RegistrationTrendPoint {
  date: string;
  total: number;
  active: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export type ProductCategory = 
  | 'HERBAL_SUPPLEMENTS' 
  | 'AYURVEDIC_FOODS' 
  | 'ORGANIC_CROPS' 
  | 'WELLNESS_OILS' 
  | 'TEAS_INFUSIONS';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DRAFT';

export interface AdminProduct {
  id: string;
  name: string;
  sanskritName: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  status: StockStatus;
  rating: number;
  salesCount: number;
  description: string;
  doshaTags: string[];
  imageUrl: string;
  farmerName?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    step: string;
    label: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface ContentBanner {
  id: string;
  title: string;
  subtitle: string;
  targetUrl: string;
  imageUrl: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  placement: 'HERO' | 'PROMO_STRIP' | 'FOOTER_CALLOUT';
  priority: number;
  startDate?: string;
  endDate?: string;
}

export interface ContentFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'AYURVEDA' | 'ORDERS' | 'TELEMEDICINE' | 'GENERAL' | 'CONSULTATIONS';
  isPublished: boolean;
  displayOrder: number;
}

export interface ContentAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'MAINTENANCE' | 'PROMOTION' | 'CRITICAL';
  isPublished: boolean;
  targetAudience: 'ALL' | 'NEW_USERS' | 'PATIENTS';
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  category: 'WELLNESS' | 'SYSTEM' | 'ORDER' | 'PROMOTION' | 'SECURITY';
  audience: 'ALL_USERS' | 'SELECTED_USERS' | 'SUBSCRIBERS';
  targetCount: number;
  deliveredCount: number;
  readCount: number;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  sentAt?: string;
  createdBy: string;
}

export type AuditAction = 
  | 'USER_STATUS_CHANGE'
  | 'USER_DELETION_REVIEW'
  | 'ADMIN_INVITE'
  | 'ROLE_PERMISSIONS_UPDATE'
  | 'PRODUCT_CREATE'
  | 'PRODUCT_UPDATE'
  | 'PRODUCT_DELETE'
  | 'ORDER_STATUS_UPDATE'
  | 'ORDER_REFUND_PROCESSED'
  | 'NOTIFICATION_BROADCAST'
  | 'CONTENT_PUBLISH'
  | 'MAINTENANCE_TOGGLE'
  | 'SECURITY_POLICY_UPDATE'
  | 'ADMIN_PASSWORD_CHANGE';

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: AuditAction | string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  changesSummary: string;
  detailsJson?: string;
}

export interface MicroserviceStatus {
  serviceId: string;
  name: string;
  port: number;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  uptimePct: number;
  version: string;
  lastPing: string;
  errorRatePct: number;
  dependencies: string[];
}

export interface DatabaseMetrics {
  connectionsActive: number;
  connectionsMax: number;
  latencyMs: number;
  storageUsedMb: number;
  storageTotalMb: number;
  activeQueries: number;
  cacheHitRatio: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface SystemSettings {
  appName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  registrationAllowed: boolean;
  sessionTimeoutMinutes: number;
  mfaRequiredForAdmins: boolean;
  maxFailedLogins: number;
  featureFlags: {
    aiScanEnabled: boolean;
    telemedicineBookingEnabled: boolean;
    farmMarketplaceEnabled: boolean;
    signLanguageAssistEnabled: boolean;
    liveChatSupportEnabled: boolean;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
