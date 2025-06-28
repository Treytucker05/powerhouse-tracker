// src/components/dashboard/VolumeTonnageCard.jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import DashboardCard from '../ui/DashboardCard';

const timeframes = ['day', 'week', 'block', 'program'];

export default function VolumeTonnageCard({ data }) {
  return (
    <DashboardCard>
      <Tabs defaultValue="day" className="w-full" orientation="horizontal">
        <TabsList className="grid w-full grid-cols-4 rounded-lg bg-black/20 p-1 mb-6" aria-label="Training timeframes">
          {timeframes.map(tf => (
            <TabsTrigger 
              key={tf} 
              value={tf} 
              className="capitalize rounded-md px-3 py-1.5 text-sm font-medium text-textMed 
                         transition-all hover:text-textHigh focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface
                         data-[state=active]:bg-brand data-[state=active]:text-white 
                         data-[state=active]:shadow-sm cursor-pointer"
            >
              {tf}
            </TabsTrigger>
          ))}
        </TabsList>

        {timeframes.map(tf => (
          <TabsContent key={tf} value={tf} className="mt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-textMed text-left border-b border-white/10">
                  <th className="pb-3 font-medium">Muscle</th>
                  <th className="w-20 pb-3 font-medium text-right">Sets</th>
                  <th className="w-24 pb-3 font-medium text-right">Tonnage</th>
                  <th className="w-28 pb-3 font-medium text-right">Volume-Load</th>
                </tr>
              </thead>
              <tbody>
                {data[tf].map(m => (
                  <tr key={m.muscle} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 text-textHigh capitalize">{m.muscle}</td>
                    <td className="py-2 text-textMed text-right">{m.sets}</td>
                    <td className="py-2 text-textMed text-right">{m.tonnage.toLocaleString()}</td>
                    <td className="py-2 text-textMed text-right">{m.volumeLoad.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-semibold border-t border-white/10">
                <tr className="bg-white/5">
                  <td className="py-3 text-textHigh font-bold">Total</td>
                  <td className="py-3 text-textHigh font-bold text-right">{data[tf + 'Total'].sets}</td>
                  <td className="py-3 text-textHigh font-bold text-right">{data[tf + 'Total'].tonnage.toLocaleString()}</td>
                  <td className="py-3 text-textHigh font-bold text-right">{data[tf + 'Total'].volumeLoad.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardCard>
  );
}
