'use client';

import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

interface DataTableProps {
  data: any[];
  searchTerm: string;
  sortConfig: { key: string | null; direction: 'asc' | 'desc' };
  setSortConfig: (config: { key: string | null; direction: 'asc' | 'desc' }) => void;
}

export function DataTable({ data, searchTerm, sortConfig, setSortConfig }: DataTableProps) {
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (items: any[]) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // 検索機能
  const filteredData = data.filter(item => 
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = getSortedData(filteredData);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice);
  };

  if (data.length === 0) {
    return <div className="p-6 text-center text-gray-500">データを読み込み中...</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.key === header ? (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.entries(item).map(([key, value], cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {key === '価格(USD)' ? formatPrice(value) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>検索結果: {sortedData.length} 件</span>
          {sortedData.length > 0 && (
            <span>
              平均価格: {formatPrice(
                sortedData.reduce((acc, curr) => acc + parseFloat(curr['価格(USD)']), 0) / sortedData.length
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}