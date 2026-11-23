import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  ShoppingCart,
  Star,
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { marketplaceService } from '../services/marketplaceService';
import { useCartStore } from '../store/useCartStore';
import { Product, ProductCategory } from '../types';

export const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addItem, items } = useCartStore();

  useEffect(() => {
    loadCatalog();
  }, [selectedCategory, searchQuery, selectedSort]);

  const loadCatalog = async () => {
    const [cats, prods] = await Promise.all([
      marketplaceService.getCategories(),
      marketplaceService.getProducts({
        categoryId: selectedCategory,
        search: searchQuery,
        sort: selectedSort,
      }),
    ]);
    setCategories(cats);
    setProducts(prods);
  };

  const isProductInCart = (id: string) => {
    return items.some((i) => i.product.id === id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Organic Farm & Herb Marketplace</h1>
        <p className="text-xs text-warm-brown mt-0.5">100% lab-certified organic single botanicals, Vedic A2 bilona ghee, and farm crops direct from cultivators.</p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-warm-brown absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search herbs, farm origin (e.g., Kolar Ashwagandha, Amla, Ghee)..."
              className="w-full bg-ivory rounded-xl border border-soft-beige pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full bg-ivory rounded-xl border border-soft-beige px-3 py-2 text-xs text-charcoal"
            >
              <option value="default">Featured Ayurvedic Herbs</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-forest text-ivory' : 'bg-cream text-charcoal hover:bg-soft-beige'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id ? 'bg-forest text-ivory' : 'bg-cream text-charcoal hover:bg-soft-beige'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const inCart = isProductInCart(p.id);
          return (
            <Card key={p.id} hoverable className="p-0 overflow-hidden bg-white flex flex-col justify-between">
              <div>
                <div
                  className="h-48 w-full bg-cream relative cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProduct(p)}
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  {p.isOrganicCertified && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-forest text-ivory text-[10px] font-bold flex items-center gap-1 shadow-earth-sm">
                      <ShieldCheck className="w-3 h-3 text-sand" />
                      Organic Certified
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-warm-brown">
                    <span>{p.originRegion}</span>
                    <span className="flex items-center gap-1 text-[#A9761F] font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {p.rating}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(p)}
                    className="text-sm font-serif font-bold text-charcoal hover:text-forest transition-colors cursor-pointer"
                  >
                    {p.title}
                  </h3>

                  <p className="text-xs text-warm-brown line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-soft-beige flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-warm-brown block">{p.unit}</span>
                    <span className="text-base font-serif font-bold text-forest">₹{p.priceINR}</span>
                  </div>

                  <Button
                    size="sm"
                    variant={inCart ? 'secondary' : 'primary'}
                    onClick={() => addItem(p, 1)}
                    leftIcon={inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                  >
                    {inCart ? 'Added' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.title}
          description={`Origin: ${selectedProduct.originRegion} • ${selectedProduct.unit}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-charcoal">
            <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-52 object-cover rounded-xl" />
            <p className="leading-relaxed text-warm-brown">{selectedProduct.description}</p>
            <div className="space-y-1.5 p-3 bg-cream rounded-xl border border-soft-beige">
              <p><span className="font-semibold">Cultivator Collective:</span> {selectedProduct.farmerName}</p>
              <p><span className="font-semibold">Dosha Affinity:</span> {selectedProduct.doshaRecommendation.join(', ')}</p>
              <p><span className="font-semibold">Harvest Batch:</span> {selectedProduct.harvestDate}</p>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-soft-beige">
              <span className="text-xl font-serif font-bold text-forest">₹{selectedProduct.priceINR}</span>
              <Button
                size="sm"
                onClick={() => {
                  addItem(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
