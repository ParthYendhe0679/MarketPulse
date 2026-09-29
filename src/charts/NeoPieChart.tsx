import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface NeoPieChartProps {
  data: { name: string; value: number; [key: string]: any }[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: number) => string;
  height?: number;
}

export const NeoPieChart: React.FC<NeoPieChartProps> = ({
  data,
  colors = ['#4F7DF9', '#FFD54A', '#FF9ECF', '#6EE7B7', '#FFB347', '#FF6B6B'],
  innerRadius = 0,
  outerRadius = 80,
  valueFormatter = (val) => `${val.toLocaleString()}`,
  height = 250
}) => {
  return (
    <div style={{ width: '100%', height }} className="font-display">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            stroke="#111111"
            strokeWidth={2.5}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', paddingTop: 10 }}
            iconType="rect"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default NeoPieChart;
