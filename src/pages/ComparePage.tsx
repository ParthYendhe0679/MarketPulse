import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  IndianRupee, 
  ShoppingBag, 
  Users
} from 'lucide-react';
import { Card } from '../components/Card';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
import { NeoLineChart } from '../charts';
import { getComparisonData } from '../services/dataService';
import { 
  STATES_AND_CITIES, 
  CATEGORIES_BRANDS_PRODUCTS, 
  ALL_BRANDS, 
  ALL_PRODUCTS,
  YEARS,
  QUARTERS,
  AGE_GROUPS,
  GENDERS
} from '../constants';

type CompareType = 'state' | 'city' | 'brand' | 'product' | 'category';

export const ComparePage: React.FC = () => {
  const [compareType, setCompareType] = useState<CompareType>('state');
  const [itemA, setItemA] = useState<string>('Maharashtra');
  const [itemB, setItemB] = useState<string>('Karnataka');

  // Common filters to apply to both sides
  const [filters, setFilters] = useState({
    year: '2026',
    quarter: '',
    ageGroup: '',
    gender: ''
  });

  // Handler for comparison type changes
  const handleTypeChange = (type: CompareType) => {
    setCompareType(type);
    
    // Set sensible default values for Item A & B when type changes
    if (type === 'state') {
      setItemA('Maharashtra');
      setItemB('Karnataka');
    } else if (type === 'city') {
      setItemA('Mumbai');
      setItemB('Bangalore');
    } else if (type === 'brand') {
      setItemA('Apple');
      setItemB('Samsung');
    } else if (type === 'category') {
      setItemA('Electronics');
      setItemB('Food & Beverages');
    } else if (type === 'product') {
      setItemA('iPhone 15');
      setItemB('Galaxy S24');
    }
  };

  // Compute available items for selector based on type
  const itemOptions = useMemo(() => {
    if (compareType === 'state') {
      return Object.keys(STATES_AND_CITIES).map(s => ({ value: s, label: s }));
    }
    if (compareType === 'city') {
      return Object.values(STATES_AND_CITIES).flat().map(c => ({ value: c, label: c }));
    }
    if (compareType === 'brand') {
      return ALL_BRANDS.map(b => ({ value: b, label: b }));
    }
    if (compareType === 'category') {
      return Object.keys(CATEGORIES_BRANDS_PRODUCTS).map(c => ({ value: c, label: c }));
    }
    if (compareType === 'product') {
      return ALL_PRODUCTS.map(p => ({ value: p, label: p }));
    }
    return [];
  }, [compareType]);

  // Compute comparison stats using service layer
  const comparisonResults = useMemo(() => {
    if (!itemA || !itemB) return null;
    return getComparisonData(compareType, itemA, itemB, filters);
  }, [compareType, itemA, itemB, filters]);

  // Handler for common filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const results = comparisonResults;

  // Calculate percentage delta helper
  const getDelta = (valA: number, valB: number) => {
    if (valA === 0) return 0;
    return parseFloat((((valB - valA) / valA) * 100).toFixed(1));
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="yellow">Index Mappings</Badge>
            <Badge variant="blue">Side-by-Side Analysis</Badge>
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Compare Intelligence
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Compare consumer metrics across cities, states, categories, and products side-by-side.
          </p>
        </div>
      </div>

      {/* Main Compare Selectors Panel */}
      <Card variant="white" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5">
        <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3 mb-4">
          <GitCompare className="w-5 h-5 text-[#4F7DF9] stroke-[2.5]" />
          <h3 className="font-display font-bold uppercase text-sm tracking-wide">
            Comparison Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          {/* Comparison Type */}
          <Dropdown
            label="Compare Level"
            value={compareType}
            onChange={(e) => handleTypeChange(e.target.value as CompareType)}
            options={[
              { value: 'state', label: 'State vs State' },
              { value: 'city', label: 'City vs City' },
              { value: 'category', label: 'Category vs Category' },
              { value: 'brand', label: 'Brand vs Brand' },
              { value: 'product', label: 'Product vs Product' }
            ]}
          />

          {/* Item A Selector */}
          <Dropdown
            label="Select Item A"
            value={itemA}
            onChange={(e) => setItemA(e.target.value)}
            options={itemOptions}
          />

          {/* VS Divider Visual */}
          <div className="hidden md:flex justify-center pb-3.5">
            <span className="w-9 h-9 rounded-full bg-[#111111] text-white border-2 border-[#111111] flex items-center justify-center font-black text-xs">
              VS
            </span>
          </div>

          {/* Item B Selector */}
          <Dropdown
            label="Select Item B"
            value={itemB}
            onChange={(e) => setItemB(e.target.value)}
            options={itemOptions}
          />
        </div>

        {/* Global Common Filter row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t-2 border-dashed border-gray-200">
          <Dropdown
            label="Reference Year"
            placeholder="All Years"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={YEARS.map(y => ({ value: String(y), label: String(y) }))}
          />

          <Dropdown
            label="Reference Quarter"
            placeholder="All Quarters"
            value={filters.quarter}
            onChange={(e) => handleFilterChange('quarter', e.target.value)}
            options={QUARTERS.map(q => ({ value: q, label: q }))}
          />

          <Dropdown
            label="Target Age Group"
            placeholder="All Ages"
            value={filters.ageGroup}
            onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
            options={AGE_GROUPS.map(ag => ({ value: ag, label: ag }))}
          />

          <Dropdown
            label="Target Gender"
            placeholder="All Genders"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            options={GENDERS.map(g => ({ value: g, label: g }))}
          />
        </div>
      </Card>

      {/* Comparison Results Area */}
      {results && (
        <div className="space-y-6">
          {/* Side-by-Side KPI Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KPI 1: Revenue Comparison */}
            <Card hoverable={false} className="border-3 border-[#111111] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2 mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">REVENUE COMPARISON</span>
                <IndianRupee className="w-4 h-4 text-gray-500 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#4F7DF9]/10 p-2.5 rounded-xl border border-[#4F7DF9]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemA.name}</span>
                  <strong className="text-sm font-black">₹{(results.itemA.kpis.totalRevenue / 10000000).toFixed(2)} Cr</strong>
                </div>
                <div className="flex justify-between items-center bg-[#FF9ECF]/10 p-2.5 rounded-xl border border-[#FF9ECF]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemB.name}</span>
                  <strong className="text-sm font-black">₹{(results.itemB.kpis.totalRevenue / 10000000).toFixed(2)} Cr</strong>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-600">
                  <span>Margin Differential:</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    results.itemB.kpis.totalRevenue >= results.itemA.kpis.totalRevenue ? 'bg-[#6EE7B7] text-[#111111]' : 'bg-[#FF6B6B] text-white'
                  }`}>
                    {getDelta(results.itemA.kpis.totalRevenue, results.itemB.kpis.totalRevenue) >= 0 ? '+' : ''}
                    {getDelta(results.itemA.kpis.totalRevenue, results.itemB.kpis.totalRevenue)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* KPI 2: Sales Comparison */}
            <Card hoverable={false} className="border-3 border-[#111111] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2 mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">SALES VOLUME INDEX</span>
                <ShoppingBag className="w-4 h-4 text-gray-500 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#4F7DF9]/10 p-2.5 rounded-xl border border-[#4F7DF9]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemA.name}</span>
                  <strong className="text-sm font-black">{results.itemA.kpis.totalSales.toLocaleString()} units</strong>
                </div>
                <div className="flex justify-between items-center bg-[#FF9ECF]/10 p-2.5 rounded-xl border border-[#FF9ECF]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemB.name}</span>
                  <strong className="text-sm font-black">{results.itemB.kpis.totalSales.toLocaleString()} units</strong>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-600">
                  <span>Margin Differential:</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    results.itemB.kpis.totalSales >= results.itemA.kpis.totalSales ? 'bg-[#6EE7B7] text-[#111111]' : 'bg-[#FF6B6B] text-white'
                  }`}>
                    {getDelta(results.itemA.kpis.totalSales, results.itemB.kpis.totalSales) >= 0 ? '+' : ''}
                    {getDelta(results.itemA.kpis.totalSales, results.itemB.kpis.totalSales)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* KPI 3: Demographic Consumers */}
            <Card hoverable={false} className="border-3 border-[#111111] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2 mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">CONSUMER COUNT</span>
                <Users className="w-4 h-4 text-gray-500 stroke-[2.5]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#4F7DF9]/10 p-2.5 rounded-xl border border-[#4F7DF9]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemA.name}</span>
                  <strong className="text-sm font-black">{results.itemA.kpis.consumerCount.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between items-center bg-[#FF9ECF]/10 p-2.5 rounded-xl border border-[#FF9ECF]">
                  <span className="text-xs font-black uppercase text-gray-500">{results.itemB.name}</span>
                  <strong className="text-sm font-black">{results.itemB.kpis.consumerCount.toLocaleString()}</strong>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-600">
                  <span>Margin Differential:</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    results.itemB.kpis.consumerCount >= results.itemA.kpis.consumerCount ? 'bg-[#6EE7B7] text-[#111111]' : 'bg-[#FF6B6B] text-white'
                  }`}>
                    {getDelta(results.itemA.kpis.consumerCount, results.itemB.kpis.consumerCount) >= 0 ? '+' : ''}
                    {getDelta(results.itemA.kpis.consumerCount, results.itemB.kpis.consumerCount)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Historical revenue comparison trend line */}
          <div className="grid grid-cols-1 gap-6">
            <Card hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <div>
                  <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                    Revenue Consumption Chronological Index
                  </h4>
                  <p className="text-xs font-semibold text-gray-500">
                    Comparing historical performance monthly timelines.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#4F7DF9] border border-[#111111] rounded"></span><span>A: {results.itemA.name}</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#FF6B6B] border border-[#111111] rounded"></span><span>B: {results.itemB.name}</span></div>
                </div>
              </div>
              <NeoLineChart 
                data={results.trendComparison}
                xAxisKey="name"
                dataKeys={["revenueA", "revenueB"]}
                colors={["#4F7DF9", "#FF6B6B"]}
                valueFormatter={(val) => `₹${(val / 100000).toFixed(1)} L`}
              />
            </Card>
          </div>

          {/* Top Products Lists Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List A */}
            <Card hoverable={false} className="border-3 border-[#111111] p-5">
              <div className="flex justify-between items-center border-b-2 border-[#111111] pb-2 mb-4 bg-[#4F7DF9]/10 -mx-5 px-5">
                <h4 className="text-sm font-black font-display uppercase text-[#111111]">
                  Top SKUs for {results.itemA.name}
                </h4>
                <Badge variant="blue">Rank A</Badge>
              </div>

              <div className="space-y-3">
                {results.itemA.topProducts.map((p, idx) => (
                  <div key={p.name} className="flex justify-between items-center p-3 border-2 border-[#111111] rounded-xl bg-white shadow-[2px_2px_0px_0px_#111111]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-[#111111] text-white font-black text-xs flex items-center justify-center border border-[#111111]">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-xs uppercase block text-[#111111]">{p.name}</strong>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">{p.brand} &bull; {p.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-xs block text-[#111111]">₹{(p.revenue / 100000).toFixed(1)} L</strong>
                      <span className="text-[9px] font-bold text-gray-400">YoY: +{p.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* List B */}
            <Card hoverable={false} className="border-3 border-[#111111] p-5">
              <div className="flex justify-between items-center border-b-2 border-[#111111] pb-2 mb-4 bg-[#FF9ECF]/10 -mx-5 px-5">
                <h4 className="text-sm font-black font-display uppercase text-[#111111]">
                  Top SKUs for {results.itemB.name}
                </h4>
                <Badge variant="pink">Rank B</Badge>
              </div>

              <div className="space-y-3">
                {results.itemB.topProducts.map((p, idx) => (
                  <div key={p.name} className="flex justify-between items-center p-3 border-2 border-[#111111] rounded-xl bg-white shadow-[2px_2px_0px_0px_#111111]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-[#111111] text-white font-black text-xs flex items-center justify-center border border-[#111111]">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-xs uppercase block text-[#111111]">{p.name}</strong>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">{p.brand} &bull; {p.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-xs block text-[#111111]">₹{(p.revenue / 100000).toFixed(1)} L</strong>
                      <span className="text-[9px] font-bold text-gray-400">YoY: +{p.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default ComparePage;
