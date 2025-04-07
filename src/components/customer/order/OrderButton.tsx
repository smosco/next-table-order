'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function OrderButton({
  tableId,
  cartItems,
  onOrderSuccess,
}: {
  tableId: number;
  cartItems: { menuId: string; quantity: number; price: number }[];
  onOrderSuccess: (orderId: string) => void;
}) {
  const t = useTranslations('OrderButton');
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    setLoading(true);
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
    <Button onClick={handleOrder} disabled={loading || cartItems.length === 0}>
      {loading ? t('loading') : t('submit')}
    </Button>
  );
}
