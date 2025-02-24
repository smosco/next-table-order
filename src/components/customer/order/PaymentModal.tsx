'use client';

import { useState } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';

export function PaymentModal({
  orderId,
  totalPrice,
  isOpen,
  onClose,
}: {
  orderId: string;
  totalPrice: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/public/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert('Payment successful!');

      // 주문 완료 후 장바구니 비우기
      clearCart();
      onClose();
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        <p>Total Amount: {totalPrice.toLocaleString()} ₩</p>
        <div className='flex gap-2'>
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('card')}
          >
            Card
          </Button>
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash
          </Button>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <Button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
