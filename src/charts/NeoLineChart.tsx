import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface NeoLineChartProps {
  data: any[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  height?: number;
}

export const NeoLineChart: React.FC<NeoLineChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = ['#4F7DF9', '#FF6B6B', '#FFD54A', '#6EE7B7'],
  valueFormatter,
  height = 300
}) => {
  return (
    <div style={{ width: '100%', height }} className="font-display">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
        >
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
          <Legend 
            wrapperStyle={{ paddingTop: 10, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}
            iconType="circle"
            iconSize={10}
          />
          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone"
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              stroke={colors[index % colors.length]}
              strokeWidth={4}
              dot={{ stroke: '#111111', strokeWidth: 2.5, r: 5, fill: colors[index % colors.length] }}
              activeDot={{ stroke: '#111111', strokeWidth: 3, r: 7, fill: colors[index % colors.length] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default NeoLineChart;
