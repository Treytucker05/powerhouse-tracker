import React from 'react';

const LoadingSkeleton = ({ type = 'default', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className={`bg-gray-800 rounded-xl p-6 animate-pulse ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-700 rounded" />
              <div className="h-3 bg-gray-700 rounded w-5/6" />
              <div className="h-3 bg-gray-700 rounded w-4/6" />
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div key={index} className={`flex items-center space-x-4 p-4 animate-pulse ${className}`}>
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
            <div className="w-16 h-8 bg-gray-700 rounded" />
          </div>
        );

      case 'chart':
        return (
          <div key={index} className={`bg-gray-800 rounded-xl p-6 animate-pulse ${className}`}>
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6" />
            <div className="h-64 bg-gray-700 rounded" />
          </div>
        );

      case 'workout-card':
        return (
          <div key={index} className={`bg-gray-800 rounded-xl p-4 animate-pulse ${className}`}>
            <div className="flex justify-between items-center mb-3">
              <div className="h-5 bg-gray-700 rounded w-1/3" />
              <div className="w-6 h-6 bg-gray-700 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-3 bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
            <div className="h-2 bg-gray-700 rounded w-full" />
          </div>
        );

      case 'progress-ring':
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2" />
            <div className="h-3 bg-gray-700 rounded w-16 mx-auto" />
          </div>
        );

      default:
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        );
    }
  });

  return <>{skeletons}</>;
};

// Page-specific loading components
export const MacrocycleLoading = () => (
  <div className="space-y-8">
    <LoadingSkeleton type="card" className="h-32" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton type="timeline" count={6} />
    </div>
    <LoadingSkeleton type="card" className="h-48" />
  </div>
);

export const MicrocycleLoading = () => (
  <div className="space-y-8">
    <div className="grid gap-4 grid-cols-7">
      <LoadingSkeleton type="workout-card" count={7} />
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <LoadingSkeleton type="card" className="h-64" />
      <LoadingSkeleton type="card" className="h-64" />
    </div>
  </div>
);

export const TrackingLoading = () => (
  <div className="space-y-8">
    <LoadingSkeleton type="chart" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton type="card" count={6} />
    </div>
  </div>
);

export default LoadingSkeleton;
