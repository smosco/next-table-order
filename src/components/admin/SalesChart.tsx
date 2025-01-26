import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'January', Sales: 4000 },
  { name: 'February', Sales: 3000 },
  { name: 'March', Sales: 5000 },
  { name: 'April', Sales: 4500 },
  { name: 'May', Sales: 6000 },
  { name: 'June', Sales: 5500 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey='Sales'
          stroke='#8884d8'
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
