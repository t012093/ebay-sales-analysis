'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { DataTable } from './DataTable';
import { SearchBar } from './SearchBar';

export function EbayDataViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // CSVファイルを読み込む
    const loadData = async () => {
      try {
        const response = await fetch('/data/ebay_data.csv');
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const parsedData = rows.slice(1).map(row => {
          const item: { [key: string]: string } = {};
          headers.forEach((header, index) => {
            item[header] = row[index];
          });
          return item;
        });
        setData(parsedData);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">eBay販売データビューア</h1>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <DataTable 
          data={data} 
          searchTerm={searchTerm} 
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
      </div>
    </div>
  );
}