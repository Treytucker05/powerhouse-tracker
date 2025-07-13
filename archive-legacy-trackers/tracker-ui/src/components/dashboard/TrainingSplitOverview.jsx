export default function TrainingSplitOverview({ split = [] }) {
  if (!split.length) return null;
  return (
    <div className="premium-card h-full flex flex-col p-6">
      <h3 className="text-xl font-semibold text-white mb-4 text-left">Training Split</h3>
      <div className="flex gap-2 flex-wrap flex-1 content-start">
        {split.map((d, index) => (
          <span
            key={d}
            className={`
              text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 hover:scale-105
              ${index === 0 
                ? 'bg-gradient-to-r from-primary-red to-dark-red text-white border border-accent-red' 
                : 'bg-transparent border-2 border-primary-red text-accent-red hover:bg-primary-red hover:text-white'
              }
            `}
            style={index === 0 ? { 
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            } : {}}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
