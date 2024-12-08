'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

interface ColumnConfig {
  key: string;
  label: string;
  format?: (value: any) => string;
}

const columnConfigs: ColumnConfig[] = [
  { key: 'タイトル', label: '商品名' },
  { key: '商品の状態', label: '状態' },
  { key: '発送元', label: '発送元' },
  { 
    key: '送料', 
    label: '送料',
    format: (value) => value.includes('円') ? value : `${value}`
  },
  { 
    key: '価格(表示)', 
    label: '表示価格',
    format: (value) => value.includes('円') ? value : `${parseFloat(value).toLocaleString()} 円`
  },
  { 
    key: '価格(USD)', 
    label: '価格 (USD)',
    format: (value) => `$${parseFloat(value).toFixed(2)}`
  }
];

interface EbayDataTableProps {
  data: any[];
}

export function EbayDataTable({ data }: EbayDataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });

  const formatValue = (value: any, config: ColumnConfig) => {
    if (!value) return '-';
    return config.format ? config.format(value) : value;
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // 価格の場合は数値として比較
    if (sortConfig.key === '価格(USD)') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columnConfigs.map((config) => (
              <th
                key={config.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(config.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{config.label}</span>
                  {sortConfig.key === config.key ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columnConfigs.map((config) => (
                <td
                  key={config.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {formatValue(item[config.key], config)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}