'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface OptionModalProps {
  open: boolean;
  onClose: () => void;
}

type OptionItem = {
  name: string;
  price: number;
};

export default function OptionModal({ open, onClose }: OptionModalProps) {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<OptionItem[]>([
    { name: '', price: 0 },
  ]);

  const handleAddOption = () => {
    setOptions([...options, { name: '', price: 0 }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleChangeOption = <K extends keyof OptionItem>(
    index: number,
    key: K,
    value: OptionItem[K]
  ) => {
    const newOptions = [...options];
    newOptions[index][key] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || options.length === 0) return;

    try {
      const res = await fetch('/api/admin/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          is_required: isRequired,
          options,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '등록 실패');
      }

      toast({ title: '옵션이 등록되었습니다' });
      setGroupName('');
      setOptions([{ name: '', price: 0 }]);
      setIsRequired(false);
      onClose();
    } catch (err) {
      toast({
        title: '에러',
        description: err instanceof Error ? err.message : '알 수 없는 에러',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>옵션 추가</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div>
            <Label>옵션 그룹</Label>
            <Input
              placeholder='예) 온도'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label>옵션이름</Label>
            {options.map((opt, i) => (
              <div key={i} className='flex gap-2 items-center'>
                <Input
                  placeholder='예) HOT'
                  value={opt.name}
                  onChange={(e) =>
                    handleChangeOption(i, 'name', e.target.value)
                  }
                  className='flex-1'
                />
                <Input
                  type='number'
                  value={opt.price}
                  onChange={(e) =>
                    handleChangeOption(i, 'price', Number(e.target.value))
                  }
                  className='w-24'
                />
                <span>원</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => handleRemoveOption(i)}
                >
                  <Trash2 className='w-4 h-4 text-gray-500' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='link'
              onClick={handleAddOption}
              className='text-sm text-blue-600 px-0'
            >
              + 추가하기
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <Switch
              checked={isRequired}
              onCheckedChange={setIsRequired}
              className='data-[state=checked]:bg-[#3182F6]'
            />
            <span className='text-sm'>이 옵션은 필수선택이에요</span>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>등록</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
