import type { ConsumerRecord, KPIStats, FilterState, ChartDataPoint, ProductSummary } from '../types';
import { generateMockData } from '../utils/mockDataGenerator';

// In-memory cache of database
let databaseCache: ConsumerRecord[] = [];

export function getMockData(): ConsumerRecord[] {
  if (databaseCache.length === 0) {
    databaseCache = generateMockData();
  }
  return databaseCache;
}

// Applies active filters dynamically
export function getFilteredData(filters: FilterState): ConsumerRecord[] {
  const data = getMockData();
  return data.filter(record => {
    if (filters.state && record.state !== filters.state) return false;
    if (filters.city && record.city !== filters.city) return false;
    if (filters.category && record.category !== filters.category) return false;
    if (filters.brand && record.brand !== filters.brand) return false;
    if (filters.product && record.product !== filters.product) return false;
    if (filters.year && String(record.year) !== filters.year) return false;
    if (filters.month && record.month !== filters.month) return false;
    if (filters.quarter && record.quarter !== filters.quarter) return false;
    if (filters.ageGroup && record.ageGroup !== filters.ageGroup) return false;
    if (filters.gender && record.gender !== filters.gender) return false;
    return true;
  });
}

// Calculate top KPIs
export function calculateKPIs(filtered: ConsumerRecord[]): KPIStats {
  if (filtered.length === 0) {
    return { totalRevenue: 0, totalSales: 0, marketShare: 0, consumerCount: 0, growth: 0 };
  }

  let totalRevenue = 0;
  let totalSales = 0;
  let totalConsumerCount = 0;
  let sumMarketShare = 0;
  let sumGrowth = 0;

  filtered.forEach(record => {
    totalRevenue += record.revenue;
    totalSales += record.sales;
    totalConsumerCount += record.consumerCount;
    sumMarketShare += record.marketShare;
    sumGrowth += record.growth;
  });

  return {
    totalRevenue,
    totalSales,
    consumerCount: totalConsumerCount,
    marketShare: parseFloat((sumMarketShare / filtered.length).toFixed(2)),
    growth: parseFloat((sumGrowth / filtered.length).toFixed(2))
  };
}

