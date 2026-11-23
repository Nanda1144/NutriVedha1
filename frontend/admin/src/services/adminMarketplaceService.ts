import { apiClient, USE_MOCK } from './apiClient';
import { AdminProduct, PaginatedResult } from '../types';
import { MOCK_PRODUCTS, MOCK_AUDIT_LOGS } from './mockData';

export interface ProductFilterOptions {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const adminMarketplaceService = {
  getProducts: async (filters: ProductFilterOptions = {}): Promise<PaginatedResult<AdminProduct>> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      let list = [...MOCK_PRODUCTS];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sanskritName.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }

      if (filters.category && filters.category !== 'ALL') {
        list = list.filter((p) => p.category === filters.category);
      }

      if (filters.status && filters.status !== 'ALL') {
        list = list.filter((p) => p.status === filters.status);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const data = list.slice((page - 1) * limit, page * limit);

      return { data, total, page, pageSize: limit, totalPages };
    }

    const res = await apiClient.get<PaginatedResult<AdminProduct>>('/admin/marketplace/products', { params: filters });
    return res.data;
  },

  getProductById: async (productId: string): Promise<AdminProduct> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const p = MOCK_PRODUCTS.find((item) => item.id === productId);
      if (!p) throw new Error('Product not found in catalog');
      return { ...p };
    }
    const res = await apiClient.get<AdminProduct>(`/admin/marketplace/products/${productId}`);
    return res.data;
  },

  saveProduct: async (product: Partial<AdminProduct>): Promise<AdminProduct> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let saved: AdminProduct;

      if (product.id) {
        const idx = MOCK_PRODUCTS.findIndex((p) => p.id === product.id);
        if (idx !== -1) {
          MOCK_PRODUCTS[idx] = {
            ...MOCK_PRODUCTS[idx],
            ...product,
            updatedAt: new Date().toISOString(),
          } as AdminProduct;
          saved = MOCK_PRODUCTS[idx];
        } else {
          saved = product as AdminProduct;
        }
      } else {
        saved = {
          id: `prod_${Date.now()}`,
          name: product.name || 'Organic Ayurvedic Preparation',
          sanskritName: product.sanskritName || 'Classical Shastra Herb',
          category: product.category || 'HERBAL_SUPPLEMENTS',
          price: product.price || 500,
          discountPrice: product.discountPrice,
          stock: product.stock !== undefined ? product.stock : 50,
          sku: product.sku || `NV-${Date.now().toString().slice(-4)}`,
          status: product.status || 'IN_STOCK',
          rating: 4.8,
          salesCount: 0,
          description: product.description || '',
          doshaTags: product.doshaTags || ['Tridoshic'],
          imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
          farmerName: product.farmerName || 'Vedic Cooperative Partner',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        MOCK_PRODUCTS.unshift(saved);
      }

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_02',
        adminName: 'Priyanka Sen',
        adminEmail: 'ops@nutrivedha.com',
        action: product.id ? 'PRODUCT_UPDATE' : 'PRODUCT_CREATE',
        resource: 'PRODUCT',
        resourceId: saved.id,
        timestamp: new Date().toISOString(),
        ipAddress: '49.207.210.45',
        userAgent: 'Firefox 129',
        status: 'SUCCESS',
        changesSummary: `${product.id ? 'Updated' : 'Created'} catalog product "${saved.name}" (SKU: ${saved.sku}, Stock: ${saved.stock})`,
      });

      return saved;
    }

    const res = await apiClient.post<AdminProduct>('/admin/marketplace/products', product);
    return res.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
      if (idx !== -1) {
        const removed = MOCK_PRODUCTS.splice(idx, 1)[0];
        MOCK_AUDIT_LOGS.unshift({
          id: `aud_${Date.now()}`,
          adminId: 'adm_02',
          adminName: 'Priyanka Sen',
          adminEmail: 'ops@nutrivedha.com',
          action: 'PRODUCT_DELETE',
          resource: 'PRODUCT',
          resourceId: productId,
          timestamp: new Date().toISOString(),
          ipAddress: '49.207.210.45',
          userAgent: 'Firefox 129',
          status: 'SUCCESS',
          changesSummary: `Deleted catalog product "${removed.name}" (SKU: ${removed.sku})`,
        });
      }
      return;
    }

    await apiClient.delete(`/admin/marketplace/products/${productId}`);
  },
};
