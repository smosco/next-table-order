'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ranges = ['today', 'week', 'month', 'year'] as const;

export function SalesFilter({
  range,
  onChange,
}: {
  range: string;
  onChange: (range: string) => void;
}) {
  const t = useTranslations('SalesFilter');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant='outline'
            className='bg-white text-toss-gray-700 border-toss-gray-200'
          >
            {t(`ranges.${range}`) || t('selectRange')}
            <ChevronDown className='ml-2 h-4 w-4 text-toss-gray-500' />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white border border-toss-gray-200 rounded-lg shadow-lg'>
        {ranges.map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key)}
            className='text-toss-gray-700 hover:bg-toss-blue-light hover:text-toss-blue transition-colors'
          >
            {t(`ranges.${key}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
