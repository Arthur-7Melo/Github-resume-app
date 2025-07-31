import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export default function LanguageChart({ data }) {
  return (
    <div className='w-full h-64 bg-white shadow rounded p-4'>
      <h2 className='text-lg font-semibold mb-2'>Top Linguagens</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="pct"
            nameKey="name"
            outerRadius="80%"
            label={({ name, pct }) => `${name} (${pct}%)`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={value => `${value}%`} />
          <Legend verticalAlign='bottom' height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}