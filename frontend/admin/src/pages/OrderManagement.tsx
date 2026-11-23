import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  FileText,
  MapPin,
  Calendar
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { Pagination } from '../components/common/Pagination';
import { adminOrdersService } from '../services/adminOrdersService';
import { AdminOrder, OrderStatus } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Dispatch/Status update modal
  const [statusModalOrder, setStatusModalOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [isUpdating, setIsUpdating] = useState(false);

  const { addToast } = useAdminNotificationStore();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminOrdersService.getOrders({
        search,
        status: statusFilter,
        page,
        limit: 10,
      });
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      addToast('ERROR', 'Failed to fetch customer orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;
    setIsUpdating(true);
    try {
      await adminOrdersService.updateOrderStatus(
        statusModalOrder.id,
        newStatus,
        trackingNumber || undefined,
        carrier || undefined
      );
      addToast('SUCCESS', `Order ${statusModalOrder.orderNumber} updated to ${newStatus}.`);
      setStatusModalOrder(null);
      fetchOrders();
    } catch (e: any) {
      addToast('ERROR', e.message || 'Status update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<AdminOrder>[] = [
    {
      header: 'Order Number & Date',
      cell: (o) => (
        <div>
          <p className="font-bold text-forest">{o.orderNumber}</p>
          <p className="text-[11px] text-warm-brown">{new Date(o.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Customer Details',
      cell: (o) => (
        <div>
          <p className="font-semibold text-charcoal">{o.customerName}</p>
          <p className="text-[11px] text-warm-brown">{o.customerMobile}</p>
        </div>
      ),
    },
    {
      header: 'Items Count',
      cell: (o) => (
        <span className="text-xs text-charcoal font-medium">
          {o.items.reduce((acc, i) => acc + i.quantity, 0)} items ({o.items.length} lines)
        </span>
      ),
    },
    {
      header: 'Order Total',
      cell: (o) => (
        <div>
          <p className="font-bold text-charcoal">₹{o.totalAmount}</p>
          <p className="text-[10px] text-warm-brown">{o.paymentMethod}</p>
        </div>
      ),
    },
    {
      header: 'Payment Status',
      cell: (o) => (
        <Badge variant={o.paymentStatus === 'PAID' ? 'success' : o.paymentStatus === 'REFUNDED' ? 'warning' : 'danger'}>
          {o.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'Fulfillment Status',
      cell: (o) => {
        const variants: Record<OrderStatus, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
          DELIVERED: 'success',
          SHIPPED: 'info',
          PROCESSING: 'warning',
          CONFIRMED: 'neutral',
          PENDING: 'neutral',
          CANCELLED: 'danger',
        };
        return <Badge variant={variants[o.status]}>{o.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedOrder(o)}
            title="Inspect Invoice & Items"
          >
            <Eye className="w-4 h-4 text-forest" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusModalOrder(o);
              setNewStatus(o.status);
              setTrackingNumber(o.trackingNumber || '');
              setCarrier(o.carrier || 'BlueDart Express');
            }}
            title="Update Logistics Milestone"
          >
            <Truck className="w-4 h-4 text-warm-brown" />
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
          <h1 className="font-serif text-2xl font-bold text-forest">Order Management & Fulfillment</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Track farm-to-home apothecary orders, manage milestone logistics, and generate invoices.
          </p>
        </div>
        <div className="text-xs text-warm-brown">
          Total Orders in Ledger: <strong className="text-charcoal">{total}</strong>
        </div>
      </div>

      {/* Filter / Search */}
      <Card className="p-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by order #, customer name, mobile or tracking #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Order Statuses' },
              { value: 'CONFIRMED', label: 'Confirmed & Paid' },
              { value: 'PROCESSING', label: 'Batch Processing' },
              { value: 'SHIPPED', label: 'In Transit / Dispatched' },
              { value: 'DELIVERED', label: 'Delivered' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </form>
      </Card>

      {/* Orders Table */}
      <div className="space-y-0">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          keyExtractor={(o) => o.id}
          emptyMessage="No customer orders found matching current criteria."
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={10}
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Ledger: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-charcoal">
            {/* Header Meta */}
            <div className="p-3.5 rounded-xl bg-cream/40 border border-sand/50 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-forest">{selectedOrder.orderNumber}</p>
                <p className="text-[11px] text-warm-brown">Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <Badge variant="success">{selectedOrder.status}</Badge>
                <p className="text-[10px] text-warm-brown mt-0.5">Payment: {selectedOrder.paymentStatus}</p>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white border border-sand/60 space-y-1">
                <p className="font-semibold text-charcoal flex items-center gap-1.5">
                  <span>Customer Information</span>
                </p>
                <p className="text-charcoal font-medium">{selectedOrder.customerName}</p>
                <p className="text-warm-brown">{selectedOrder.customerEmail}</p>
                <p className="text-warm-brown">{selectedOrder.customerMobile}</p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-sand/60 space-y-1">
                <p className="font-semibold text-charcoal flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest" />
                  <span>Delivery Destination</span>
                </p>
                <p className="text-charcoal">{selectedOrder.shippingAddress.street}</p>
                <p className="text-warm-brown">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                {selectedOrder.trackingNumber && (
                  <p className="text-forest font-semibold mt-1">
                    Carrier: {selectedOrder.carrier} (Track: {selectedOrder.trackingNumber})
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-soft-beige rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-soft-beige text-left text-xs">
                <thead className="bg-cream/40 text-[10px] uppercase font-bold text-warm-brown">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Unit Price</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-beige/70">
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 font-medium text-charcoal">{item.name}</td>
                      <td className="px-3 py-2 text-center text-warm-brown">{item.quantity}</td>
                      <td className="px-3 py-2 text-right text-warm-brown">₹{item.unitPrice}</td>
                      <td className="px-3 py-2 text-right font-bold text-charcoal">₹{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Breakdown */}
            <div className="p-3 bg-cream/20 rounded-lg space-y-1 text-right text-xs">
              <p className="text-warm-brown">Subtotal: <span className="text-charcoal font-medium">₹{selectedOrder.subtotal}</span></p>
              <p className="text-warm-brown">GST: <span className="text-charcoal font-medium">₹{selectedOrder.tax}</span></p>
              <p className="text-warm-brown">Eco-Delivery: <span className="text-charcoal font-medium">₹{selectedOrder.deliveryFee}</span></p>
              <p className="text-sm font-bold text-forest pt-1 border-t border-sand/40">Total Amount: ₹{selectedOrder.totalAmount}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Logistics Milestone Modal */}
      {statusModalOrder && (
        <Modal
          isOpen={!!statusModalOrder}
          onClose={() => setStatusModalOrder(null)}
          title={`Update Fulfillment: ${statusModalOrder.orderNumber}`}
          maxWidth="md"
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
            <Select
              label="New Fulfillment Milestone"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              options={[
                { value: 'CONFIRMED', label: 'Confirmed & Paid' },
                { value: 'PROCESSING', label: 'Processing & Nitrogen Packing' },
                { value: 'SHIPPED', label: 'Dispatched / In Transit' },
                { value: 'DELIVERED', label: 'Delivered to Customer' },
                { value: 'CANCELLED', label: 'Cancelled & Voided' },
              ]}
            />

            <Input
              label="Logistics Carrier Name"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g. BlueDart Express or Delhivery"
            />

            <Input
              label="Consignment Tracking AWB #"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. NV-TRK-990142"
            />

            <div className="p-3 rounded-lg bg-cream/30 border border-sand/40 text-[11px] text-warm-brown leading-relaxed">
              Updating to <strong>SHIPPED</strong> will trigger real-time dispatch events to the User Frontend delivery tracking timeline view.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setStatusModalOrder(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isUpdating}>
                Commit Milestone Update
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
