import React, { useState, useEffect } from 'react';
import { FileEdit, Plus, Trash2, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { adminContentService } from '../services/adminContentService';
import { ContentBanner, ContentFAQ, ContentAnnouncement } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'FAQS' | 'ANNOUNCEMENTS'>('BANNERS');
  const [banners, setBanners] = useState<ContentBanner[]>([]);
  const [faqs, setFaqs] = useState<ContentFAQ[]>([]);
  const [announcements, setAnnouncements] = useState<ContentAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Banner modal
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<ContentBanner>>({});

  // FAQ modal
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<ContentFAQ>>({});

  // Announcement modal
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Partial<ContentAnnouncement>>({});

  const { addToast } = useAdminNotificationStore();

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [b, f, a] = await Promise.all([
        adminContentService.getBanners(),
        adminContentService.getFAQs(),
        adminContentService.getAnnouncements(),
      ]);
      setBanners(b);
      setFaqs(f);
      setAnnouncements(a);
    } catch (e) {
      addToast('ERROR', 'Failed to load platform CMS records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminContentService.saveBanner(editingBanner);
      addToast('SUCCESS', 'Banner published to User Experience.');
      setBannerModalOpen(false);
      setEditingBanner({});
      loadContent();
    } catch (e) {
      addToast('ERROR', 'Failed to save banner.');
    }
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminContentService.saveFAQ(editingFaq);
      addToast('SUCCESS', 'FAQ saved successfully.');
      setFaqModalOpen(false);
      setEditingFaq({});
      loadContent();
    } catch (e) {
      addToast('ERROR', 'Failed to save FAQ.');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      await adminContentService.deleteFAQ(id);
      addToast('SUCCESS', 'FAQ entry removed.');
      loadContent();
    } catch (e) {
      addToast('ERROR', 'Failed to delete FAQ.');
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminContentService.saveAnnouncement(editingAnn);
      addToast('SUCCESS', 'Announcement published.');
      setAnnModalOpen(false);
      setEditingAnn({});
      loadContent();
    } catch (e) {
      addToast('ERROR', 'Failed to publish announcement.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Content Management (CMS)</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Curate Ayurvedic education, seasonal carousel banners, public health FAQs, and broadcast notices.
          </p>
        </div>
        <div className="flex rounded-lg border border-sand bg-cream/40 p-1 text-xs">
          {(['BANNERS', 'FAQS', 'ANNOUNCEMENTS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer capitalize ${
                activeTab === tab ? 'bg-forest text-ivory shadow-earth-sm' : 'text-charcoal'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Banners */}
      {activeTab === 'BANNERS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-charcoal">Public Website & App Banners</h3>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingBanner({ status: 'PUBLISHED', placement: 'HERO', priority: 1 });
                setBannerModalOpen(true);
              }}
            >
              Create New Banner
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((ban) => (
              <Card key={ban.id} className="overflow-hidden bg-white flex flex-col">
                <img src={ban.imageUrl} alt={ban.title} className="h-40 w-full object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant={ban.status === 'PUBLISHED' ? 'success' : 'neutral'}>
                        {ban.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-warm-brown uppercase">{ban.placement}</span>
                    </div>
                    <h4 className="font-bold text-sm text-charcoal">{ban.title}</h4>
                    <p className="text-xs text-warm-brown mt-1 leading-relaxed">{ban.subtitle}</p>
                  </div>
                  <div className="pt-2 border-t border-soft-beige flex items-center justify-between text-xs">
                    <span className="text-warm-brown">Target: <code className="text-charcoal">{ban.targetUrl}</code></span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBanner(ban);
                        setBannerModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: FAQs */}
      {activeTab === 'FAQS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-charcoal">Public Health & Ayurvedic FAQs</h3>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingFaq({ isPublished: true, category: 'AYURVEDA' });
                setFaqModalOpen(true);
              }}
            >
              Add New FAQ
            </Button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <Card key={f.id} className="p-4 bg-white flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{f.category}</Badge>
                    <span className="text-[11px] text-warm-brown">Order #{f.displayOrder}</span>
                  </div>
                  <h4 className="font-bold text-sm text-charcoal">{f.question}</h4>
                  <p className="text-xs text-warm-brown leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingFaq(f);
                      setFaqModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFAQ(f.id)}
                  >
                    <Trash2 className="w-4 h-4 text-state-error" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-charcoal">Public Announcements & Alerts</h3>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingAnn({ isPublished: true, type: 'INFO', targetAudience: 'ALL' });
                setAnnModalOpen(true);
              }}
            >
              Compose Announcement
            </Button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <Card key={ann.id} className="p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={ann.type === 'MAINTENANCE' ? 'warning' : 'info'}>
                    {ann.type}
                  </Badge>
                  <span className="text-[11px] text-warm-brown">Audience: {ann.targetAudience}</span>
                </div>
                <h4 className="font-bold text-sm text-charcoal">{ann.title}</h4>
                <p className="text-xs text-warm-brown leading-relaxed">{ann.message}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {bannerModalOpen && (
        <Modal
          isOpen={bannerModalOpen}
          onClose={() => setBannerModalOpen(false)}
          title="Configure Carousel Banner"
          maxWidth="md"
        >
          <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
            <Input
              label="Banner Title"
              value={editingBanner.title || ''}
              onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Subtitle / Description
              </label>
              <textarea
                value={editingBanner.subtitle || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
              />
            </div>
            <Input
              label="Target Click Route"
              value={editingBanner.targetUrl || ''}
              onChange={(e) => setEditingBanner({ ...editingBanner, targetUrl: e.target.value })}
              placeholder="/marketplace"
              required
            />
            <Input
              label="Image URL"
              value={editingBanner.imageUrl || ''}
              onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required
            />
            <Select
              label="Status"
              value={editingBanner.status || 'PUBLISHED'}
              onChange={(e) => setEditingBanner({ ...editingBanner, status: e.target.value as any })}
              options={[
                { value: 'PUBLISHED', label: 'Published (Live)' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setBannerModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save & Deploy Banner
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <Modal
          isOpen={faqModalOpen}
          onClose={() => setFaqModalOpen(false)}
          title="Ayurvedic FAQ Entry"
          maxWidth="md"
        >
          <form onSubmit={handleSaveFAQ} className="space-y-3 text-xs">
            <Input
              label="Question"
              value={editingFaq.question || ''}
              onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Answer (Ayurvedic Guidance)
              </label>
              <textarea
                value={editingFaq.answer || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
                required
              />
            </div>
            <Select
              label="Category"
              value={editingFaq.category || 'AYURVEDA'}
              onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
              options={[
                { value: 'AYURVEDA', label: 'Ayurveda & Doshas' },
                { value: 'GENERAL', label: 'AI Health Scan & Safety' },
                { value: 'ORDERS', label: 'Organic Marketplace & Herbs' },
                { value: 'TELEMEDICINE', label: 'Doctor Consultations' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setFaqModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save FAQ
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Announcement Modal */}
      {annModalOpen && (
        <Modal
          isOpen={annModalOpen}
          onClose={() => setAnnModalOpen(false)}
          title="Compose Announcement"
          maxWidth="md"
        >
          <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
            <Input
              label="Announcement Title"
              value={editingAnn.title || ''}
              onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Message Body
              </label>
              <textarea
                value={editingAnn.message || ''}
                onChange={(e) => setEditingAnn({ ...editingAnn, message: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
                required
              />
            </div>
            <Select
              label="Type"
              value={editingAnn.type || 'INFO'}
              onChange={(e) => setEditingAnn({ ...editingAnn, type: e.target.value as any })}
              options={[
                { value: 'INFO', label: 'Informational Notice' },
                { value: 'MAINTENANCE', label: 'Scheduled System Maintenance' },
                { value: 'PROMOTION', label: 'Seasonal Herb Harvest' },
                { value: 'CRITICAL', label: 'Critical Service Bulletin' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setAnnModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Publish Announcement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
