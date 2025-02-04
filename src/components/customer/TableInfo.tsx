'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function TableInfo() {
  return (
    <div className='flex items-center justify-between p-6 border-b'>
      <Select defaultValue='en'>
        <SelectTrigger className='w-[180px] text-base'>
          <Globe className='mr-2 h-5 w-5' />
          <SelectValue placeholder='Language' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ko'>한국어</SelectItem>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='ja'>日本語</SelectItem>
          <SelectItem value='zh'>中文</SelectItem>
        </SelectContent>
      </Select>
      <div className='flex items-center gap-3'>
        <span className='text-lg text-muted-foreground'>Table</span>
        <span className='font-bold text-2xl text-primary'>102</span>
      </div>
    </div>
  );
}
