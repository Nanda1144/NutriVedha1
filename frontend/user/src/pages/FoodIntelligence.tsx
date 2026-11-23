import React, { useState } from 'react';
import {
  Apple,
  Search,
  Sparkles,
  Flame,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { MOCK_FOODS } from '../services/mockData';
import { FoodItem } from '../types';

export const FoodIntelligence: React.FC = () => {
  const [foods] = useState<FoodItem[]>(MOCK_FOODS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);

  const categories = ['All', 'Herbs & Spices', 'Grains & Pulses', 'Fruits', 'Oils & Ghee'];

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || (f.sanskritName && f.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nutritional & Ayurvedic Knowledge Graph</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">Food & Botanical Intelligence</h1>
        <p className="text-xs text-warm-brown mt-0.5">Comprehensive nutritional facts calibrated with classical Rasa (taste), Virya (thermal potency), and Vipaka.</p>
      </div>

      {/* Search & Categories */}
      <Card className="p-4 space-y-3 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-warm-brown absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search botanical name (e.g., Amla, Haridra, Ghee)..."
            className="w-full bg-ivory rounded-xl border border-soft-beige pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex overflow-x-auto gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c ? 'bg-forest text-ivory' : 'bg-cream text-charcoal hover:bg-soft-beige'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Food Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFoods.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => setActiveFood(item)}
            className="p-5 cursor-pointer bg-white space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="neutral" size="sm">{item.category}</Badge>
                <span className="text-[11px] font-semibold text-olive">{item.ayurvedicProperties.virya} Potency</span>
              </div>
              <h3 className="text-base font-serif font-bold text-charcoal">
                {item.name} {item.sanskritName && <span className="text-warm-brown font-normal italic text-xs">({item.sanskritName})</span>}
              </h3>
              <p className="text-xs text-warm-brown line-clamp-2">{item.ayurvedicProperties.doshaEffect}</p>
            </div>

            <div className="pt-2 border-t border-soft-beige flex items-center justify-between text-xs text-warm-brown">
              <span>{item.nutritionalFacts.servingSize} • {item.nutritionalFacts.calories} kcal</span>
              <span className="text-forest font-semibold flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Food Detail Modal */}
      {activeFood && (
        <Modal
          isOpen={!!activeFood}
          onClose={() => setActiveFood(null)}
          title={activeFood.name}
          description={activeFood.sanskritName ? `Sanskrit: ${activeFood.sanskritName}` : activeFood.category}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs text-charcoal">
            {/* Ayurvedic Quad-Property Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-cream/50 rounded-xl border border-soft-beige">
                <span className="text-[10px] font-bold uppercase text-warm-brown block">Rasa (Taste)</span>
                <span className="font-semibold text-forest">{activeFood.ayurvedicProperties.rasa}</span>
              </div>
              <div className="p-3 bg-cream/50 rounded-xl border border-soft-beige">
                <span className="text-[10px] font-bold uppercase text-warm-brown block">Virya (Thermal Effect)</span>
                <span className="font-semibold text-forest">{activeFood.ayurvedicProperties.virya}</span>
              </div>
              <div className="p-3 bg-cream/50 rounded-xl border border-soft-beige">
                <span className="text-[10px] font-bold uppercase text-warm-brown block">Vipaka (Post-Digestive)</span>
                <span className="font-semibold text-forest">{activeFood.ayurvedicProperties.vipaka}</span>
              </div>
              <div className="p-3 bg-cream/50 rounded-xl border border-soft-beige">
                <span className="text-[10px] font-bold uppercase text-warm-brown block">Dosha Resonance</span>
                <span className="font-semibold text-forest">{activeFood.ayurvedicProperties.doshaEffect}</span>
              </div>
            </div>

            {/* Nutritional Facts */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Nutritional Breakdown ({activeFood.nutritionalFacts.servingSize})</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-ivory rounded-lg border border-soft-beige">
                  <span className="text-[10px] text-warm-brown block">Calories</span>
                  <span className="font-bold text-forest">{activeFood.nutritionalFacts.calories}</span>
                </div>
                <div className="p-2 bg-ivory rounded-lg border border-soft-beige">
                  <span className="text-[10px] text-warm-brown block">Protein</span>
                  <span className="font-bold text-forest">{activeFood.nutritionalFacts.proteinGrams}g</span>
                </div>
                <div className="p-2 bg-ivory rounded-lg border border-soft-beige">
                  <span className="text-[10px] text-warm-brown block">Carbs</span>
                  <span className="font-bold text-forest">{activeFood.nutritionalFacts.carbsGrams}g</span>
                </div>
                <div className="p-2 bg-ivory rounded-lg border border-soft-beige">
                  <span className="text-[10px] text-warm-brown block">Fat</span>
                  <span className="font-bold text-forest">{activeFood.nutritionalFacts.fatGrams}g</span>
                </div>
              </div>
            </div>

            {/* Therapeutic Uses */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Therapeutic Indications</h4>
              <ul className="list-disc list-inside text-warm-brown space-y-0.5">
                {activeFood.therapeuticUses.map((use, idx) => (
                  <li key={idx}>{use}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
