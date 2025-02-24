import { useState } from 'react';
import { useCart } from '@/app/CartProvider';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  const processPayment = async ({
    tableId,
    items,
    totalPrice,
    paymentMethod,
  }: {
    tableId: number;
    items: { menuId: string; quantity: number; price: number }[];
    totalPrice: number;
    paymentMethod: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/public/payments/checkout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, items, totalPrice, paymentMethod }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 주문 성공 시 카트 비우기
      clearCart();

      return data; // 주문 성공 시 주문 ID 반환
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading, error };
}
