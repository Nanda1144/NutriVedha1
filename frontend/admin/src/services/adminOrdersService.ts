import { apiClient, USE_MOCK } from './apiClient';
import { AdminOrder, OrderStatus, PaginatedResult } from '../types';
import { MOCK_ORDERS, MOCK_AUDIT_LOGS } from './mockData';

export interface OrderFilterOptions {
  search?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}

export const adminOrdersService = {
  getOrders: async (filters: OrderFilterOptions = {}): Promise<PaginatedResult<AdminOrder>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      let list = [...MOCK_ORDERS];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q) ||
            o.trackingNumber?.toLowerCase().includes(q)
        );
      }

      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((o) => o.status === filters.status);
      }

      if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
        list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const data = list.slice((page - 1) * limit, page * limit);

      return { data, total, page, pageSize: limit, totalPages };
    }

    const res = await apiClient.get<PaginatedResult<AdminOrder>>('/admin/orders', { params: filters });
    return res.data;
  },

  getOrderById: async (orderId: string): Promise<AdminOrder> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const ord = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (!ord) throw new Error('Order not found');
      return { ...ord };
    }
    const res = await apiClient.get<AdminOrder>(`/admin/orders/${orderId}`);
    return res.data;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ): Promise<AdminOrder> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const ord = MOCK_ORDERS.find((o) => o.id === orderId);
      if (!ord) throw new Error('Order not found');

      const prev = ord.status;
      ord.status = status;
      if (trackingNumber) ord.trackingNumber = trackingNumber;
      if (carrier) ord.carrier = carrier;
      ord.updatedAt = new Date().toISOString();

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_02',
        adminName: 'Priyanka Sen',
        adminEmail: 'ops@nutrivedha.com',
        action: 'ORDER_STATUS_UPDATE',
        resource: 'ORDER',
        resourceId: orderId,
        timestamp: new Date().toISOString(),
        ipAddress: '49.207.210.45',
        userAgent: 'Firefox 129',
        status: 'SUCCESS',
        changesSummary: `Updated order ${ord.orderNumber} status from ${prev} to ${status}${trackingNumber ? ` (Carrier: ${carrier}, Tracking: ${trackingNumber})` : ''}.`,
      });

      return { ...ord };
    }

    const res = await apiClient.patch<AdminOrder>(`/admin/orders/${orderId}/status`, {
      status,
      trackingNumber,
      carrier,
    });
    return res.data;
  },
};
