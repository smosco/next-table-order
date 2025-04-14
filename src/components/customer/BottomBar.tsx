'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { OrderHistoryDrawer } from './order/OrderHistoryDrawer';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

export function BottomBar() {
  const t = useTranslations('BottomBar');
  const { formatPriceLabel } = useFormatters();
  const { total, setIsCartOpen } = useCart();
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    const storedTableId = localStorage.getItem('tableId');
    if (storedTableId) {
      setTableId(storedTableId);
    }
  }, [tableId]);

  return (
    <>
      <motion.div
        className='sticky bottom-0'
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className='max-w-7xl mx-auto px-4 py-5 flex justify-between items-center'>
          <Button
            className='flex-1 mr-2 h-12 text-lg font-semibold bg-toss-blue hover:bg-toss-blue-dark text-white rounded-xl transition-all duration-200 ease-in-out'
            onClick={() => setIsCartOpen(true)}
          >
            {total > 0
              ? t('orderNow', { total: formatPriceLabel(total) })
              : t('viewCart')}
          </Button>

          <Button
            className='h-12 text-lg font-semibold px-6 bg-toss-gray-200 hover:bg-toss-gray-300 text-toss-gray-700 rounded-xl transition-all duration-200 ease-in-out'
            onClick={() => setIsOrderHistoryOpen(true)}
          >
            {t('history')}
          </Button>
        </div>
      </motion.div>

      {isOrderHistoryOpen && (
        <OrderHistoryDrawer
          isOpen={isOrderHistoryOpen}
          setIsOpen={setIsOrderHistoryOpen}
          tableId={tableId}
        />
      )}
    </>
  );
}
