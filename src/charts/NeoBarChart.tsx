import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface NeoBarChartProps {
  data: any[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  stacked?: boolean;
  valueFormatter?: (value: number) => string;
  height?: number;
}

export const NeoBarChart: React.FC<NeoBarChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = ['#4F7DF9', '#FFD54A', '#FF9ECF', '#6EE7B7'],
  stacked = false,
  valueFormatter,
  height = 300
}) => {
  return (
    <div style={{ width: '100%', height }} className="font-display">
      <ResponsiveContainer>
        <BarChart
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
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ fill: '#FAFAFA', opacity: 0.8 }} />
          <Legend 
            wrapperStyle={{ paddingTop: 10, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}
            iconType="rect"
            iconSize={12}
          />
          {dataKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              stackId={stacked ? "a" : undefined}
              fill={colors[index % colors.length]}
              stroke="#111111"
              strokeWidth={2.5}
              radius={stacked ? 0 : [4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default NeoBarChart;
