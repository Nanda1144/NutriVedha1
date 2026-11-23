import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Package,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ordersService } from '../services/ordersService';
import { Order } from '../types';

export const DeliveryTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      ordersService.getOrderById(id).then((ord) => {
        if (ord) setOrder(ord);
        else ordersService.getMyOrders().then((all) => setOrder(all[0] || null));
      });
    } else {
      ordersService.getMyOrders().then((all) => setOrder(all[0] || null));
    }
  }, [id]);

  if (!order) {
    return (
      <div className="text-center py-12 text-warm-brown text-xs">
        Loading delivery timeline...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button & Header */}
      <div className="space-y-3">
        <Link to="/orders" className="inline-flex items-center text-xs font-semibold text-forest hover:underline gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">Delivery Progress Tracking</h1>
            <p className="text-xs text-warm-brown">Order #{order.orderNumber} • Estimated Delivery: {order.estimatedDeliveryDate}</p>
          </div>
          <Badge variant="forest" size="md">{order.orderStatus}</Badge>
        </div>
      </div>

      {/* 5-Step Milestone Stepper */}
      <Card className="p-6 sm:p-8 bg-white space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Milestone Progress</h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-soft-beige">
          {order.trackingTimeline.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-6 w-4 h-4 rounded-full border-2 transition-colors ${
                  step.completed ? 'bg-forest border-forest' : 'bg-white border-sand'
                }`}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-charcoal">{step.milestone}</h4>
                  <span className="text-[10px] text-warm-brown font-medium">({step.timestamp})</span>
                </div>
                <p className="text-xs text-olive font-medium">{step.location}</p>
                <p className="text-xs text-warm-brown leading-relaxed">{step.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Destination & Package Details Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-2 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
            <MapPin className="w-4 h-4 text-forest" />
            <span>Delivery Destination</span>
          </div>
          <p className="text-xs text-charcoal/90">{order.deliveryAddress.addressLine1}</p>
          <p className="text-[11px] text-warm-brown">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
        </Card>

        <Card className="p-5 space-y-2 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
            <Package className="w-4 h-4 text-forest" />
            <span>Package Contents</span>
          </div>
          <p className="text-xs text-charcoal/90 font-medium">
            {order.items.map((i) => `${i.productTitle} (x${i.quantity})`).join(', ')}
          </p>
          <p className="text-[11px] text-forest font-semibold">Total Paid: ₹{order.finalAmountINR}</p>
        </Card>
      </div>
    </div>
  );
};
