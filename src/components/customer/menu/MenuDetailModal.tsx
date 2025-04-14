'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/CartProvider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';
import { track } from '@/lib/mixpanel';

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
  const t = useTranslations('MenuDetailModal');
  const { formatPriceLabel } = useFormatters();

  const queryClient = useQueryClient();
  const menu = queryClient.getQueryData<MenuItem>(['menu', menuId]); // Tanstack Query에서 데이터 가져오기

  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

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

    track('add_to_cart', {
      menuId: menu.id,
      menuName: menu.name,
      price: menu.price,
      quantity,
      totalPrice:
        menu.price * quantity +
        selectedOptionDetails.reduce((sum, o) => sum + o.price, 0),
      options: selectedOptionDetails.map((opt) => ({
        optionId: opt.id,
        optionName: opt.name,
        price: opt.price,
      })),
    });

    onClose();
    setQuantity(1);
    setSelectedOptions({});
  };

  return (
    <Dialog open={!!menuId} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[480px] max-h-[90vh] p-0 overflow-y-scroll bg-white'>
        <AnimatePresence>
          {menu ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex flex-col h-full'
            >
              <Image
                src={menu.image_url || '/placeholder.png'}
                alt={menu.name}
                width={480}
                height={480}
                className='w-full object-cover'
              />
              <DialogHeader className='p-6'>
                <DialogTitle className='text-3xl font-bold text-toss-gray-900'>
                  {menu.name}
                </DialogTitle>
                <p className='text-xl text-toss-gray-700 mt-2'>
                  {menu.description}
                </p>
              </DialogHeader>
              <ScrollArea className='flex-grow px-6 pb-6'>
                {menu?.option_groups?.map((group) => (
                  <div key={group.id} className='mb-6'>
                    <h3 className='text-xl font-semibold text-toss-gray-900 mb-3'>
                      {group.name}
                    </h3>
                    {group.max_select === 1 ? (
                      <RadioGroup
                        className='space-y-2'
                        value={selectedOptions[group.id]?.[0] || ''}
                        onValueChange={(value) =>
                          handleOptionChange(group.id, value, false)
                        }
                      >
                        {group.options.map((option) => (
                          <div key={option.id} className='flex items-center'>
                            <RadioGroupItem
                              value={option.id}
                              id={option.id}
                              className='h-5 w-5 border-toss-gray-300 text-toss-blue'
                            />
                            <label
                              htmlFor={option.id}
                              className='ml-3 text-toss-gray-700'
                            >
                              {option.name}
                              {option.price > 0 &&
                                ` (+${formatPriceLabel(option.price)})`}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className='space-y-2'>
                        {group.options.map((option) => (
                          <div key={option.id} className='flex items-center'>
                            <Checkbox
                              id={option.id}
                              checked={
                                selectedOptions[group.id]?.includes(
                                  option.id
                                ) || false
                              }
                              onCheckedChange={() =>
                                handleOptionChange(group.id, option.id, true)
                              }
                              className='h-8 w-8 border-toss-gray-300 text-toss-blue'
                            />
                            <label
                              htmlFor={option.id}
                              className='ml-3 text-xl text-toss-gray-700'
                            >
                              {option.name}
                              {option.price > 0 &&
                                ` (+${formatPriceLabel(option.price)})`}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
              <div className='p-6 bg-toss-gray-100 border-t border-toss-gray-200'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-12 w-12 rounded-full'
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus style={{ width: '24px', height: '24px' }} />
                    </Button>
                    <span className='w-10 text-center text-2xl font-semibold text-toss-gray-900'>
                      {quantity}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-12 w-12 rounded-full'
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus style={{ width: '24px', height: '24px' }} />
                    </Button>
                  </div>
                  <span className='text-2xl font-bold text-toss-blue'>
                    {formatPriceLabel(menu.price * quantity)}
                  </span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className='w-full h-14 text-xl bg-toss-blue hover:bg-toss-blue-dark text-white rounded-xl'
                >
                  {t('addToOrder')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex items-center justify-center h-64'
            >
              <p className='text-center text-xl text-toss-gray-600'>
                {t('loading')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
