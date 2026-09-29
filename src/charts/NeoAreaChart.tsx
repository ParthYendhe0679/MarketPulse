import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface NeoAreaChartProps {
  data: any[];
  xAxisKey: string;
  dataKey: string;
  color?: string;
  fillColor?: string;
  valueFormatter?: (value: number) => string;
  height?: number;
}

export const NeoAreaChart: React.FC<NeoAreaChartProps> = ({
  data,
  xAxisKey,
  dataKey,
  color = '#4F7DF9',
  fillColor = '#4F7DF9',
  valueFormatter,
  height = 300
}) => {
  return (
    <div style={{ width: '100%', height }} className="font-display">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={fillColor} stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            stroke="#e5e7eb" 
            strokeDasharray="4 4" 
            vertical={false} 
          />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#111111" 
            tick={{ fontSize: 10, fontWeight: 700 }}
            tickLine={{ stroke: '#111111', strokeWidth: 2 }}
            axisLine={{ stroke: '#111111', strokeWidth: 3 }}
          />
          <YAxis 
            stroke="#111111"
            tick={{ fontSize: 10, fontWeight: 700 }}
            tickLine={{ stroke: '#111111', strokeWidth: 2 }}
            axisLine={{ stroke: '#111111', strokeWidth: 3 }}
            tickFormatter={(val) => {
              if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
              if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
              if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
              return val;
            }}
          />
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            stroke={color} 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorArea)" 
            dot={{ stroke: '#111111', strokeWidth: 2.5, r: 4, fill: color }}
            activeDot={{ stroke: '#111111', strokeWidth: 3, r: 6, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default NeoAreaChart;
