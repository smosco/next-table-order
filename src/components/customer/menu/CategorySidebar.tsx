'use client';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

export function CategorySidebar() {
  const { data: categories } = useCategories();
  const { activeCategory, setActiveCategory } = useCategoryStore();

  const scrollToCategory = (categoryName: string) => {
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    scrollToCategory(categoryName);
  };

  return (
    <div className='w-64 bg-white shadow-lg rounded-r-2xl overflow-hidden'>
      <ScrollArea className='h-full'>
        <nav className='p-4 space-y-2'>
          {categories?.map((category) => (
            <motion.button
              key={category.id}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ease-in-out',
                'text-toss-gray-700 hover:bg-toss-blue-light hover:text-toss-blue',
                activeCategory === category.id &&
                  'bg-toss-blue-light text-toss-blue font-medium'
              )}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category.name}
            </motion.button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
