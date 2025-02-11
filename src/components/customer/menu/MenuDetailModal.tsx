'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/CartProvider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface Option {
  id: string;
  name: string;
  price: number;
}

interface OptionGroup {
  id: string;
  name: string;
  is_required: boolean;
  max_select: number;
  options: Option[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  option_groups: OptionGroup[];
}

export default function MenuDetailModal({
  menuId,
  onClose,
}: {
  menuId: string | null;
  onClose: () => void;
}) {
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // 선택된 옵션을 상태로 관리
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (!menuId) return;

    const fetchMenuDetail = async () => {
      try {
        const response = await fetch(`/api/public/menus/${menuId}`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error('Error fetching menu details:', error);
      }
    };

    fetchMenuDetail();
  }, [menuId]);

  // 옵션 선택 핸들러
  const handleOptionChange = (
    groupId: string,
    optionId: string,
    isMultiSelect: boolean
  ) => {
    setSelectedOptions((prev) => {
      if (isMultiSelect) {
        const selected = prev[groupId] || [];
        if (selected.includes(optionId)) {
          return {
            ...prev,
            [groupId]: selected.filter((id) => id !== optionId),
          };
        }
        return { ...prev, [groupId]: [...selected, optionId] };
      } else {
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const handleAddToCart = () => {
    if (!menu) return;

    const selectedOptionDetails = Object.entries(selectedOptions).flatMap(
      ([groupId, optionIds]) =>
        menu.option_groups
          .filter((group) => group.id === groupId)
          .flatMap((group) =>
            group.options.filter((option) => optionIds.includes(option.id))
          )
    );

    addItem({
      menuId: menu.id,
      name: menu.name,
      price: menu.price,
      quantity,
      options: selectedOptionDetails.map((opt) => ({
        optionId: opt.id,
        optionName: opt.name,
        price: opt.price,
      })),
    });

    onClose();
    setMenu(null);
    setQuantity(1);
    setSelectedOptions({});
  };

  return (
    <Dialog open={!!menuId} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {menu ? menu.name : 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        {menu ? (
          <>
            <Image
              src={menu.image_url || '/placeholder.png'}
              alt={menu.name}
              width={343}
              height={160}
              className='w-full h-48 object-cover rounded-md mb-4'
            />
            <DialogDescription className='text-base'>
              {menu.description}
            </DialogDescription>

            {/* 옵션 선택 UI */}
            {menu?.option_groups?.map((group) => (
              <div key={group.id} className='mt-4'>
                <h3 className='text-lg font-semibold'>{group.name}</h3>

                {group.max_select === 1 ? (
                  <RadioGroup
                    className='mt-2 space-y-2'
                    value={selectedOptions[group.id]?.[0] || ''}
                    onValueChange={(value) =>
                      handleOptionChange(group.id, value, false)
                    }
                  >
                    {group.options.map((option) => (
                      <div key={option.id} className='flex items-center gap-2'>
                        <RadioGroupItem value={option.id} id={option.id} />
                        <label htmlFor={option.id} className='text-sm'>
                          {option.name}{' '}
                          {option.price > 0 ? `(+${option.price}₩)` : ''}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className='mt-2 space-y-2'>
                    {group.options.map((option) => (
                      <div key={option.id} className='flex items-center gap-2'>
                        <Checkbox
                          checked={
                            selectedOptions[group.id]?.includes(option.id) ||
                            false
                          }
                          onCheckedChange={() =>
                            handleOptionChange(group.id, option.id, true)
                          }
                        />
                        <span className='text-sm'>
                          {option.name}{' '}
                          {option.price > 0 ? `(+${option.price}₩)` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 수량 & 장바구니 버튼 */}
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
                Add to Order {menu.price * quantity}₩
              </Button>
            </div>
          </>
        ) : (
          <p className='text-center text-lg'>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
