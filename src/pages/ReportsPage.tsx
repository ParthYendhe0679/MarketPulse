import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  SlidersHorizontal, 
  Printer 
} from 'lucide-react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { getFilteredData } from '../services/dataService';
import { STATES_AND_CITIES, CATEGORIES_BRANDS_PRODUCTS, YEARS } from '../constants';
import type { FilterState } from '../types';

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<Partial<FilterState>>({
    state: '',
    category: '',
    year: '2026'
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Get active filtered dataset
  const reportData = useMemo(() => {
    const queryFilters: FilterState = {
      state: filters.state || '',
      city: '',
      category: filters.category || '',
      brand: '',
      product: '',
      year: filters.year || '',
      month: '',
      quarter: '',
      ageGroup: '',
      gender: ''
    };
    return getFilteredData(queryFilters);
  }, [filters]);

  // Define Table Columns
  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'year', header: 'Year', sortable: true },
    { key: 'month', header: 'Month', sortable: true },
    { key: 'state', header: 'State', sortable: true },
    { key: 'city', header: 'City', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'brand', header: 'Brand', sortable: true },
    { key: 'product', header: 'Product', sortable: true },
    { 
      key: 'revenue', 
      header: 'Revenue', 
      sortable: true,
      render: (item: any) => `₹${item.revenue.toLocaleString()}` 
    },
    { 
      key: 'sales', 
      header: 'Sales', 
      sortable: true,
      render: (item: any) => `${item.sales.toLocaleString()} units` 
    },
    { 
      key: 'consumerCount', 
      header: 'Consumers', 
      sortable: true,
      render: (item: any) => item.consumerCount.toLocaleString() 
    },
    { 
      key: 'growth', 
      header: 'Growth %', 
      sortable: true,
      render: (item: any) => (
        <span className={`font-black ${item.growth >= 0 ? 'text-[#6EE7B7]' : 'text-[#FF6B6B]'}`}>
          {item.growth >= 0 ? '+' : ''}{item.growth}%
        </span>
      )
    }
  ];

  // Excel Export Simulator (Outputs a clean tab-delimited file compatible with Excel)
  const handleExcelExport = () => {
    if (reportData.length === 0) return;

    // Header row
    const headers = columns.map(c => c.header).join('\t');
    
    // Value rows
    const rows = reportData.map(item => 
      columns.map(col => {
        if (col.key === 'revenue') return item.revenue;
        if (col.key === 'sales') return item.sales;
        if (col.key === 'growth') return `${item.growth}%`;
        return (item as any)[col.key];
      }).join('\t')
    );

    const xlsContent = "data:application/vnd.ms-excel;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(xlsContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marketpulse_excel_report.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / Document Print Mode
  const handlePdfExport = () => {
    window.print();
  };

  return (
    <div className="py-6 space-y-6 print:p-0 print:bg-white print:text-black">
      {/* Header - Hidden in Print */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="green">Document Center</Badge>
            <Badge variant="blue">Raw Logs</Badge>
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Reports & Export Builder
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Generate and export custom consumer analytical reports in Excel, CSV, or formatted PDF styles.
          </p>
        </div>
      </div>

      {/* Filter panel - Hidden in Print */}
      <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5 shadow-[4px_4px_0px_0px_#111111] print:hidden">
        <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-[#4F7DF9] stroke-[2.5]" />
          <h3 className="font-display font-bold uppercase text-sm tracking-wide">
            Report Query Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Dropdown
            label="Filter State"
            placeholder="All States"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            options={Object.keys(STATES_AND_CITIES).map(s => ({ value: s, label: s }))}
          />

          <Dropdown
            label="Filter Category"
            placeholder="All Categories"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={Object.keys(CATEGORIES_BRANDS_PRODUCTS).map(c => ({ value: c, label: c }))}
          />

          <Dropdown
            label="Filter Year"
            placeholder="All Years"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={YEARS.map(y => ({ value: String(y), label: String(y) }))}
          />
        </div>
      </Card>

      {/* Main Table view */}
      <div className="print:border-0">
        <Table 
          data={reportData}
          columns={columns}
          title="Consumer Consumption Database Ledger"
          searchPlaceholder="Search database ID, brand, products..."
          searchKeys={['id', 'brand', 'product', 'city', 'state']}
          actions={
            <>
              <Button 
                variant="pink" 
                size="sm" 
                onClick={handleExcelExport} 
                className="print:hidden text-xs"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1.5 stroke-[3]" /> Excel
              </Button>
              <Button 
                variant="white" 
                size="sm" 
                onClick={handlePdfExport} 
                className="print:hidden text-xs"
              >
                <Printer className="w-4 h-4 mr-1.5 stroke-[3]" /> Print/PDF
              </Button>
            </>
          }
        />
      </div>

      {/* Print Notice Details - Only visible during print */}
      <div className="hidden print:block border-t-3 border-[#111111] pt-6 mt-12 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
        <p>MarketPulse AI Platform Report &bull; Printed Local Timestamp: {new Date().toLocaleString()}</p>
        <p className="mt-1">Seed Synchronized Consumer Consumption Database ledger</p>
      </div>
    </div>
  );
};
export default ReportsPage;
