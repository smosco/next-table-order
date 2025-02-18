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

const ranges = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'week' },
  { label: 'Last 30 Days', value: 'month' },
  { label: 'This Year', value: 'year' },
];

export function SalesFilter({
  range,
  onChange,
}: {
  range: string;
  onChange: (range: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant='outline'
            className='bg-white text-toss-gray-700 border-toss-gray-200'
          >
            {ranges.find((r) => r.value === range)?.label || 'Select Range'}
            <ChevronDown className='ml-2 h-4 w-4 text-toss-gray-500' />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white border border-toss-gray-200 rounded-lg shadow-lg'>
        {ranges.map((r) => (
          <DropdownMenuItem
            key={r.value}
            onClick={() => onChange(r.value)}
            className='text-toss-gray-700 hover:bg-toss-blue-light hover:text-toss-blue transition-colors'
          >
            {r.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
