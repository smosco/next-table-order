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
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

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
  const t = useTranslations('PaymentModal');
  const { formatPriceLabel } = useFormatters();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
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

      alert(t('success'));
      clearCart();
      onClose();
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <p className='text-base text-toss-gray-900 font-semibold mb-4'>
          {t('total')}: {formatPriceLabel(totalPrice)}
        </p>

        <div className='flex gap-2 mb-4'>
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('card')}
          >
            {t('card')}
          </Button>
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('cash')}
          >
            {t('cash')}
          </Button>
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <Button
          onClick={handlePayment}
          disabled={loading}
          className='mt-2 w-full'
        >
          {loading ? t('loading') : t('submit')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
