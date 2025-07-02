import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function BarMiniChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center">
          <div className="text-sm">No volume data</div>
          <div className="text-xs text-gray-400 mt-1">Start tracking your workouts</div>
        </div>
      </div>
    );
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

  // Sort by volume descending for better visualization
  chartData.sort((a, b) => b.volume - a.volume);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-emerald-600">
            {payload[0].value} sets
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="muscle" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="volume" 
            fill="#10b981" 
            radius={[2, 2, 0, 0]}
            className="hover:opacity-80 cursor-pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
