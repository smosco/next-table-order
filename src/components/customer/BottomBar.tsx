'use client';

import { useState } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart, History } from 'lucide-react';
import { OrderHistoryDrawer } from './order/OrderHistoryDrawer';
import { motion } from 'framer-motion';

export function BottomBar() {
  const { total, setIsCartOpen } = useCart();
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  return (
    <>
      <motion.div
        className='sticky bottom-0 bg-white shadow-lg rounded-t-2xl overflow-hidden'
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
          <Button
            className='flex-1 mr-2 bg-toss-blue hover:bg-toss-blue-dark text-white font-medium py-4 rounded-xl transition-all duration-200 ease-in-out'
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className='mr-2 w-5 h-5' />
            {total > 0 ? `Order Now ${total.toLocaleString()} ₩` : 'View Cart'}
          </Button>
          <Button
            className='bg-toss-gray-200 hover:bg-toss-gray-300 text-toss-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 ease-in-out'
            onClick={() => setIsOrderHistoryOpen(true)}
          >
            <History className='mr-2 w-5 h-5' />
            Order History
          </Button>
        </div>
      </motion.div>

      {isOrderHistoryOpen && (
        <OrderHistoryDrawer
          isOpen={isOrderHistoryOpen}
          setIsOpen={setIsOrderHistoryOpen}
          tableId={1}
        />
      )}
    </>
  );
}
