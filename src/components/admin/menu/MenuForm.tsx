'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import type { MenuItem, Category, OptionGroup, Option } from '@/types/schema';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type MenuStatus = 'available' | 'sold_out' | 'hidden';

export default function MenuForm({
  onMenuUpdated,
  menuToEdit,
}: {
  onMenuUpdated: () => void;
  menuToEdit?: MenuItem | null;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [formData, setFormData] = useState<MenuItem>({
    id: menuToEdit?.id || '',
    name: menuToEdit?.name || '',
    description: menuToEdit?.description || '',
    price: menuToEdit?.price || 0,
    image: menuToEdit?.image || undefined,
    image_url: menuToEdit?.image_url || undefined,
    category_id: menuToEdit?.category_id || '',
    options: menuToEdit?.options?.map((group) => ({
      ...group,
      options: group.options.map((option) => ({ ...option })),
    })) || [
      {
        id: '1',
        name: 'Option Group 1',
        is_required: false,
        max_select: 1,
        options: [{ id: '1', name: 'Option 1', price: 0 }],
      },
    ],
    status: menuToEdit?.status || 'hidden',
  });

  console.log(menuToEdit);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch('/api/public/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error fetching categories',
          description:
            'There was an error fetching the categories. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [toast]); // Added toast to dependencies

  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image: null as File | null,
    image_url: '',
    options: [] as OptionGroup[],
    status: 'hidden' as 'hidden' | 'sold_out' | 'available',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (formData.image) {
        const uploadForm = new FormData();
        uploadForm.append('image', formData.image);

        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: uploadForm,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed.');
        imageUrl = data.imageUrl;
      }

      const apiUrl = `/api/admin/menus`;
      const method = menuToEdit ? 'PATCH' : 'POST';

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId: formData.id, // menuId 명확히 전달
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.category_id,
          image_url: imageUrl,
          options: formData.options,
          status: formData.status,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.error || 'Failed to save menu');

      toast({
        title: 'Success',
        description: menuToEdit ? 'Menu updated!' : 'Menu added!',
      });

      setFormData(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onMenuUpdated();
    } catch (error) {
      console.error('Error submitting form:', error);

      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Unexpected error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOptionGroup = <K extends keyof OptionGroup>(
    groupIndex: number,
    key: K,
    value: OptionGroup[K]
  ) => {
    setFormData((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[groupIndex] = {
        ...updatedOptions[groupIndex],
        [key]: value,
      };
      return { ...prev, options: updatedOptions };
    });
  };

  const updateOption = <K extends keyof Option>(
    groupIndex: number,
    optionIndex: number,
    key: K,
    value: Option[K]
  ) => {
    setFormData((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[groupIndex].options[optionIndex] = {
        ...updatedOptions[groupIndex].options[optionIndex],
        [key]: value,
      };
      return { ...prev, options: updatedOptions };
    });
  };

  const addOption = (groupIndex: number) => {
    const updatedOptions = [...formData.options];
    updatedOptions[groupIndex].options.push({ id: '', name: '', price: 0 });
    setFormData({ ...formData, options: updatedOptions });
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    const updatedOptions = [...formData.options];
    updatedOptions[groupIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, options: updatedOptions });
  };

  const addOptionGroup = () => {
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        {
          id: '',
          name: 'Option Group',
          is_required: false,
          max_select: 1,
          options: [{ id: '', name: '', price: 0 }],
        },
      ],
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='w-full max-w-2xl mx-auto shadow-md rounded-2xl overflow-hidden'>
        <CardHeader className='bg-[#3182F6] text-white'>
          <CardTitle className='text-2xl font-bold'>
            {menuToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 bg-gray-50'>
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            className='space-y-6'
          >
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Image</Label>
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#3182F6] transition-colors'
                onClick={handleImageClick}
              >
                {formData.image || formData.image_url ? (
                  <img
                    src={
                      formData.image
                        ? URL.createObjectURL(formData.image)
                        : formData.image_url
                    }
                    alt='Menu item'
                    className='max-h-40 mx-auto rounded-md'
                  />
                ) : (
                  <div className='flex flex-col items-center text-gray-500'>
                    <ImageIcon className='w-12 h-12 mb-2' />
                    <span>Click to upload an image</span>
                  </div>
                )}
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className='hidden'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className='transition-all focus:ring-2 focus:ring-[#3182F6]'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className='transition-all focus:ring-2 focus:ring-[#3182F6]'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Price</Label>
              <Input
                type='number'
                step='0.01'
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                className='transition-all focus:ring-2 focus:ring-[#3182F6]'
              />
            </div>

            <div className='space-y-4'>
              <Label className='text-lg font-semibold'>Options</Label>
              <AnimatePresence>
                {/* TODO(@smosco): edit, add 할때 타입 맞추기 options, option groups */}
                {formData.options.map((group, groupIndex) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='border rounded-lg p-4 mt-2 bg-white shadow-sm'
                  >
                    <div className='flex justify-between items-center mb-2'>
                      <Input
                        placeholder='Option Group Name'
                        value={group.name}
                        onChange={(e) =>
                          updateOptionGroup(groupIndex, 'name', e.target.value)
                        }
                        className='font-medium text-lg bg-transparent border-none focus:ring-0'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          setExpandedGroup(
                            expandedGroup === group.id ? null : group.id
                          )
                        }
                      >
                        {expandedGroup === group.id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedGroup === group.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='space-y-4'
                        >
                          <div className='flex items-center space-x-2'>
                            <Switch
                              checked={group.is_required}
                              onCheckedChange={(checked) =>
                                updateOptionGroup(
                                  groupIndex,
                                  'is_required',
                                  checked
                                )
                              }
                              className={cn(
                                'data-[state=checked]:bg-[#3182F6]',
                                'data-[state=unchecked]:bg-gray-200'
                              )}
                            />
                            <Label>Required</Label>
                          </div>

                          <div className='flex items-center space-x-2'>
                            <Label>Max Select</Label>
                            <Input
                              type='number'
                              value={group.max_select}
                              onChange={(e) =>
                                updateOptionGroup(
                                  groupIndex,
                                  'max_select',
                                  Number(e.target.value)
                                )
                              }
                              className='w-20'
                            />
                          </div>

                          {group.options.map((option, optionIndex) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className='flex gap-2 items-center'
                            >
                              <Input
                                placeholder='Option Name'
                                value={option.name}
                                onChange={(e) =>
                                  updateOption(
                                    groupIndex,
                                    optionIndex,
                                    'name',
                                    e.target.value
                                  )
                                }
                                className='flex-grow'
                              />
                              <Input
                                type='number'
                                placeholder='Price'
                                value={option.price}
                                onChange={(e) =>
                                  updateOption(
                                    groupIndex,
                                    optionIndex,
                                    'price',
                                    Number(e.target.value)
                                  )
                                }
                                className='w-24'
                              />
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() =>
                                  removeOption(groupIndex, optionIndex)
                                }
                              >
                                <Trash className='w-4 h-4' />
                              </Button>
                            </motion.div>
                          ))}
                          <Button
                            type='button'
                            variant='outline'
                            className='w-full mt-2 border-[#3182F6] text-[#3182F6] hover:bg-[#3182F6] hover:text-white'
                            size='sm'
                            onClick={() => addOption(groupIndex)}
                          >
                            <Plus className='w-4 h-4 mr-2' /> Add Option
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                type='button'
                variant='outline'
                className='w-full border-[#3182F6] text-[#3182F6] hover:bg-[#3182F6] hover:text-white'
                onClick={addOptionGroup}
              >
                <Plus className='w-4 h-4 mr-2' /> Add Option Group
              </Button>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Menu Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as MenuStatus })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select menu status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='available'>Available</SelectItem>
                  <SelectItem value='sold_out'>Sold Out</SelectItem>
                  <SelectItem value='hidden'>Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                type='submit'
                disabled={loading}
                className='w-full bg-[#3182F6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#1c6def] transition-all duration-300'
              >
                {loading
                  ? 'Processing...'
                  : menuToEdit
                  ? 'Update Menu'
                  : 'Add Menu'}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
