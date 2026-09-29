import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse p-4">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-white border-3 border-[#111111] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
            <div className="h-4 bg-gray-200 rounded w-2/3 border border-[#111111]"></div>
            <div className="h-7 bg-gray-200 rounded w-1/2 border border-[#111111]"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 border border-[#111111]"></div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px] bg-white border-3 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/4 border border-[#111111]"></div>
          <div className="h-64 bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
        </div>
        <div className="h-[350px] bg-white border-3 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3 border border-[#111111]"></div>
          <div className="h-64 bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
        </div>
      </div>

      {/* Demographic splits row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-[300px] bg-white border-3 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/3 border border-[#111111]"></div>
            <div className="h-[200px] bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
