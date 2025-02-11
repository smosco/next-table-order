import { useQuery } from '@tanstack/react-query';

export type Category = { id: string; name: string };

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/public/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hr
  });
}
