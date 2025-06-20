import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function BarMiniChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500">No volume data</div>;
  }

  // Group data by muscle for mini chart display
  const chartData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.muscle === item.muscle);
    if (existing) {
      existing.volume += item.volume;
    } else {
      acc.push({ muscle: item.muscle, volume: item.volume });
    }
    return acc;
  }, []);

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="muscle" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Bar 
            dataKey="volume" 
            fill="#10b981" 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
