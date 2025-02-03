'use client';

import { useState } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { Button } from '@/components/ui/button';

export function PaymentButton({
  tableId,
  cartItems,
}: {
  tableId: number;
  cartItems: any[];
}) {
  const { processPayment, loading, error } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (cartItems.length === 0) return alert('Cart is empty.');

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const data = await processPayment({
      tableId,
      items: cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      paymentMethod,
    });

    if (data) {
      setSuccessMessage(`Order successful! Order ID: ${data.orderId}`);
    }
  };

  return (
    <div>
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

      <Button
        onClick={handlePayment}
        disabled={loading}
        className='mt-4 w-full'
      >
        {loading ? 'Processing...' : 'Pay & Order'}
      </Button>
      {successMessage && <p className='text-green-500'>{successMessage}</p>}
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
