import { create } from 'zustand';

interface CategoryState {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
