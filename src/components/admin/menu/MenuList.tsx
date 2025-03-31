import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { MenuItem } from '@/types/schema';

export default function MenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch('/api/public/menus');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    }
    fetchMenus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mr-2'
                    onClick={() => router.push(`/admin/menus/edit/${item.id}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