// Monthly sales & revenue trends
export function getMonthlyTrend(filtered: ConsumerRecord[]): ChartDataPoint[] {
  const monthsOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Group by year and month
  const grouped: Record<string, { revenue: number; sales: number }> = {};
  filtered.forEach(record => {
    const key = `${record.year} ${record.month}`;
    if (!grouped[key]) {
      grouped[key] = { revenue: 0, sales: 0 };
    }
    grouped[key].revenue += record.revenue;
    grouped[key].sales += record.sales;
  });

  // Sort chronologically
  return Object.entries(grouped)
    .map(([key, val]) => {
      const [year, month] = key.split(' ');
      return {
        name: key,
        revenue: val.revenue,
        sales: val.sales,
        year: parseInt(year),
        monthIndex: monthsOrder.indexOf(month)
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthIndex - b.monthIndex;
    })
    .map(item => ({
      name: item.name,
      revenue: item.revenue,
      sales: item.sales
    }));
}

// Category distribution
export function getCategoryDistribution(filtered: ConsumerRecord[]) {
  const grouped: Record<string, { revenue: number; sales: number; count: number }> = {};
  
  filtered.forEach(record => {
    const cat = record.category;
    if (!grouped[cat]) {
      grouped[cat] = { revenue: 0, sales: 0, count: 0 };
    }
    grouped[cat].revenue += record.revenue;
    grouped[cat].sales += record.sales;
    grouped[cat].count += 1;
  });

  const totalRev = filtered.reduce((sum, r) => sum + r.revenue, 0) || 1;

  return Object.entries(grouped).map(([name, val]) => ({
    name,
    value: val.revenue,
    sales: val.sales,
    percentage: parseFloat(((val.revenue / totalRev) * 100).toFixed(1))
  }));
}

// Brand share distribution
export function getBrandDistribution(filtered: ConsumerRecord[]) {
  const grouped: Record<string, { revenue: number; sales: number }> = {};
  
  filtered.forEach(record => {
    const brand = record.brand;
    if (!grouped[brand]) {
      grouped[brand] = { revenue: 0, sales: 0 };
    }
    grouped[brand].revenue += record.revenue;
    grouped[brand].sales += record.sales;
  });

  const totalRev = filtered.reduce((sum, r) => sum + r.revenue, 0) || 1;

  return Object.entries(grouped)
    .map(([name, val]) => ({
      name,
      value: val.revenue,
      sales: val.sales,
      percentage: parseFloat(((val.revenue / totalRev) * 100).toFixed(1))
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // top 10 brands
}

// Age demographics
export function getAgeDistribution(filtered: ConsumerRecord[]) {
  const ageOrder = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const grouped: Record<string, { revenue: number; consumerCount: number }> = {
    '18-24': { revenue: 0, consumerCount: 0 },
    '25-34': { revenue: 0, consumerCount: 0 },
    '35-44': { revenue: 0, consumerCount: 0 },
    '45-54': { revenue: 0, consumerCount: 0 },
    '55+': { revenue: 0, consumerCount: 0 }
  };

  filtered.forEach(record => {
    if (grouped[record.ageGroup]) {
      grouped[record.ageGroup].revenue += record.revenue;
      grouped[record.ageGroup].consumerCount += record.consumerCount;
    }
  });

  const totalCons = filtered.reduce((sum, r) => sum + r.consumerCount, 0) || 1;

  return ageOrder.map(age => ({
    name: age,
    revenue: grouped[age].revenue,
    value: grouped[age].consumerCount,
    percentage: parseFloat(((grouped[age].consumerCount / totalCons) * 100).toFixed(1))
  }));
}

// Gender demographics
export function getGenderDistribution(filtered: ConsumerRecord[]) {
  const grouped: Record<string, { revenue: number; consumerCount: number }> = {
    'Male': { revenue: 0, consumerCount: 0 },
    'Female': { revenue: 0, consumerCount: 0 },
    'Other': { revenue: 0, consumerCount: 0 }
  };

  filtered.forEach(record => {
    if (grouped[record.gender]) {
      grouped[record.gender].revenue += record.revenue;
      grouped[record.gender].consumerCount += record.consumerCount;
    }
  });

  const totalCons = filtered.reduce((sum, r) => sum + r.consumerCount, 0) || 1;

  return Object.entries(grouped).map(([name, val]) => ({
    name,
    revenue: val.revenue,
    value: val.consumerCount,
    percentage: parseFloat(((val.consumerCount / totalCons) * 100).toFixed(1))
  }));
}

// State distribution
export function getStateDistribution(filtered: ConsumerRecord[]) {
  const grouped: Record<string, { revenue: number; sales: number; growthSum: number; count: number }> = {};

  filtered.forEach(record => {
    const s = record.state;
    if (!grouped[s]) {
      grouped[s] = { revenue: 0, sales: 0, growthSum: 0, count: 0 };
    }
    grouped[s].revenue += record.revenue;
    grouped[s].sales += record.sales;
    grouped[s].growthSum += record.growth;
    grouped[s].count += 1;
  });

  return Object.entries(grouped)
    .map(([name, val]) => ({
      name,
      revenue: val.revenue,
      sales: val.sales,
      growth: parseFloat((val.growthSum / val.count).toFixed(2))
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

// City distribution
export function getCityDistribution(filtered: ConsumerRecord[]) {
  const grouped: Record<string, { revenue: number; sales: number; state: string }> = {};

  filtered.forEach(record => {
    const c = record.city;
    if (!grouped[c]) {
      grouped[c] = { revenue: 0, sales: 0, state: record.state };
    }
    grouped[c].revenue += record.revenue;
    grouped[c].sales += record.sales;
  });

  return Object.entries(grouped)
    .map(([name, val]) => ({
      name,
      state: val.state,
      revenue: val.revenue,
      sales: val.sales
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

// Top Products Rank
export function getProductRanking(filtered: ConsumerRecord[], limit = 10) {
  const grouped: Record<string, { revenue: number; sales: number; category: string; brand: string; growthSum: number; count: number }> = {};

  filtered.forEach(record => {
    const p = record.product;
    if (!grouped[p]) {
      grouped[p] = { revenue: 0, sales: 0, category: record.category, brand: record.brand, growthSum: 0, count: 0 };
    }
    grouped[p].revenue += record.revenue;
    grouped[p].sales += record.sales;
    grouped[p].growthSum += record.growth;
    grouped[p].count += 1;
  });

  return Object.entries(grouped)
    .map(([name, val]) => ({
      name,
      brand: val.brand,
      category: val.category,
      revenue: val.revenue,
      sales: val.sales,
      growth: parseFloat((val.growthSum / val.count).toFixed(2))
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// Top Brands Rank
export function getBrandRanking(filtered: ConsumerRecord[], limit = 10) {
  const grouped: Record<string, { revenue: number; sales: number; category: string; growthSum: number; count: number }> = {};

  filtered.forEach(record => {
    const b = record.brand;
    if (!grouped[b]) {
      grouped[b] = { revenue: 0, sales: 0, category: record.category, growthSum: 0, count: 0 };
    }
    grouped[b].revenue += record.revenue;
    grouped[b].sales += record.sales;
    grouped[b].growthSum += record.growth;
    grouped[b].count += 1;
  });

  return Object.entries(grouped)
    .map(([name, val]) => ({
      name,
      category: val.category,
      revenue: val.revenue,
      sales: val.sales,
      growth: parseFloat((val.growthSum / val.count).toFixed(2))
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

// Detailed product statistics
export function getProductDetails(productName: string): ProductSummary | null {
  const allData = getMockData();
  const productData = allData.filter(r => r.product === productName);

  if (productData.length === 0) return null;

  const first = productData[0];
  const totalRevenue = productData.reduce((sum, r) => sum + r.revenue, 0);
  const totalSales = productData.reduce((sum, r) => sum + r.sales, 0);
  const avgGrowth = productData.reduce((sum, r) => sum + r.growth, 0) / productData.length;
  const avgMarketShare = productData.reduce((sum, r) => sum + r.marketShare, 0) / productData.length;

  // Top states for this product
  const stateRev: Record<string, number> = {};
  productData.forEach(r => {
    stateRev[r.state] = (stateRev[r.state] || 0) + r.revenue;
  });
  const topStates = Object.entries(stateRev)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top cities for this product
  const cityRev: Record<string, number> = {};
  productData.forEach(r => {
    cityRev[r.city] = (cityRev[r.city] || 0) + r.revenue;
  });
  const topCities = Object.entries(cityRev)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    name: productName,
    brand: first.brand,
    category: first.category,
    revenue: totalRevenue,
    sales: totalSales,
    growth: parseFloat(avgGrowth.toFixed(2)),
    marketShare: parseFloat(avgMarketShare.toFixed(2)),
    topCities,
    topStates
  };
}

// Comparison queries
export function getComparisonData(
  type: 'state' | 'city' | 'brand' | 'product' | 'category',
  itemA: string,
  itemB: string,
  globalFilters: Partial<FilterState>
) {
  const allData = getMockData();

  // Helper to filter items based on global filters (excluding the item type filter itself)
  const applyCommonFilters = (record: ConsumerRecord) => {
    if (globalFilters.year && String(record.year) !== globalFilters.year) return false;
    if (globalFilters.month && record.month !== globalFilters.month) return false;
    if (globalFilters.quarter && record.quarter !== globalFilters.quarter) return false;
    if (globalFilters.ageGroup && record.ageGroup !== globalFilters.ageGroup) return false;
    if (globalFilters.gender && record.gender !== globalFilters.gender) return false;
    return true;
  };

  const dataA = allData.filter(r => r[type] === itemA && applyCommonFilters(r));
  const dataB = allData.filter(r => r[type] === itemB && applyCommonFilters(r));

  const kpisA = calculateKPIs(dataA);
  const kpisB = calculateKPIs(dataB);

  // Monthly trends for comparison
  const monthlyA = getMonthlyTrend(dataA);
  const monthlyB = getMonthlyTrend(dataB);

  // Merge trends for comparison charts
  const mergedTrendsMap: Record<string, { name: string; revenueA: number; salesA: number; revenueB: number; salesB: number }> = {};
  
  monthlyA.forEach(pt => {
    mergedTrendsMap[pt.name] = { name: pt.name, revenueA: pt.revenue, salesA: pt.sales, revenueB: 0, salesB: 0 };
  });

  monthlyB.forEach(pt => {
    if (mergedTrendsMap[pt.name]) {
      mergedTrendsMap[pt.name].revenueB = pt.revenue;
      mergedTrendsMap[pt.name].salesB = pt.sales;
    } else {
      mergedTrendsMap[pt.name] = { name: pt.name, revenueA: 0, salesA: 0, revenueB: pt.revenue, salesB: pt.sales };
    }
  });

  // Sort trend chronologically
  const sortedTrends = Object.values(mergedTrendsMap).sort((a, b) => {
    // String split comparison: "2024 January"
    const [yA, mA] = a.name.split(' ');
    const [yB, mB] = b.name.split(' ');
    const monthsOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (yA !== yB) return parseInt(yA) - parseInt(yB);
    return monthsOrder.indexOf(mA) - monthsOrder.indexOf(mB);
  });

  // Top products comparison
  const productsA = getProductRanking(dataA, 5);
  const productsB = getProductRanking(dataB, 5);

  return {
    itemA: {
      name: itemA,
      kpis: kpisA,
      topProducts: productsA
    },
    itemB: {
      name: itemB,
      kpis: kpisB,
      topProducts: productsB
    },
    trendComparison: sortedTrends
  };
}
