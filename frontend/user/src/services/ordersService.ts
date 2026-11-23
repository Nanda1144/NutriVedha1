import apiClient, { isMockEnabled } from './apiClient';
import { Order, CartItem, UserAddress } from '../types';
import { MOCK_ORDERS } from './mockData';

let localOrders: Order[] = [...MOCK_ORDERS];

export const ordersService = {
  async createOrder(checkoutData: {
    items: CartItem[];
    deliveryAddress: UserAddress;
    paymentMethod: Order['paymentMethod'];
  }): Promise<Order> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 800));
      const totalAmount = checkoutData.items.reduce((sum, item) => sum + item.product.priceINR * item.quantity, 0);
      const deliveryFee = totalAmount > 1000 ? 0 : 40;
      const discount = 50;
      const finalAmount = Math.max(0, totalAmount + deliveryFee - discount);

      const orderNumber = `NV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber,
        userId: 'usr_88291a0f-1144-4f21-992a-001',
        items: checkoutData.items.map((i) => ({
          productId: i.product.id,
          productTitle: i.product.title,
          productImage: i.product.imageUrl,
          unitPriceINR: i.product.priceINR,
          quantity: i.quantity,
          subtotalINR: i.product.priceINR * i.quantity,
        })),
        deliveryAddress: checkoutData.deliveryAddress,
        totalAmountINR: totalAmount,
        discountINR: discount,
        deliveryFeeINR: deliveryFee,
        finalAmountINR: finalAmount,
        paymentMethod: checkoutData.paymentMethod,
        paymentStatus: 'Paid',
        transactionReference: `TXN_${Date.now()}_UPI`,
        orderStatus: 'Order Placed',
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        trackingTimeline: [
          {
            milestone: 'Order Placed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: 'Organic Hub Gateway',
            notes: 'Order confirmed and inventory locked from organic farmers cooperative.',
            completed: true,
          },
          {
            milestone: 'Quality Verified',
            timestamp: 'Expected within 12 hours',
            location: 'Regional QC Lab',
            notes: 'Herbal purity batch check pending.',
            completed: false,
          },
          {
            milestone: 'Dispatched from Farm Hub',
            timestamp: 'Pending',
            location: 'Farm Hub',
            notes: 'Handover to delivery courier scheduled.',
            completed: false,
          },
          {
            milestone: 'Out for Delivery',
            timestamp: 'Pending',
            location: 'Local Delivery Hub',
            notes: 'Dispatch to destination address.',
            completed: false,
          },
          {
            milestone: 'Delivered',
            timestamp: 'Pending',
            location: 'Customer Address',
            notes: 'Doorstep contactless delivery.',
            completed: false,
          },
        ],
      };

      localOrders.unshift(newOrder);
      return newOrder;
    }

    const res = await apiClient.post<{ data: Order }>('/orders/checkout', checkoutData);
    return res.data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      return localOrders;
    }
    const res = await apiClient.get<{ data: Order[] }>('/orders/my-orders');
    return res.data.data;
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (isMockEnabled()) {
      return localOrders.find((o) => o.id === id || o.orderNumber === id) || null;
    }
    const res = await apiClient.get<{ data: Order }>(`/orders/${id}`);
    return res.data.data;
  },
};
