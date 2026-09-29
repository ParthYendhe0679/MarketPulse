import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (value: number) => string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter = (val) => `₹${val.toLocaleString()}`
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-3 border-[#111111] p-3 rounded-xl shadow-[3px_3px_0px_0px_#111111] font-sans text-xs">
        <p className="font-bold text-[#111111] uppercase tracking-wide border-b-2 border-[#111111] pb-1 mb-2">
          {label}
        </p>
        <div className="space-y-1.5 font-bold">
          {payload.map((item, idx) => {
            const isRevenue = item.name.toLowerCase().includes('revenue');
            const isSales = item.name.toLowerCase().includes('sales');
            const formattedVal = isRevenue 
              ? valueFormatter(item.value) 
              : isSales 
              ? `${item.value.toLocaleString()} units` 
              : `${item.value}%`;

            return (
              <p key={idx} className="flex items-center gap-2 justify-between">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span 
                    className="inline-block w-2.5 h-2.5 rounded border border-[#111111]" 
                    style={{ backgroundColor: item.color || item.fill }}
                  />
                  {item.name}:
                </span>
                <span className="text-[#111111]">{formattedVal}</span>
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
export default CustomTooltip;
