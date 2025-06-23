import WeeklyVolumeCard from "../components/WeeklyVolumeCard";
import useWeeklyVolume from "../hooks/useWeeklyVolume";
import DeloadDrawer from "../components/DeloadDrawer";

export default function Home() {
  const { data, loading } = useWeeklyVolume();

  return (
    <main className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">PowerHouse Tracker</h1>
      <WeeklyVolumeCard data={data} loading={loading} />
    </main>
  );
}
