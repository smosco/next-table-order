'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { useCart } from '@/app/CartProvider';
import { Minus, Plus } from 'lucide-react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
};

export function MenuGrid() {
  const { categoryId } = useParams(); // URL에서 categoryId 가져오기
  const [menuItems, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchMenus() {
      setLoading(true);
      try {
        // `categoryId` 그대로 API 요청
        const categoryParam = categoryId ? `?categoryId=${categoryId}` : '';
        const response = await fetch(`/api/public/menus${categoryParam}`);
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();
  }, [categoryId]);

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity,
      });
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className='overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]'
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className='p-4'>
              <h3 className='font-semibold mb-1'>{item.name}</h3>
              <p className='text-sm text-muted-foreground mb-2'>
                {item.description}
              </p>
              <p className='font-medium'>{item.price.toLocaleString()} ₩</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className='sm:max-w-[425px]'>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className='flex items-center justify-between mt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                  <span className='w-8 text-center'>{quantity}</span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <Button onClick={handleAddToCart}>
                  Add to Order {selectedItem.price * quantity} ₩
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
