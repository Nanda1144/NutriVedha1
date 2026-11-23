import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, UtensilsCrossed, FileText, Store, Trash2, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useSavedStore } from '../store/useSavedStore';

export const SavedItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'dietPlans' | 'reports' | 'products'>('recipes');
  const { recipes, dietPlans, reports, products, toggleRecipe, toggleDietPlan, toggleReport, toggleProduct } = useSavedStore();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Saved Wellness Vault</h1>
        <p className="text-xs text-warm-brown mt-0.5">Quick access to your bookmarked Ayurvedic recipes, custom meal schedules, and favorite organic herbs.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-soft-beige gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`pb-3 whitespace-nowrap transition-colors ${activeTab === 'recipes' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Saved Recipes ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('dietPlans')}
          className={`pb-3 whitespace-nowrap transition-colors ${activeTab === 'dietPlans' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Saved Diet Plans ({dietPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 whitespace-nowrap transition-colors ${activeTab === 'reports' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Bookmarked Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 whitespace-nowrap transition-colors ${activeTab === 'products' ? 'text-forest border-b-2 border-forest font-bold' : 'text-warm-brown'}`}
        >
          Herbs Wishlist ({products.length})
        </button>
      </div>

      {/* Tab: Recipes */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.length === 0 ? (
            <div className="text-center py-12 text-warm-brown text-xs col-span-2">No saved recipes.</div>
          ) : (
            recipes.map((r) => (
              <Card key={r.id} className="p-4 flex justify-between items-start gap-4 bg-white">
                <div className="space-y-1">
                  <Badge variant="neutral" size="sm">{r.category}</Badge>
                  <h3 className="text-sm font-semibold text-charcoal">{r.title}</h3>
                  <p className="text-xs text-warm-brown">{r.prepTimeMinutes + r.cookTimeMinutes} mins • {r.caloriesPerServing} kcal</p>
                  <Link to="/recipes" className="text-xs text-forest font-semibold hover:underline inline-block pt-1">
                    View Recipe →
                  </Link>
                </div>
                <button
                  onClick={() => toggleRecipe(r)}
                  className="p-1.5 text-warm-brown hover:text-state-error"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab: Diet Plans */}
      {activeTab === 'dietPlans' && (
        <div className="space-y-4">
          {dietPlans.length === 0 ? (
            <div className="text-center py-12 text-warm-brown text-xs">No saved diet plans.</div>
          ) : (
            dietPlans.map((d) => (
              <Card key={d.id} className="p-5 flex justify-between items-center gap-4 bg-white">
                <div className="space-y-1">
                  <Badge variant="forest" size="sm">Target: {d.targetDosha}</Badge>
                  <h3 className="text-sm font-semibold text-charcoal">{d.title}</h3>
                  <p className="text-xs text-warm-brown">Budget: ₹{d.budgetWeeklyINR} / week • 7 Days Program</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/diet">
                    <Button size="sm" variant="outline">Open Plan</Button>
                  </Link>
                  <button
                    onClick={() => toggleDietPlan(d)}
                    className="p-1.5 text-warm-brown hover:text-state-error"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => (
            <Card key={rep.id} className="p-4 flex justify-between items-center bg-white">
              <div className="space-y-1">
                <Badge variant="neutral" size="sm">{rep.reportType}</Badge>
                <h3 className="text-xs font-semibold text-charcoal">{rep.reportTitle}</h3>
                <p className="text-[11px] text-warm-brown">Uploaded: {rep.dateUploaded}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/reports">
                  <Button size="sm" variant="ghost">View in Vault</Button>
                </Link>
                <button onClick={() => toggleReport(rep)} className="p-1.5 text-warm-brown hover:text-state-error">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Products */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="p-4 flex items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-3">
                <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-xs font-semibold text-charcoal">{p.title}</h3>
                  <p className="text-xs text-forest font-bold">₹{p.priceINR}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/marketplace">
                  <Button size="sm" variant="outline">Buy Now</Button>
                </Link>
                <button onClick={() => toggleProduct(p)} className="p-1.5 text-warm-brown hover:text-state-error">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
