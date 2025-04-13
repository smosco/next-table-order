'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ranges = ['today', 'week', 'month'] as const;

export function SalesFilter({
  range,
  onChange,
}: {
  range: string;
  onChange: (range: string) => void;
}) {
  const t = useTranslations('SalesFilter');

  return (
    <div className='flex gap-4'>
      {ranges.map((key) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(key)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            range === key
              ? 'bg-toss-gray-100 text-toss-gray-900 font-bold'
              : 'text-toss-gray-700 hover:text-toss-gray-900 hover:bg-toss-gray-50'
          )}
        >
          {t(`ranges.${key}`)}
        </motion.button>
      ))}
    </div>
  );
}
