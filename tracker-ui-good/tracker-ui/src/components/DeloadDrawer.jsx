import Drawer from "./Drawer";
import { toast } from 'react-toastify';

export default function DeloadDrawer({ open, onClose, offenders = [] }) {
  const handleResetToMEV = () => {
    // This would call the INITIALIZE_AT_MEV action from context
    // For now, just show toast notification
    toast.info(`Would reset ${offenders.length} muscle groups to MEV`);
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <h3 className="text-xl font-bold mb-4">Deload Analysis</h3>

      {offenders.length === 0 ? (
        <div className="text-emerald-600">
          <p className="font-medium">✓ No deload needed</p>
          <p className="text-sm text-gray-600 mt-1">
            All muscle groups are within optimal training ranges.
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-amber-800 mb-2">
              ⚠️ Deload Recommended for {offenders.length} muscle group(s)
            </h4>
            <ul className="space-y-1">
              {offenders.map((muscle, index) => (
                <li key={index} className="text-sm text-amber-700">
                  • {muscle.name} - {muscle.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Recommended Action</h4>
            <p className="text-sm text-blue-700 mb-3">
              Reset affected muscle groups to their MEV (Minimum Effective Volume)
              to allow for recovery and continued progress.
            </p>

            <button
              onClick={handleResetToMEV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium"
            >
              Reset to MEV
            </button>
          </div>

          <div className="text-xs text-gray-500">
            <p>
              This will reduce training volume to minimum effective levels,
              allowing muscle groups to recover from accumulated fatigue.
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
}
