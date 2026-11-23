import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ordersService } from '../services/ordersService';
import { Order } from '../types';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    ordersService.getMyOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">My Orders & Purchases</h1>
        <p className="text-xs text-warm-brown mt-0.5">Historical records of your certified organic herbs and farm-to-home deliveries.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-warm-brown text-xs">
            No orders found. Explore our organic herbal marketplace to place your first booking.
          </div>
        ) : (
          orders.map((ord) => (
            <Card key={ord.id} className="p-6 space-y-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-soft-beige">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">Order #{ord.orderNumber}</span>
                    <Badge variant="forest" size="sm">{ord.orderStatus}</Badge>
                  </div>
                  <p className="text-[11px] text-warm-brown">Placed on {new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-serif font-bold text-forest">₹{ord.finalAmountINR}</span>
                  <p className="text-[10px] text-olive font-semibold">{ord.paymentMethod} • {ord.paymentStatus}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt={item.productTitle} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-charcoal">{item.productTitle}</p>
                        <p className="text-[10px] text-warm-brown">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-charcoal">₹{item.subtotalINR}</span>
                  </div>
                ))}
              </div>

              {/* Destination & Tracking Button */}
              <div className="pt-3 border-t border-soft-beige flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <span className="text-warm-brown flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest" />
                  Delivering to: {ord.deliveryAddress.city}, PIN {ord.deliveryAddress.postalCode}
                </span>

                <Link to={`/orders/${ord.id}/track`}>
                  <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Track 5-Step Delivery
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
