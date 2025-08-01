import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export default function LanguageChart({ data }) {
  return (
    <div className='w-full h-64 bg-white shadow rounded p-4'>
      <h2 className='text-lg font-semibold mb-2'>Top Linguagens</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            dataKey="pct"
            nameKey="name"
            outerRadius="80%"
            paddingAngle={2}
            label={false}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={value => `${value}%`} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry) => {
              const pct = entry.payload?.pct;
              return pct != null
                ? `${value} (${pct}%)`
                : `${value}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}