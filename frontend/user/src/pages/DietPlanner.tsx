import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  RefreshCw,
  Bookmark,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MOCK_DIET_PLAN } from '../services/mockData';
import { DietPlan, MealItem } from '../types';
import { useSavedStore } from '../store/useSavedStore';

export const DietPlanner: React.FC = () => {
  const [dietPlan, setDietPlan] = useState<DietPlan>(MOCK_DIET_PLAN);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { toggleDietPlan, dietPlans } = useSavedStore();
  const isPlanSaved = dietPlans.some((p) => p.id === dietPlan.id);

  const currentDay = dietPlan.weeklyPlan[selectedDayIndex] || dietPlan.weeklyPlan[0];

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsRegenerating(false);
  };

  const handleSaveToggle = () => {
    toggleDietPlan(dietPlan);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updatedWeekly = dietPlan.weeklyPlan.map((d, idx) => {
      if (idx === selectedDayIndex) {
        return {
          ...d,
          meals: d.meals.filter((m) => m.id !== mealId),
        };
      }
      return d;
    });
    setDietPlan({ ...dietPlan, weeklyPlan: updatedWeekly });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurvedic Ahara Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{dietPlan.title}</h1>
          <p className="text-xs text-warm-brown mt-0.5">Budget-calibrated 7-day nutritional regimen tailored to pacify {dietPlan.targetDosha} bio-energy.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Regenerate
          </Button>
          <Button
            size="sm"
            onClick={handleSaveToggle}
            leftIcon={<Bookmark className={`w-4 h-4 ${isPlanSaved ? 'fill-current' : ''}`} />}
          >
            {isPlanSaved ? 'Saved in Vault' : 'Save Plan'}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-state-success/10 border border-state-success/30 text-[#2F7A4D] rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-state-success" />
          <span>7-Day Diet Plan bookmarked to your Saved Vault.</span>
        </div>
      )}

      {/* Plan Overview Banner */}
      <Card className="p-5 bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="pitta" size="md">Target: {dietPlan.targetDosha} Balanced</Badge>
          <span className="text-xs text-warm-brown font-medium">Weekly Estimated Budget: ₹{dietPlan.budgetWeeklyINR}</span>
          {dietPlan.doctorVerified && (
            <Badge variant="success" size="sm">Doctor Verified</Badge>
          )}
        </div>
        <div className="text-xs text-warm-brown">
          <span>Daily Herbal Tea: </span>
          <span className="font-semibold text-charcoal">{currentDay.dailyHerbalTea}</span>
        </div>
      </Card>

      {/* Day Selector Pills */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {dietPlan.weeklyPlan.map((day, idx) => (
          <button
            key={day.dayName}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDayIndex === idx
                ? 'bg-forest text-ivory shadow-earth-sm'
                : 'bg-cream text-charcoal hover:bg-soft-beige'
            }`}
          >
            {day.dayName}
          </button>
        ))}
      </div>

      {/* Meals for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
            {currentDay.dayName} Schedule ({currentDay.meals.length} Meals)
          </h2>
          <span className="text-xs text-warm-brown font-medium">Total Daily: {currentDay.totalCalories} kcal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDay.meals.map((meal) => (
            <Card key={meal.id} className="p-5 space-y-3 bg-white relative">
              <div className="flex items-center justify-between">
                <Badge variant={meal.timeSlot === 'Lunch' ? 'forest' : 'neutral'} size="sm">
                  {meal.timeSlot}
                </Badge>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="text-warm-brown hover:text-state-error p-1 rounded transition-colors"
                  title="Remove meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-charcoal">{meal.name}</h3>
                <p className="text-xs text-warm-brown mt-1 leading-relaxed">{meal.description}</p>
              </div>

              <div className="pt-2 border-t border-soft-beige flex items-center justify-between text-xs text-warm-brown">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-forest" />
                  <span>{meal.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-warm-brown" />
                  <span>{meal.prepTimeMinutes} mins prep</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {meal.herbsUsed.map((h) => (
                  <span key={h} className="px-2 py-0.5 rounded bg-cream text-[10px] text-forest font-medium">
                    +{h}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Grocery List Module */}
      <Card className="p-6 space-y-4 bg-cream/30 border border-sand">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-forest" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">Recommended Weekly Grocery Basket</h3>
        </div>
        <p className="text-xs text-warm-brown">Staples needed to prepare this 7-day Ayurvedic regimen:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {dietPlan.groceryList.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-white rounded-xl border border-soft-beige text-xs text-charcoal flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
