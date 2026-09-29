export interface ConsumerRecord {
  id: string;
  state: string;
  city: string;
  brand: string;
  category: string;
  product: string;
  revenue: number;
  sales: number;
  consumerCount: number;
  marketShare: number;
  growth: number;
  date: string;
  month: string;
  year: number;
  quarter: string;
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  gender: 'Male' | 'Female' | 'Other';
}

export interface KPIStats {
  totalRevenue: number;
  totalSales: number;
  marketShare: number;
  consumerCount: number;
  growth: number;
}

export interface FilterState {
  state: string;
  city: string;
  category: string;
  brand: string;
  product: string;
  year: string;
  month: string;
  quarter: string;
  ageGroup: string;
  gender: string;
}

export interface ComparisonState {
  type: 'state' | 'city' | 'brand' | 'product' | 'category';
  itemA: string;
  itemB: string;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  sales: number;
  marketShare?: number;
  growth?: number;
}

export interface ProductSummary {
  name: string;
  brand: string;
  category: string;
  revenue: number;
  sales: number;
  growth: number;
  marketShare: number;
  topCities: { name: string; revenue: number }[];
  topStates: { name: string; revenue: number }[];
}
