import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  IndianRupee,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { Pagination } from '../components/common/Pagination';
import { adminMarketplaceService } from '../services/adminMarketplaceService';
import { AdminProduct, ProductCategory, StockStatus } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const MarketplaceAdmin: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Edit/Add Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const res = await adminMarketplaceService.getProducts({
        search,
        category: categoryFilter,
        status: statusFilter,
        page,
        limit: 10,
      });
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      addToast('ERROR', 'Failed to load apothecary product catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [page, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCatalog();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminMarketplaceService.saveProduct(editingProduct);
      addToast('SUCCESS', `Saved product "${editingProduct.name || 'Catalog Item'}".`);
      setProductModalOpen(false);
      setEditingProduct({});
      fetchCatalog();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this product from the central catalog?')) return;
    try {
      await adminMarketplaceService.deleteProduct(id);
      addToast('SUCCESS', 'Product retired from active catalog.');
      fetchCatalog();
    } catch (e) {
      addToast('ERROR', 'Failed to delete product.');
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      header: 'Herbal Item & Sanskrit Name',
      cell: (p) => (
        <div className="flex items-center gap-2.5">
          <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-sand/40" />
          <div>
            <p className="font-semibold text-charcoal">{p.name}</p>
            <p className="text-[11px] text-warm-brown italic">{p.sanskritName} • SKU: {p.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (p) => (
        <Badge variant="neutral">
          {p.category.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      header: 'Pricing',
      cell: (p) => (
        <div>
          <span className="font-bold text-forest">₹{p.discountPrice || p.price}</span>
          {p.discountPrice && (
            <span className="text-[11px] text-warm-brown line-through ml-1.5">₹{p.price}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Stock Inventory',
      cell: (p) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-charcoal">{p.stock} units</span>
          {p.stock === 0 && <Badge variant="danger" size="sm">Out of Stock</Badge>}
          {p.stock > 0 && p.stock < 20 && <Badge variant="warning" size="sm">Low Stock</Badge>}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (p) => (
        <Badge variant={p.status === 'IN_STOCK' ? 'success' : p.status === 'LOW_STOCK' ? 'warning' : 'danger'}>
          {p.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingProduct(p);
              setProductModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4 text-forest" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(p.id)}
          >
            <Trash2 className="w-4 h-4 text-state-error" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Herbal Marketplace & Apothecary</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Admin oversight of organic crops, classical formulations, inventory counts, and price tiers.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingProduct({
              status: 'IN_STOCK',
              category: 'HERBAL_SUPPLEMENTS',
              doshaTags: ['Tridoshic'],
              stock: 50,
            });
            setProductModalOpen(true);
          }}
        >
          Add Catalog Product
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by herb name, Sanskrit title, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Herbal Categories' },
              { value: 'HERBAL_SUPPLEMENTS', label: 'Herbal Supplements' },
              { value: 'AYURVEDIC_FOODS', label: 'Ayurvedic Foods & Ghee' },
              { value: 'ORGANIC_CROPS', label: 'Direct Farm Organic Crops' },
              { value: 'WELLNESS_OILS', label: 'Medicated Oils & Tailas' },
              { value: 'TEAS_INFUSIONS', label: 'Herbal Teas & Kwaths' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Stock Statuses' },
              { value: 'IN_STOCK', label: 'In Stock' },
              { value: 'LOW_STOCK', label: 'Low Stock (< 20)' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
            ]}
          />
        </form>
      </Card>

      {/* Products Table */}
      <div className="space-y-0">
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          keyExtractor={(p) => p.id}
          emptyMessage="No products found in this apothecary catalog filter."
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={10}
        />
      </div>

      {/* Product Add/Edit Modal */}
      {productModalOpen && (
        <Modal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          title={editingProduct.id ? 'Edit Catalog Formulation' : 'Add New Herbal Product'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Commercial Product Name"
                value={editingProduct.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
              <Input
                label="Classical Sanskrit / Botanical Name"
                value={editingProduct.sanskritName || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, sanskritName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Category"
                value={editingProduct.category || 'HERBAL_SUPPLEMENTS'}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                options={[
                  { value: 'HERBAL_SUPPLEMENTS', label: 'Herbal Supplements' },
                  { value: 'AYURVEDIC_FOODS', label: 'Ayurvedic Foods & Ghee' },
                  { value: 'ORGANIC_CROPS', label: 'Direct Farm Organic Crops' },
                  { value: 'WELLNESS_OILS', label: 'Medicated Oils & Tailas' },
                  { value: 'TEAS_INFUSIONS', label: 'Herbal Teas & Kwaths' },
                ]}
              />

              <Input
                label="Base Price (₹)"
                type="number"
                value={editingProduct.price || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                required
              />

              <Input
                label="Discounted Price (₹)"
                type="number"
                value={editingProduct.discountPrice || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) || undefined })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Stock Quantity"
                type="number"
                value={editingProduct.stock || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                required
              />

              <Input
                label="Inventory SKU"
                value={editingProduct.sku || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                placeholder="NV-ASH-001"
                required
              />

              <Select
                label="Catalog Status"
                value={editingProduct.status || 'IN_STOCK'}
                onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as StockStatus })}
                options={[
                  { value: 'IN_STOCK', label: 'In Stock' },
                  { value: 'LOW_STOCK', label: 'Low Stock' },
                  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
                  { value: 'DRAFT', label: 'Draft' },
                ]}
              />
            </div>

            <Input
              label="Product Image URL"
              value={editingProduct.imageUrl || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
                Dosha Therapeutic Description
              </label>
              <textarea
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-sand/70 p-2 text-xs text-charcoal focus:border-forest focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setProductModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
                Save Catalog Formulation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
