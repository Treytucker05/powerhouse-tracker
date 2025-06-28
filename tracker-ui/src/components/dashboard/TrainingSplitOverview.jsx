export default function TrainingSplitOverview({ split = [] }) {
  if (!split.length) return null;
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <h3 className="text-xl font-semibold text-white">Training Split</h3>
      <div className="flex gap-2 flex-wrap flex-1 content-start">
        {split.map((day, index) => (
          <span
            key={day}
            className={`
              text-sm px-3 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105
              ${index === 0 
                ? 'bg-gradient-to-r from-accent to-accent text-white border border-accent shadow-lg' 
                : 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white'
              }
            `}
            style={index === 0 ? { 
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            } : {}}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}