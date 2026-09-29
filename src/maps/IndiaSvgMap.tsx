import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { TrendingUp, Users, IndianRupee } from 'lucide-react';

interface IndiaSvgMapProps {
  data: any[];
  selectedState: string;
  onSelectState: (state: string) => void;
}

interface StatePathInfo {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  labelX: number;
  labelY: number;
}

// Stylized visual coordinates representing the states of India in a clean dashboard matrix
const STYLIZED_STATES: StatePathInfo[] = [
  { id: "DL", name: "Delhi", color: "#FF9ECF", x: 230, y: 70, width: 70, height: 50, rx: 8, labelX: 265, labelY: 100 },
  { id: "RJ", name: "Rajasthan", color: "#FFD54A", x: 120, y: 100, width: 95, height: 75, rx: 12, labelX: 167, labelY: 142 },
  { id: "UP", name: "Uttar Pradesh", color: "#6EE7B7", x: 245, y: 130, width: 110, height: 70, rx: 12, labelX: 300, labelY: 170 },
  { id: "GJ", name: "Gujarat", color: "#FFB347", x: 50, y: 195, width: 95, height: 75, rx: 12, labelX: 97, labelY: 237 },
  { id: "MH", name: "Maharashtra", color: "#4F7DF9", x: 160, y: 220, width: 115, height: 85, rx: 14, labelX: 217, labelY: 267 },
  { id: "WB", name: "West Bengal", color: "#FF9ECF", x: 380, y: 190, width: 85, height: 70, rx: 12, labelX: 422, labelY: 230 },
  { id: "TL", name: "Telangana", color: "#FFD54A", x: 240, y: 320, width: 80, height: 60, rx: 10, labelX: 280, labelY: 355 },
  { id: "AP", name: "Andhra Pradesh", color: "#FFB347", x: 250, y: 390, width: 90, height: 75, rx: 12, labelX: 295, labelY: 432 },
  { id: "KA", name: "Karnataka", color: "#6EE7B7", x: 155, y: 340, width: 80, height: 95, rx: 12, labelX: 195, labelY: 392 },
  { id: "KL", name: "Kerala", color: "#FF6B6B", x: 170, y: 460, width: 55, height: 80, rx: 10, labelX: 197, labelY: 505 },
  { id: "TN", name: "Tamil Nadu", color: "#FF9ECF", x: 240, y: 480, width: 75, height: 90, rx: 12, labelX: 277, labelY: 530 }
];

