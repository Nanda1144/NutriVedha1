import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useCartStore } from '../store/useCartStore';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 40;
  const discount = subtotal > 500 ? 50 : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8 text-forest" />}
          title="Your Shopping Cart is Empty"
          description="Discover authentic single herbs, cold-pressed oils, and certified organic farm staples."
          actionLabel="Explore Herb Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Your Ayurvedic Cart</h1>
        <p className="text-xs text-warm-brown mt-0.5">{items.length} unique items reserved directly from organic collectives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <Card key={item.product.id} className="p-4 flex items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-soft-beige"
                />
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-charcoal">{item.product.title}</h3>
                  <p className="text-[11px] text-warm-brown">{item.product.unit} • ₹{item.product.priceINR}</p>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-soft-beige rounded-xl bg-ivory p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 text-warm-brown hover:text-charcoal"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-charcoal">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 text-warm-brown hover:text-charcoal"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-xs font-serif font-bold text-forest w-16 text-right">
                  ₹{item.product.priceINR * item.quantity}
                </span>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1.5 text-warm-brown hover:text-state-error"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-2 border-b border-soft-beige">
              Cart Summary
            </h3>

            <div className="space-y-2 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-warm-brown">Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-brown">Estimated Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-forest font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-forest font-semibold">
                  <span>Ayurvedic Wellness Coupon</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-soft-beige flex justify-between items-center text-sm font-bold text-charcoal">
              <span>Final Total</span>
              <span className="text-lg font-serif text-forest">₹{finalTotal}</span>
            </div>

            <Link to="/checkout" className="block pt-2">
              <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>

            <div className="pt-2 text-[10px] text-warm-brown flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Direct farmer support • Verified botanical purity</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
