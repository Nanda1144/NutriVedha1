import { apiClient, USE_MOCK } from './apiClient';
import { ContentBanner, ContentFAQ, ContentAnnouncement } from '../types';
import { MOCK_CONTENT_BANNERS, MOCK_CONTENT_FAQS, MOCK_ANNOUNCEMENTS, MOCK_AUDIT_LOGS } from './mockData';

export const adminContentService = {
  getBanners: async (): Promise<ContentBanner[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));
      return [...MOCK_CONTENT_BANNERS];
    }
    const res = await apiClient.get<ContentBanner[]>('/admin/content/banners');
    return res.data;
  },

  saveBanner: async (banner: Partial<ContentBanner>): Promise<ContentBanner> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 350));
      let saved: ContentBanner;
      if (banner.id) {
        const idx = MOCK_CONTENT_BANNERS.findIndex((b) => b.id === banner.id);
        if (idx !== -1) {
          MOCK_CONTENT_BANNERS[idx] = { ...MOCK_CONTENT_BANNERS[idx], ...banner } as ContentBanner;
          saved = MOCK_CONTENT_BANNERS[idx];
        } else {
          saved = banner as ContentBanner;
        }
      } else {
        saved = {
          id: `ban_${Date.now()}`,
          title: banner.title || 'Untitled Banner',
          subtitle: banner.subtitle || '',
          targetUrl: banner.targetUrl || '/',
          imageUrl: banner.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
          status: banner.status || 'DRAFT',
          placement: banner.placement || 'HERO',
          priority: banner.priority || 1,
        };
        MOCK_CONTENT_BANNERS.push(saved);
      }

      MOCK_AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        adminId: 'adm_03',
        adminName: 'Rohan Deshmukh',
        adminEmail: 'content@nutrivedha.com',
        action: 'CONTENT_PUBLISH',
        resource: 'BANNER',
        resourceId: saved.id,
        timestamp: new Date().toISOString(),
        ipAddress: '103.21.124.92',
        userAgent: 'Chrome 131',
        status: 'SUCCESS',
        changesSummary: `Saved banner "${saved.title}" (Status: ${saved.status})`,
      });

      return saved;
    }
    const res = await apiClient.post<ContentBanner>('/admin/content/banners', banner);
    return res.data;
  },

  getFAQs: async (): Promise<ContentFAQ[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_CONTENT_FAQS];
    }
    const res = await apiClient.get<ContentFAQ[]>('/admin/content/faqs');
    return res.data;
  },

  saveFAQ: async (faq: Partial<ContentFAQ>): Promise<ContentFAQ> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      let saved: ContentFAQ;
      if (faq.id) {
        const idx = MOCK_CONTENT_FAQS.findIndex((f) => f.id === faq.id);
        if (idx !== -1) {
          MOCK_CONTENT_FAQS[idx] = { ...MOCK_CONTENT_FAQS[idx], ...faq } as ContentFAQ;
          saved = MOCK_CONTENT_FAQS[idx];
        } else {
          saved = faq as ContentFAQ;
        }
      } else {
        saved = {
          id: `faq_${Date.now()}`,
          question: faq.question || '',
          answer: faq.answer || '',
          category: faq.category || 'GENERAL',
          isPublished: faq.isPublished !== undefined ? faq.isPublished : true,
          displayOrder: MOCK_CONTENT_FAQS.length + 1,
        };
        MOCK_CONTENT_FAQS.push(saved);
      }
      return saved;
    }
    const res = await apiClient.post<ContentFAQ>('/admin/content/faqs', faq);
    return res.data;
  },

  deleteFAQ: async (faqId: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_CONTENT_FAQS.findIndex((f) => f.id === faqId);
      if (idx !== -1) MOCK_CONTENT_FAQS.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/admin/content/faqs/${faqId}`);
  },

  getAnnouncements: async (): Promise<ContentAnnouncement[]> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_ANNOUNCEMENTS];
    }
    const res = await apiClient.get<ContentAnnouncement[]>('/admin/content/announcements');
    return res.data;
  },

  saveAnnouncement: async (ann: Partial<ContentAnnouncement>): Promise<ContentAnnouncement> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const saved: ContentAnnouncement = {
        id: ann.id || `ann_${Date.now()}`,
        title: ann.title || '',
        message: ann.message || '',
        type: ann.type || 'INFO',
        isPublished: ann.isPublished !== undefined ? ann.isPublished : true,
        targetAudience: ann.targetAudience || 'ALL',
        createdAt: new Date().toISOString(),
      };
      MOCK_ANNOUNCEMENTS.unshift(saved);
      return saved;
    }
    const res = await apiClient.post<ContentAnnouncement>('/admin/content/announcements', ann);
    return res.data;
  },
};
