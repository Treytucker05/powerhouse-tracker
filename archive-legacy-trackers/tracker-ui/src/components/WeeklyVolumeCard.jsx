import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyVolumeCard({ data, loading }) {
  if (loading) return <p>Loading…</p>;
  if (!data?.length) return <p>No volume data</p>;

  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Weekly Volume</h2>
      <ResponsiveContainer width="100%" height={220}>        <BarChart data={data}>
          <XAxis dataKey="muscle" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="volume" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
