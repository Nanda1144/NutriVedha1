import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCartStore } from '../store/useCartStore';
import { userService } from '../services/userService';
import { ordersService } from '../services/ordersService';
import { UserAddress, Order } from '../types';

export const Checkout: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    userService.getAddresses().then((list) => {
      setAddresses(list);
      if (list.length > 0) {
        setSelectedAddressId(list[0].id);
      }
    });
  }, []);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 1000 ? 0 : 40;
  const discount = 50;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert('Please select or add a delivery address.');
      return;
    }

    const targetAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!targetAddress) return;

    setIsSubmitting(true);
    try {
      const order = await ordersService.createOrder({
        items,
        deliveryAddress: targetAddress,
        paymentMethod,
      });
      clearCart();
      navigate(`/orders/${order.id}/track`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Secure Checkout</h1>
        <p className="text-xs text-warm-brown mt-0.5">Confirm your delivery destination and select preferred payment gateway.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Address & Payment Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address Selection */}
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Select Delivery Destination</h3>
            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedAddressId === addr.id ? 'border-forest bg-cream/40' : 'border-soft-beige bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-0.5 text-forest focus:ring-forest"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-charcoal">{addr.city}, {addr.state}</p>
                    <p className="text-warm-brown">{addr.addressLine1} {addr.addressLine2}</p>
                    <p className="text-[11px] text-warm-brown">PIN: {addr.postalCode}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Payment Settlement</h3>
            <div className="space-y-2">
              {[
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm)' },
                { id: 'NetBanking', label: 'Direct Net Banking' },
                { id: 'Card', label: 'Credit or Debit Card' },
                { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)' },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === p.id ? 'border-forest bg-cream/40' : 'border-soft-beige bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === p.id}
                    onChange={() => setPaymentMethod(p.id as any)}
                    className="text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-charcoal">{p.label}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-2 border-b border-soft-beige">
              Order Breakdown
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-xs">
                  <span className="text-charcoal font-medium truncate max-w-[180px]">
                    {i.quantity}x {i.product.title}
                  </span>
                  <span className="text-warm-brown">₹{i.product.priceINR * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-soft-beige space-y-1.5 text-xs">
              <div className="flex justify-between text-warm-brown">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-warm-brown">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-forest font-semibold">
                <span>Ayurvedic Coupon</span>
                <span>-₹{discount}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-soft-beige flex justify-between items-center text-sm font-bold">
              <span>Payable Total</span>
              <span className="text-xl font-serif text-forest">₹{finalTotal}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Pay & Confirm Order
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};
