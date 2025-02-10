'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/CartProvider';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
}

export function MenuGrid() {
  const router = useRouter();
  const [menuItems, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/public/menus`);
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const groupedMenus = useMemo(() => {
    return menuItems.reduce<{ [key: string]: MenuItem[] }>((acc, item) => {
      if (!acc[item.category_id]) acc[item.category_id] = [];
      acc[item.category_id].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const handleScroll = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!menuRef.current) return;

      const sections = document.querySelectorAll("[id^='category-']");
      let currentCategory = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentCategory = section.id.replace('category-', '');
        }
      });

      if (currentCategory) {
        router.replace(`/customer/menu#${currentCategory}`, { scroll: false });
      }
    }, 200);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    const ref = menuRef.current;

    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addItem({
      menuId: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      optionSelections: [],
    });

    setSelectedItem(null);
    setQuantity(1);
  };

  return (
    <div
      ref={menuRef}
      className='p-4 h-[900px] overflow-y-auto border border-gray-400'
    >
      {Object.entries(groupedMenus).map(([category, items]) => (
        <div key={category} id={`category-${category}`} className='mb-8'>
          <h2 className='text-2xl font-bold mb-4'>{category}</h2>
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {items.map((item) => (
              <Card
                key={item.id}
                className='overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src='/placeholder.png'
                  alt={item.name}
                  width={343}
                  height={160}
                  className='w-full h-40 object-cover'
                />
                <CardContent className='p-4'>
                  <h3 className='text-lg font-semibold mb-2'>{item.name}</h3>
                  <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                    {item.description}
                  </p>
                  <div className='flex justify-between items-center'>
                    <Badge variant='secondary' className='text-lg'>
                      {item.price.toLocaleString()} ₩
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className='sm:max-w-[425px]'>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold'>
                  {selectedItem.name}
                </DialogTitle>
                <Image
                  src='https://olo-images-live.imgix.net/28/288c61191b7c4deba30de5d6e7a62618.png'
                  alt={selectedItem.name}
                  width={343}
                  height={160}
                  className='w-full h-48 object-cover rounded-md mb-4'
                />
                <DialogDescription className='text-base'>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className='flex items-center justify-between mt-6'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                  <span className='w-8 text-center text-lg font-semibold'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <Button onClick={handleAddToCart} className='text-lg px-6 py-2'>
                  Add to Order {selectedItem.price * quantity} ₩
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
