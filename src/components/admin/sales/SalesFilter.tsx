'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 기간 옵션
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
        <Button variant='outline'>
          {ranges.find((r) => r.value === range)?.label || 'Select Range'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ranges.map((r) => (
          <DropdownMenuItem key={r.value} onClick={() => onChange(r.value)}>
            {r.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
