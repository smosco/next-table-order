import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const popularItems = [
  { name: 'Turkey Club', count: 120, revenue: 24000 },
  { name: 'Ham and Cheese', count: 95, revenue: 19000 },
  { name: 'Veggie Delight', count: 80, revenue: 16000 },
  { name: 'Chicken Caesar Wrap', count: 75, revenue: 22500 },
  { name: 'Tuna Salad Sandwich', count: 70, revenue: 14000 },
];

export function PopularItems() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Menu Item</TableHead>
          <TableHead>Sold Quantity</TableHead>
          <TableHead>Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {popularItems.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>${item.revenue.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
