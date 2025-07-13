import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import DashboardCard from '../ui/DashboardCard';

export default function VolumeTonnageCard({ data = {} }) {
  const frames = ['day', 'week', 'block', 'program'];
  
  // Sample data if none provided
  const sampleData = {
    day: [
      { muscle: 'Chest', sets: 4, tonnage: 2400, volumeLoad: 18500 },
      { muscle: 'Triceps', sets: 3, tonnage: 1200, volumeLoad: 9800 },
      { muscle: 'Shoulders', sets: 2, tonnage: 800, volumeLoad: 6200 },
    ],
    week: [
      { muscle: 'Chest', sets: 12, tonnage: 7200, volumeLoad: 55500 },
      { muscle: 'Back', sets: 14, tonnage: 8400, volumeLoad: 64800 },
      { muscle: 'Legs', sets: 16, tonnage: 12800, volumeLoad: 98600 },
    ],
    block: [
      { muscle: 'Chest', sets: 48, tonnage: 28800, volumeLoad: 222000 },
      { muscle: 'Back', sets: 56, tonnage: 33600, volumeLoad: 259200 },
      { muscle: 'Legs', sets: 64, tonnage: 51200, volumeLoad: 394400 },
    ],
    program: [
      { muscle: 'Chest', sets: 192, tonnage: 115200, volumeLoad: 888000 },
      { muscle: 'Back', sets: 224, tonnage: 134400, volumeLoad: 1036800 },
      { muscle: 'Legs', sets: 256, tonnage: 204800, volumeLoad: 1577600 },
    ]
  };

  const displayData = Object.keys(data).length > 0 ? data : sampleData;

  return (
    <DashboardCard>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Volume & Tonnage</h3>
      <Tabs defaultValue="day" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-white/5 rounded-lg p-1">
          {frames.map(f => (
            <TabsTrigger 
              key={f} 
              value={f}
              className="capitalize px-3 py-2 text-sm font-medium text-white/70 hover:text-white data-[state=active]:bg-accent data-[state=active]:text-white rounded-md transition-all"
            >
              {f}
            </TabsTrigger>
          ))}
        </TabsList>
        {frames.map(f => (
          <TabsContent key={f} value={f} className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-white/80 font-medium">Muscle</th>
                    <th className="text-right py-2 px-3 text-white/80 font-medium">Sets</th>
                    <th className="text-right py-2 px-3 text-white/80 font-medium">Tonnage</th>
                    <th className="text-right py-2 px-3 text-white/80 font-medium">Vol-Load</th>
                  </tr>
                </thead>
                <tbody>
                  {(displayData[f] || []).map(m => (
                    <tr key={m.muscle} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 px-3 text-gray-100">{m.muscle}</td>
                      <td className="py-2 px-3 text-right text-white/90">{m.sets}</td>
                      <td className="py-2 px-3 text-right text-white/90">{m.tonnage.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-red-400 font-medium">{m.volumeLoad.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardCard>
  );
}