export const IndiaSvgMap: React.FC<IndiaSvgMapProps> = ({
  data,
  selectedState,
  onSelectState
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Compute state stats on the fly
  const stateStats = React.useMemo(() => {
    const stats: Record<string, { revenue: number; consumers: number; growth: number; count: number }> = {};
    
    // Initialize
    STYLIZED_STATES.forEach(s => {
      stats[s.name] = { revenue: 0, consumers: 0, growth: 0, count: 0 };
    });

    data.forEach(r => {
      if (stats[r.state]) {
        stats[r.state].revenue += r.revenue;
        stats[r.state].consumers += r.consumerCount;
        stats[r.state].growth += r.growth;
        stats[r.state].count += 1;
      }
    });

    return stats;
  }, [data]);

  const activeHoveredStats = hoveredState ? stateStats[hoveredState] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
      {/* SVG Map Section */}
      <Card hoverable={false} className="lg:col-span-2 bg-[#FAFAFA] flex flex-col items-center p-6 border-4 border-[#111111] overflow-hidden">
        <div className="w-full flex items-center justify-between border-b-3 border-[#111111] pb-3 mb-6">
          <div>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111]">
              Geographic Intelligence Map
            </h3>
            <p className="text-xs font-semibold text-gray-500">
              Interactive Stylized Map. Click a state card to filter dashboard data.
            </p>
          </div>
          <Badge variant="blue">11 Active Regions</Badge>
        </div>

        {/* Scaled Responsive Svg container */}
        <div className="relative w-full max-w-[500px] aspect-[500/600] bg-white border-3 border-[#111111] rounded-2xl shadow-[4px_4px_0px_0px_#111111] p-2">
          {/* Compass Rose decoration */}
          <div className="absolute top-4 left-4 w-12 h-12 border-2 border-dashed border-[#111111] rounded-full flex items-center justify-center font-bold font-display text-[9px] text-gray-500 uppercase select-none">
            N ⬆
          </div>

          <svg viewBox="0 0 500 600" className="w-full h-full select-none">
            {/* Draw grid lines background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f1f1" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="rounded-xl" />

            {/* Render Stylized State Blocks */}
            {STYLIZED_STATES.map((state) => {
              const isSelected = selectedState === state.name;
              const isHovered = hoveredState === state.name;
              
              // Visual indicators
              return (
                <g 
                  key={state.id}
                  onClick={() => onSelectState(state.name)}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  className="cursor-pointer"
                >
                  {/* Flat Shadow Rect */}
                  <rect
                    x={state.x + 4}
                    y={state.y + 4}
                    width={state.width}
                    height={state.height}
                    rx={state.rx}
                    fill="#111111"
                  />

                  {/* Top Interactive Block */}
                  <motion.rect
                    x={state.x}
                    y={state.y}
                    width={state.width}
                    height={state.height}
                    rx={state.rx}
                    fill={isSelected ? "#FFD54A" : state.color}
                    stroke="#111111"
                    strokeWidth={isSelected ? 4 : 3}
                    animate={{
                      y: isHovered || isSelected ? state.y - 2 : state.y,
                      x: isHovered || isSelected ? state.x - 2 : state.x,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />

                  {/* Text Label */}
                  <motion.text
                    x={state.labelX}
                    y={state.labelY}
                    textAnchor="middle"
                    fill="#111111"
                    className="font-display font-bold text-xs uppercase pointer-events-none"
                    animate={{
                      y: isHovered || isSelected ? state.labelY - 2 : state.labelY,
                    }}
                  >
                    {state.name.split(' ')[0]}
                  </motion.text>

                  {/* Active Indicator dot */}
                  {isSelected && (
                    <circle
                      cx={state.x + 12}
                      cy={state.y + 12}
                      r="4"
                      fill="#FF6B6B"
                      stroke="#111111"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      {/* Info Details Section */}
      <div className="flex flex-col gap-5 w-full">
        {/* Active Selection Details Card */}
        <Card variant="white" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5">
          <div className="border-b-3 border-[#111111] pb-3 mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Active Region Filter
            </span>
            <h4 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111]">
              {selectedState || "All India"}
            </h4>
          </div>

          {selectedState ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#4F7DF9] border border-[#111111] flex items-center justify-center text-white">
                    <IndianRupee className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block leading-none">Total Revenue</span>
                    <strong className="text-sm font-black">
                      ₹{(stateStats[selectedState]?.revenue / 10000000).toFixed(2)} Cr
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6EE7B7] border border-[#111111] flex items-center justify-center text-white">
                    <Users className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block leading-none">Total Consumers</span>
                    <strong className="text-sm font-black">
                      {stateStats[selectedState]?.consumers.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFD54A] border border-[#111111] flex items-center justify-center text-[#111111]">
                    <TrendingUp className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block leading-none">YoY Growth</span>
                    <strong className="text-sm font-black text-[#6EE7B7] bg-[#111111] px-1.5 py-0.5 rounded ml-1">
                      +{(stateStats[selectedState]?.growth / (stateStats[selectedState]?.count || 1)).toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectState("")}
                className="w-full py-2 bg-[#FF6B6B] border-3 border-[#111111] rounded-xl font-bold font-display uppercase text-xs tracking-wider text-white shadow-[3px_3px_0px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111111]"
              >
                Clear State Filter
              </button>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 font-medium">
              Click a state on the map to view regional market analytics.
            </div>
          )}
        </Card>

        {/* Hover Hover Tooltip Panel */}
        <Card variant="white" hoverable={false} className="border-4 border-dashed border-[#111111] p-5">
          <h4 className="text-sm font-bold font-display uppercase mb-3">
            Map Inspector Info
          </h4>
          {hoveredState && activeHoveredStats ? (
            <div className="space-y-2 text-xs">
              <p className="flex justify-between font-bold border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">REGION:</span>
                <span className="text-[#111111]">{hoveredState}</span>
              </p>
              <p className="flex justify-between font-bold border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">REVENUE:</span>
                <span className="text-[#111111]">₹{(activeHoveredStats.revenue / 10000000).toFixed(2)} Cr</span>
              </p>
              <p className="flex justify-between font-bold border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">CONSUMERS:</span>
                <span className="text-[#111111]">{activeHoveredStats.consumers.toLocaleString()}</span>
              </p>
              <p className="flex justify-between font-bold">
                <span className="text-gray-500">GROWTH RATE:</span>
                <span className="text-[#6EE7B7] bg-[#111111] px-1 rounded">
                  +{(activeHoveredStats.growth / (activeHoveredStats.count || 1)).toFixed(1)}%
                </span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-medium italic">
              Hover cursor over states on the map to inspect regional aggregates.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};
