import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  Flame,
  Utensils,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { MOCK_RECIPES } from '../services/mockData';
import { Recipe } from '../types';
import { useSavedStore } from '../store/useSavedStore';

export const RecipeGenerator: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  const { toggleRecipe, isRecipeSaved } = useSavedStore();

  const categories = ['All', 'Kitchari & Grains', 'Herbal Infusion', 'Digestive Soup', 'Sattvic Main'];

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ayurvedic Culinary Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">AI Recipe Generator & Pantry Search</h1>
        <p className="text-xs text-warm-brown mt-0.5">Explore therapeutic recipes formulated with classical digestive spices and dosha balancing affinities.</p>
      </div>

      {/* Search and Category Filters */}
      <Card className="p-4 space-y-3 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-warm-brown absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by recipe name or pantry ingredients (e.g., moong, turmeric, ginger)..."
            className="w-full bg-ivory rounded-xl border border-soft-beige pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-forest text-ivory'
                  : 'bg-cream text-charcoal hover:bg-soft-beige'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const isSaved = isRecipeSaved(recipe.id);
          return (
            <Card key={recipe.id} hoverable className="p-0 overflow-hidden bg-white flex flex-col justify-between">
              <div>
                <div className="h-44 w-full overflow-hidden relative bg-cream">
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggleRecipe(recipe)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-charcoal hover:text-forest shadow-earth-sm"
                    title={isSaved ? 'Remove from saved' : 'Save recipe'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-forest text-forest' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {recipe.doshaAffinity.map((d) => (
                      <Badge key={d} variant={d.toLowerCase() as any} size="sm">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-serif font-semibold text-charcoal">{recipe.title}</h3>
                  <p className="text-xs text-warm-brown line-clamp-2 leading-relaxed">{recipe.description}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-warm-brown border-t border-soft-beige/70">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-forest" />
                      {recipe.caloriesPerServing} kcal / serving
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveRecipe(recipe)}
                  className="w-full"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  View Ingredients & Steps
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recipe Detail Modal */}
      {activeRecipe && (
        <Modal
          isOpen={!!activeRecipe}
          onClose={() => setActiveRecipe(null)}
          title={activeRecipe.title}
          description={`${activeRecipe.category} • Prep: ${activeRecipe.prepTimeMinutes}m • Cook: ${activeRecipe.cookTimeMinutes}m`}
          maxWidth="xl"
        >
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <p className="text-xs text-warm-brown leading-relaxed">{activeRecipe.description}</p>

            {/* Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Ingredients</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal">
                {activeRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-cream/50 border border-soft-beige flex justify-between">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-warm-brown">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Ayurvedic Cooking Steps</h4>
              <ol className="space-y-2 text-xs text-warm-brown">
                {activeRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="font-bold text-forest shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits */}
            <div className="p-3 bg-ivory rounded-xl border border-sand space-y-1">
              <h5 className="text-[11px] font-bold text-forest uppercase tracking-wider">Ayurvedic Clinical Virtues</h5>
              <ul className="list-disc list-inside text-xs text-warm-brown space-y-0.5">
                {activeRecipe.ayurvedicBenefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
