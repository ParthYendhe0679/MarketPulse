import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  PieChart, 
  Users, 
  TrendingUp, 
  RotateCcw, 
  SlidersHorizontal, 
  MapPin 
} from 'lucide-react';

import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

import { LeafletMap } from '../maps/LeafletMap';

import { 
  NeoBarChart, 
  NeoAreaChart, 
  NeoPieChart 
} from '../charts';

import { 
  getFilteredData, 
  calculateKPIs, 
  getMonthlyTrend, 
  getCategoryDistribution, 
  getBrandDistribution, 
  getAgeDistribution, 
  getGenderDistribution,
  getProductRanking
} from '../services/dataService';

import { 
  STATES_AND_CITIES, 
  CATEGORIES_BRANDS_PRODUCTS, 
  YEARS, 
  QUARTERS, 
  MONTHS, 
  AGE_GROUPS, 
  GENDERS 
} from '../constants';

import type { FilterState } from '../types';

const INITIAL_FILTERS: FilterState = {
  state: '',
  city: '',
  category: '',
  brand: '',
  product: '',
  year: '',
  month: '',
  quarter: '',
  ageGroup: '',
  gender: ''
};

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state and city from URL parameters
  useEffect(() => {
    const urlState = searchParams.get('state') || '';
    const urlCity = searchParams.get('city') || '';
    
    setFilters(prev => ({
      ...prev,
      state: urlState,
      city: urlCity
    }));
  }, [searchParams]);

  // Handle individual filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setIsLoading(true);
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      
      // If state changes, reset city
      if (key === 'state') {
        next.city = '';
      }
      
      // If category changes, reset brand and product
      if (key === 'category') {
        next.brand = '';
        next.product = '';
      }
      
      // If brand changes, reset product
      if (key === 'brand') {
        next.product = '';
      }
      
      return next;
    });

    // Simulate rapid sub-second database query lag
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Memoize filtered results for sub-second performance
  const filteredRecords = useMemo(() => {
    return getFilteredData(filters);
  }, [filters]);

  // Aggregated data
  const kpis = useMemo(() => calculateKPIs(filteredRecords), [filteredRecords]);
  const monthlyTrend = useMemo(() => getMonthlyTrend(filteredRecords), [filteredRecords]);
  const categorySplit = useMemo(() => getCategoryDistribution(filteredRecords), [filteredRecords]);
  const brandSplit = useMemo(() => getBrandDistribution(filteredRecords), [filteredRecords]);
  const ageSplit = useMemo(() => getAgeDistribution(filteredRecords), [filteredRecords]);
  const genderSplit = useMemo(() => getGenderDistribution(filteredRecords), [filteredRecords]);
  const topProducts = useMemo(() => getProductRanking(filteredRecords, 5), [filteredRecords]);

  // Options lists based on parent relationships
  const availableCities = useMemo(() => {
    if (!filters.state) return [];
    return STATES_AND_CITIES[filters.state] || [];
  }, [filters.state]);

  const availableBrands = useMemo(() => {
    if (!filters.category) return [];
    return Object.keys(CATEGORIES_BRANDS_PRODUCTS[filters.category] || {});
  }, [filters.category]);

  const availableProducts = useMemo(() => {
    if (!filters.category || !filters.brand) return [];
    return CATEGORIES_BRANDS_PRODUCTS[filters.category]?.[filters.brand] || [];
  }, [filters.category, filters.brand]);

  // State selection helper via map clicks
  const handleMapSelectCity = (cityName: string) => {
    handleFilterChange('city', cityName);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="blue">Real-time Metrics</Badge>
            {filters.state && <Badge variant="yellow">{filters.state}</Badge>}
            {filters.city && <Badge variant="pink">{filters.city}</Badge>}
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Platform Dashboard
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Consumer consumption index intelligence and seasonal revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="white" size="sm" onClick={handleResetFilters}>
            <RotateCcw className="w-4 h-4 mr-1.5 stroke-[3]" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Filter Control Drawer / Panel */}
      <Card variant="white" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
        <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-[#4F7DF9] stroke-[2.5]" />
          <h3 className="font-display font-bold uppercase text-sm tracking-wide">
            Enterprise Filter Matrix
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* State */}
          <Dropdown
            label="State"
            placeholder="All States"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            options={Object.keys(STATES_AND_CITIES).map(s => ({ value: s, label: s }))}
          />

          {/* City (Dependent on State) */}
          <Dropdown
            label="City"
            placeholder="All Cities"
            value={filters.city}
            disabled={!filters.state}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            options={availableCities.map(c => ({ value: c, label: c }))}
          />

          {/* Category */}
          <Dropdown
            label="Category"
            placeholder="All Categories"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={Object.keys(CATEGORIES_BRANDS_PRODUCTS).map(c => ({ value: c, label: c }))}
          />

          {/* Brand (Dependent on Category) */}
          <Dropdown
            label="Brand"
            placeholder="All Brands"
            value={filters.brand}
            disabled={!filters.category}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            options={availableBrands.map(b => ({ value: b, label: b }))}
          />

          {/* Product (Dependent on Brand) */}
          <Dropdown
            label="Product"
            placeholder="All Products"
            value={filters.product}
            disabled={!filters.brand}
            onChange={(e) => handleFilterChange('product', e.target.value)}
            options={availableProducts.map(p => ({ value: p, label: p }))}
          />

          {/* Year */}
          <Dropdown
            label="Year"
            placeholder="All Years"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={YEARS.map(y => ({ value: String(y), label: String(y) }))}
          />

          {/* Quarter */}
          <Dropdown
            label="Quarter"
            placeholder="All Quarters"
            value={filters.quarter}
            onChange={(e) => handleFilterChange('quarter', e.target.value)}
            options={QUARTERS.map(q => ({ value: q, label: q }))}
          />

          {/* Month */}
          <Dropdown
            label="Month"
            placeholder="All Months"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            options={MONTHS.map(m => ({ value: m, label: m }))}
          />

          {/* Age Group */}
          <Dropdown
            label="Age Group"
            placeholder="All Ages"
            value={filters.ageGroup}
            onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
            options={AGE_GROUPS.map(ag => ({ value: ag, label: ag }))}
          />

          {/* Gender */}
          <Dropdown
            label="Gender"
            placeholder="All Genders"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            options={GENDERS.map(g => ({ value: g, label: g }))}
          />
        </div>
      </Card>

      {/* Conditional Rendering based on state queries */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredRecords.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div className="space-y-6">
          {/* Top KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* KPI: Revenue */}
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#4F7DF9] p-4 flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">TOTAL REVENUE</span>
                <div className="w-7 h-7 bg-[#4F7DF9] border-2 border-[#111111] rounded-lg flex items-center justify-center text-white"><IndianRupee className="w-3.5 h-3.5 stroke-[3]" /></div>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black font-display">₹{(kpis.totalRevenue / 10000000).toFixed(2)} Cr</strong>
                <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Total sales revenue in INR</p>
              </div>
            </Card>

            {/* KPI: Sales Volume */}
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#FFD54A] p-4 flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">TOTAL SALES</span>
                <div className="w-7 h-7 bg-[#FFD54A] border-2 border-[#111111] rounded-lg flex items-center justify-center text-[#111111]"><ShoppingBag className="w-3.5 h-3.5 stroke-[3]" /></div>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black font-display">{(kpis.totalSales).toLocaleString()}</strong>
                <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">SKU items consumed</p>
              </div>
            </Card>

            {/* KPI: Market Share */}
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#FF9ECF] p-4 flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">MARKET SHARE</span>
                <div className="w-7 h-7 bg-[#FF9ECF] border-2 border-[#111111] rounded-lg flex items-center justify-center text-[#111111]"><PieChart className="w-3.5 h-3.5 stroke-[3]" /></div>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black font-display">{kpis.marketShare}%</strong>
                <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Mean relative category share</p>
              </div>
            </Card>

            {/* KPI: Consumer Count */}
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#6EE7B7] p-4 flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">CONSUMERS</span>
                <div className="w-7 h-7 bg-[#6EE7B7] border-2 border-[#111111] rounded-lg flex items-center justify-center text-[#111111]"><Users className="w-3.5 h-3.5 stroke-[3]" /></div>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black font-display">{(kpis.consumerCount).toLocaleString()}</strong>
                <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Count of target consumers</p>
              </div>
            </Card>

            {/* KPI: Growth Rate */}
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#FFB347] p-4 flex flex-col justify-between h-28 bg-[#111111] text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">YOY GROWTH</span>
                <div className="w-7 h-7 bg-[#FFB347] border-2 border-white rounded-lg flex items-center justify-center text-[#111111]"><TrendingUp className="w-3.5 h-3.5 stroke-[3]" /></div>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black font-display text-[#6EE7B7]">+{kpis.growth}%</strong>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">YoY consumption index</p>
              </div>
            </Card>
          </div>

          {/* Spatial Heatmap mapping using Leaflet */}
          <div className="grid grid-cols-1 gap-6">
            <Card hoverable={false} className="border-4 border-[#111111] p-5">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="font-display font-black uppercase text-sm tracking-tight text-[#111111]">
                    Spatial Consumption Hotspots (Map View)
                  </h3>
                  <p className="text-xs font-semibold text-gray-500">
                    City-level heat indexes based on revenue volumes. Click markers to drill down.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 stroke-[3.5] text-[#FF6B6B]" />
                  <span className="text-xs font-bold uppercase">{filters.state || "All India"}</span>
                </div>
              </div>

              <LeafletMap 
                data={filteredRecords}
                activeState={filters.state}
                activeCity={filters.city}
                onSelectCity={handleMapSelectCity}
              />
            </Card>
          </div>

          {/* Chart Row 1: Area Trends & Brand Shares */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart: Revenue trends */}
            <Card hoverable={false} className="lg:col-span-2 border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                  Historical Consumption & Revenue Trend
                </h4>
                <Badge variant="blue">Monthly Timeline</Badge>
              </div>
              <NeoAreaChart 
                data={monthlyTrend}
                xAxisKey="name"
                dataKey="revenue"
                color="#4F7DF9"
                fillColor="#4F7DF9"
                valueFormatter={(val) => `₹${(val / 100000).toFixed(1)} L`}
              />
            </Card>

            {/* Pie Chart: Category distribution */}
            <Card hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                  Category Revenue Share
                </h4>
                <Badge variant="yellow">Sector Split</Badge>
              </div>
              <NeoPieChart 
                data={categorySplit}
                innerRadius={50}
                outerRadius={80}
                valueFormatter={(val) => `₹${(val / 10000000).toFixed(2)} Cr`}
              />
            </Card>
          </div>

          {/* Chart Row 2: Bar Chart Trends & Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart: Brand shares */}
            <Card hoverable={false} className="lg:col-span-2 border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                  Top 10 Performing Consumer Brands
                </h4>
                <Badge variant="green">Market Value</Badge>
              </div>
              <NeoBarChart 
                data={brandSplit}
                xAxisKey="name"
                dataKeys={["value"]}
                colors={["#FFB347"]}
                valueFormatter={(val) => `₹${(val / 100000).toFixed(1)} L`}
              />
            </Card>

            {/* Demographics Donuts */}
            <Card hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                  Consumer Gender Matrix
                </h4>
                <Badge variant="pink">Demographics</Badge>
              </div>
              <NeoPieChart 
                data={genderSplit}
                innerRadius={0}
                outerRadius={75}
                valueFormatter={(val) => `${val.toLocaleString()} shoppers`}
              />
            </Card>
          </div>

          {/* Demographic splits Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age analysis */}
            <Card hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white">
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                  Target Shopper Age Cohorts
                </h4>
                <Badge variant="yellow">Age Analysis</Badge>
              </div>
              <NeoBarChart 
                data={ageSplit}
                xAxisKey="name"
                dataKeys={["value"]}
                colors={["#FF9ECF"]}
                valueFormatter={(val) => `${val.toLocaleString()} shoppers`}
              />
            </Card>

            {/* Top Products ranked */}
            <Card hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-5 bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-5">
                  <h4 className="text-base font-bold font-display uppercase tracking-tight text-[#111111]">
                    Top SKUs by Revenue
                  </h4>
                  <Badge variant="blue">KPI Rank</Badge>
                </div>
                
                {/* Table representation */}
                <div className="space-y-3">
                  {topProducts.map((p, idx) => (
                    <div 
                      key={p.name}
                      className="flex items-center justify-between p-3 border-2 border-[#111111] rounded-xl bg-gray-50 hover:translate-x-0.5 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-[#111111] text-white font-black text-xs flex items-center justify-center border border-[#111111]">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-xs uppercase block text-[#111111]">{p.name}</strong>
                          <span className="text-[9px] font-bold text-gray-500 uppercase">{p.brand} &bull; {p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <strong className="text-xs block text-[#111111]">₹{(p.revenue / 100000).toFixed(2)} L</strong>
                        <span className="text-[9px] font-bold text-[#6EE7B7] bg-[#111111] px-1 rounded block mt-0.5">+{p.growth}% Growth</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
