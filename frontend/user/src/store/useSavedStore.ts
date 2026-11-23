import { create } from 'zustand';
import { Recipe, DietPlan, MedicalReport, Product } from '../types';
import { MOCK_RECIPES, MOCK_DIET_PLAN, MOCK_REPORTS, MOCK_PRODUCTS } from '../services/mockData';

interface SavedState {
  recipes: Recipe[];
  dietPlans: DietPlan[];
  reports: MedicalReport[];
  products: Product[];
  toggleRecipe: (recipe: Recipe) => void;
  toggleDietPlan: (plan: DietPlan) => void;
  toggleReport: (report: MedicalReport) => void;
  toggleProduct: (product: Product) => void;
  isRecipeSaved: (id: string) => boolean;
  isProductSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  recipes: [MOCK_RECIPES[0]],
  dietPlans: [MOCK_DIET_PLAN],
  reports: [MOCK_REPORTS[0]],
  products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]],

  toggleRecipe: (recipe) => {
    set((state) => {
      const exists = state.recipes.some((r) => r.id === recipe.id);
      return {
        recipes: exists ? state.recipes.filter((r) => r.id !== recipe.id) : [...state.recipes, recipe],
      };
    });
  },

  toggleDietPlan: (plan) => {
    set((state) => {
      const exists = state.dietPlans.some((d) => d.id === plan.id);
      return {
        dietPlans: exists ? state.dietPlans.filter((d) => d.id !== plan.id) : [...state.dietPlans, plan],
      };
    });
  },

  toggleReport: (report) => {
    set((state) => {
      const exists = state.reports.some((r) => r.id === report.id);
      return {
        reports: exists ? state.reports.filter((r) => r.id !== report.id) : [...state.reports, report],
      };
    });
  },

  toggleProduct: (product) => {
    set((state) => {
      const exists = state.products.some((p) => p.id === product.id);
      return {
        products: exists ? state.products.filter((p) => p.id !== product.id) : [...state.products, product],
      };
    });
  },

  isRecipeSaved: (id) => get().recipes.some((r) => r.id === id),
  isProductSaved: (id) => get().products.some((p) => p.id === id),
}));
