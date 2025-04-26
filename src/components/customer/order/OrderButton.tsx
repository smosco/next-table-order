'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { track } from '@/lib/mixpanel';

export function OrderButton({
  tableId,
  cartItems,
  onOrderSuccess,
}: {
  tableId: number;
  cartItems: {
    menuId: string;
    name: string;
    options: { optionId: string; optionName: string; price: number }[];
    price: number;
    quantity: number;
  }[];
  onOrderSuccess: (orderId: string) => void;
}) {
  const t = useTranslations('OrderButton');
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  console.log(cartItems);

  const handleOrder = async () => {
    setLoading(true);

    track('checkout_started', {
      itemCount: cartItems.length,
      totalPrice,
      tableId,
      items: cartItems.map((item) => ({
        menuId: item.menuId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options.map((opt) => opt.optionName),
      })),
    });

    try {
      const response = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, items: cartItems, totalPrice }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onOrderSuccess(data.orderId);
    } catch (error: any) {
      console.error('Order error:', error);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOrder}
      disabled={loading || cartItems.length === 0}
      className='w-full py-6 text-lg font-medium rounded-xl'
    >
      {loading ? t('loading') : t('submit')}
    </Button>
  );
}
