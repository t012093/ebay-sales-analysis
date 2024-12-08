'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { EbayDataTable } from './EbayDataTable';
import { parseCSVData } from '@/utils/csvParser';

export function EbayDataViewer() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ebay_data.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parsedData = parseCSVData(text);
        setData(parsedData);
        setError(null);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        setError('データの読み込み中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 検索フィルター
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">eBay販売データビューア</h1>
        
        {/* 検索バー */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* データ概要 */}
        <div className="mb-4 text-sm text-gray-600">
          <span>総アイテム数: {filteredData.length}</span>
          {searchTerm && (
            <span className="ml-4">検索結果: {filteredData.length} 件</span>
          )}
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <EbayDataTable data={filteredData} />
        )}
      </div>
    </div>
  );
}