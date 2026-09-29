import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  title?: string;
  actions?: React.ReactNode;
  rowsPerPageDefault?: number;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKeys = [],
  title,
  actions,
  rowsPerPageDefault = 10
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

  // Sorting handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm && searchKeys.length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        searchKeys.some(key => {
          const val = item[key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return direction === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return direction === 'asc' ? -1 : 1;
        if (strA > strB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  
  // Adjust current page if out of bounds after filtering
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedData = useMemo(() => {
    const start = (activePage - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, activePage, rowsPerPage]);

  // CSV Export utility
  const exportToCSV = () => {
    if (data.length === 0) return;

    // Header row
    const headers = columns.map(c => c.header).join(',');
    
    // Value rows
    const rows = processedData.map(item => 
      columns.map(col => {
        const val = item[col.key];
        // Handle commas or quotes in values
        const escaped = String(val === undefined || val === null ? '' : val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title ? title.toLowerCase().replace(/\s+/g, '_') : 'marketpulse_report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card hoverable={false} className="overflow-hidden bg-white p-0">
      {/* Table Header Controls */}
      <div className="p-5 border-b-3 border-[#111111] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FF9ECF]/10">
        <div>
          {title && (
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111] mb-1">
              {title}
            </h3>
          )}
          <p className="text-xs font-semibold text-gray-600">
            Showing {processedData.length === 0 ? 0 : (activePage - 1) * rowsPerPage + 1} to {Math.min(activePage * rowsPerPage, processedData.length)} of {processedData.length} records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {searchKeys.length > 0 && (
            <div className="w-full sm:w-64">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to page 1
                }}
                icon={<Search className="w-5 h-5 text-gray-500 stroke-[2.5]" />}
                className="py-1.5 text-xs text-[#111111]"
              />
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {actions}
            <Button variant="yellow" size="sm" onClick={exportToCSV} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2 stroke-[3]" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-3 border-[#111111] bg-white">
              {columns.map((col) => {
                const isSorted = sortConfig?.key === col.key;
                const isAsc = sortConfig?.direction === 'asc';

                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={`p-4 font-bold font-display uppercase text-xs tracking-wider border-r-2 border-gray-200 last:border-0 ${
                      col.sortable !== false ? 'cursor-pointer select-none hover:bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable !== false && (
                        <span className="text-[#111111]">
                          {isSorted ? (
                            isAsc ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="opacity-30 group-hover:opacity-100 flex flex-col">
                              <ChevronUp className="w-2.5 h-2.5 -mb-0.5 stroke-[3]" />
                              <ChevronDown className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 font-bold text-gray-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  className="border-b-2 border-gray-100 hover:bg-[#FAFAFA] transition-colors last:border-b-0"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="p-4 text-sm font-semibold text-[#111111] border-r-2 border-gray-100 last:border-0"
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t-3 border-[#111111] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 uppercase">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border-2 border-[#111111] rounded-lg font-bold text-xs bg-white cursor-pointer focus:outline-none"
            >
              {[5, 10, 25, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="white"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={activePage === 1}
              className="py-1 px-2 border-2 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isCurrent = page === activePage;
                return (
                  <Button
                    key={page}
                    variant={isCurrent ? 'yellow' : 'white'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0 border-2 rounded-lg text-xs"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="white"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={activePage === totalPages}
              className="py-1 px-2 border-2 rounded-lg"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
