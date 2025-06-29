import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import DashboardCard from '../ui/DashboardCard';
import type { VolumeData, TimeFrame, MuscleGroup } from '../../types';

// Extended VolumeData interface for this component
interface ExtendedVolumeData extends Omit<VolumeData, 'muscle'> {
  muscle: string; // Allow any muscle name string, not just MuscleGroup enum
  volumeLoad: number;
}

// Data structure for the component
interface VolumeTonnageData {
  day?: ExtendedVolumeData[];
  week?: ExtendedVolumeData[];
  block?: ExtendedVolumeData[];
  program?: ExtendedVolumeData[];
}

// Props interface for the component
export interface VolumeTonnageCardProps {
  data?: VolumeTonnageData;
  className?: string;
}

const VolumeTonnageCard: React.FC<VolumeTonnageCardProps> = ({ 
  data = {}, 
  className = "" 
}) => {
  // Type-safe frames array
  const frames: TimeFrame[] = ['day', 'week', 'block', 'program'];
  
  // Sample data with proper typing
  const sampleData: VolumeTonnageData = {
    day: [
      { muscle: 'Chest', sets: 4, reps: 48, volume: 4, tonnage: 2400, volume_load: 18500, volumeLoad: 18500 },
      { muscle: 'Triceps', sets: 3, reps: 36, volume: 3, tonnage: 1200, volume_load: 9800, volumeLoad: 9800 },
      { muscle: 'Shoulders', sets: 2, reps: 24, volume: 2, tonnage: 800, volume_load: 6200, volumeLoad: 6200 },
    ],
    week: [
      { muscle: 'Chest', sets: 12, reps: 144, volume: 12, tonnage: 7200, volume_load: 55500, volumeLoad: 55500 },
      { muscle: 'Back', sets: 14, reps: 168, volume: 14, tonnage: 8400, volume_load: 64800, volumeLoad: 64800 },
      { muscle: 'Legs', sets: 16, reps: 192, volume: 16, tonnage: 12800, volume_load: 98600, volumeLoad: 98600 },
    ],
    block: [
      { muscle: 'Chest', sets: 48, reps: 576, volume: 48, tonnage: 28800, volume_load: 222000, volumeLoad: 222000 },
      { muscle: 'Back', sets: 56, reps: 672, volume: 56, tonnage: 33600, volume_load: 259200, volumeLoad: 259200 },
      { muscle: 'Legs', sets: 64, reps: 768, volume: 64, tonnage: 51200, volume_load: 394400, volumeLoad: 394400 },
    ],
    program: [
      { muscle: 'Chest', sets: 192, reps: 2304, volume: 192, tonnage: 115200, volume_load: 888000, volumeLoad: 888000 },
      { muscle: 'Back', sets: 224, reps: 2688, volume: 224, tonnage: 134400, volume_load: 1036800, volumeLoad: 1036800 },
      { muscle: 'Legs', sets: 256, reps: 3072, volume: 256, tonnage: 204800, volume_load: 1577600, volumeLoad: 1577600 },
    ]
  };

  // Use provided data or fallback to sample data
  const displayData: VolumeTonnageData = Object.keys(data).length > 0 ? data : sampleData;

  // Helper function to format numbers with proper typing
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  // Helper function to get data for a specific timeframe
  const getFrameData = (frame: TimeFrame): ExtendedVolumeData[] => {
    return displayData[frame] || [];
  };

  return (
    <DashboardCard className={className}>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Volume & Tonnage</h3>
      <Tabs defaultValue="day" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-white/5 rounded-lg p-1">
          {frames.map((frame: TimeFrame) => (
            <TabsTrigger 
              key={frame} 
              value={frame}
              className="capitalize px-3 py-2 text-sm font-medium text-white/70 hover:text-white data-[state=active]:bg-accent data-[state=active]:text-white rounded-md transition-all"
            >
              {frame}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {frames.map((frame: TimeFrame) => (
          <TabsContent key={frame} value={frame} className="mt-0">
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
                  {getFrameData(frame).map((muscleData: ExtendedVolumeData, index: number) => (
                    <tr 
                      key={`${frame}-${muscleData.muscle}-${index}`} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="py-2 px-3 text-gray-100 font-medium capitalize">
                        {muscleData.muscle}
                      </td>
                      <td className="py-2 px-3 text-right text-white/90 tabular-nums">
                        {muscleData.sets}
                      </td>
                      <td className="py-2 px-3 text-right text-white/90 tabular-nums">
                        {formatNumber(muscleData.tonnage)}
                      </td>
                      <td className="py-2 px-3 text-right text-red-400 font-medium tabular-nums">
                        {formatNumber(muscleData.volumeLoad)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Show empty state if no data */}
                  {getFrameData(frame).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 px-3 text-center text-gray-400">
                        No data available for {frame}
                      </td>
                    </tr>
                  )}
                </tbody>
                
                {/* Show totals row if data exists */}
                {getFrameData(frame).length > 0 && (
                  <tfoot>
                    <tr className="border-t border-white/20 bg-white/5">
                      <td className="py-2 px-3 text-white font-bold">Total</td>
                      <td className="py-2 px-3 text-right text-white font-bold tabular-nums">
                        {getFrameData(frame).reduce((sum, item) => sum + item.sets, 0)}
                      </td>
                      <td className="py-2 px-3 text-right text-white font-bold tabular-nums">
                        {formatNumber(getFrameData(frame).reduce((sum, item) => sum + item.tonnage, 0))}
                      </td>
                      <td className="py-2 px-3 text-right text-red-400 font-bold tabular-nums">
                        {formatNumber(getFrameData(frame).reduce((sum, item) => sum + item.volumeLoad, 0))}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardCard>
  );
};

export default VolumeTonnageCard;
