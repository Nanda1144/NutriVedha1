import apiClient, { isMockEnabled } from './apiClient';
import { Product, ProductCategory } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './mockData';

export const marketplaceService = {
  async getCategories(): Promise<ProductCategory[]> {
    if (isMockEnabled()) {
      return MOCK_CATEGORIES;
    }
    const res = await apiClient.get<{ data: ProductCategory[] }>('/marketplace/categories');
    return res.data.data;
  },

  async getProducts(params?: { categoryId?: string; search?: string; sort?: string }): Promise<Product[]> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 300));
      let results = [...MOCK_PRODUCTS];

      if (params?.categoryId && params.categoryId !== 'all') {
        results = results.filter((p) => p.categoryId === params.categoryId);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.originRegion.toLowerCase().includes(q)
        );
      }
      if (params?.sort === 'price-low') {
        results.sort((a, b) => a.priceINR - b.priceINR);
      } else if (params?.sort === 'price-high') {
        results.sort((a, b) => b.priceINR - a.priceINR);
      } else if (params?.sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      }
      return results;
    }

    const res = await apiClient.get<{ data: Product[] }>('/marketplace/products', { params });
    return res.data.data;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isMockEnabled()) {
      return MOCK_PRODUCTS.find((p) => p.id === id) || null;
    }
    const res = await apiClient.get<{ data: Product }>(`/marketplace/products/${id}`);
    return res.data.data;
  },
};
