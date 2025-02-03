'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function OrderButton({
  tableId,
  cartItems,
  onOrderSuccess,
}: {
  tableId: number;
  cartItems: { menuId: string; quantity: number; price: number }[];
  onOrderSuccess: (orderId: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  // totalPrice 계산 (각 아이템 가격 * 수량 합산)
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
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleOrder} disabled={loading || cartItems.length === 0}>
      {loading ? 'Processing...' : 'Place Order'}
    </Button>
  );
}
