import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MOCK_FOODS, MOCK_RECIPES, MOCK_DOCTORS, MOCK_PRODUCTS } from '../services/mockData';

export const GlobalSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const q = query.toLowerCase().trim();

  const matchingFoods = MOCK_FOODS.filter((f) => !q || f.name.toLowerCase().includes(q) || f.sanskritName?.toLowerCase().includes(q));
  const matchingRecipes = MOCK_RECIPES.filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  const matchingDoctors = MOCK_DOCTORS.filter((d) => !q || d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
  const matchingProducts = MOCK_PRODUCTS.filter((p) => !q || p.title.toLowerCase().includes(q) || p.originRegion.toLowerCase().includes(q));

  const totalResults = matchingFoods.length + matchingRecipes.length + matchingDoctors.length + matchingProducts.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Global Wellness Discovery</h1>
        <p className="text-xs text-warm-brown mt-0.5">Search seamlessly across herbal encyclopedias, doctors, recipes, and organic crops.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-5 h-5 text-warm-brown absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods, symptoms, herbs, doctors (e.g., Ashwagandha, Pitta, Kitchari)..."
          className="w-full bg-white rounded-2xl border border-soft-beige pl-12 pr-28 py-3.5 text-sm text-charcoal focus:outline-none focus:border-forest shadow-earth-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-forest text-ivory text-xs font-semibold rounded-xl hover:bg-forest-hover"
        >
          Search
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Herbs & Products', 'Recipes', 'Doctors', 'Food Encyclopedia'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === t ? 'bg-forest text-ivory' : 'bg-cream text-charcoal hover:bg-soft-beige'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <p className="text-xs text-warm-brown">Showing {totalResults} results for "{query || 'all'}"</p>

        {/* Products Results */}
        {(filterType === 'All' || filterType === 'Herbs & Products') && matchingProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Organic Herbs & Crops</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingProducts.map((p) => (
                <Link key={p.id} to="/marketplace" className="earth-card p-4 flex items-center justify-between hover:border-forest bg-white">
                  <div>
                    <h4 className="text-xs font-semibold text-charcoal">{p.title}</h4>
                    <p className="text-[11px] text-warm-brown">{p.originRegion} • ₹{p.priceINR}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-forest" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recipes Results */}
        {(filterType === 'All' || filterType === 'Recipes') && matchingRecipes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Ayurvedic Recipes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingRecipes.map((r) => (
                <Link key={r.id} to="/recipes" className="earth-card p-4 flex items-center justify-between hover:border-forest bg-white">
                  <div>
                    <h4 className="text-xs font-semibold text-charcoal">{r.title}</h4>
                    <p className="text-[11px] text-warm-brown">{r.category} • {r.caloriesPerServing} kcal</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-forest" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Results */}
        {(filterType === 'All' || filterType === 'Doctors') && matchingDoctors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Verified Doctors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingDoctors.map((d) => (
                <Link key={d.id} to="/telemedicine" className="earth-card p-4 flex items-center justify-between hover:border-forest bg-white">
                  <div>
                    <h4 className="text-xs font-semibold text-charcoal">{d.name}</h4>
                    <p className="text-[11px] text-olive font-medium">{d.specialization}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-forest" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
