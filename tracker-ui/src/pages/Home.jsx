import WeeklyVolumeCard from "../components/WeeklyVolumeCard";
import useWeeklyVolume from "../hooks/useWeeklyVolume";
import DeloadDrawer from "../components/DeloadDrawer";

export default function Home() {
  const { data, loading } = useWeeklyVolume();
  return (
    <main className="p-6 max-w-3xl mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-500">PowerHouse Tracker</h1>
      <p className="text-lg text-gray-300 mb-6">Weekly Volume</p>
      <WeeklyVolumeCard data={data} loading={loading} />
    </main>
  );
}
