'use client';

import { useState, useEffect } from 'react';
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { FilterSection } from '@/components/dashboard/FilterSection';
import { DataTable } from '@/components/dashboard/DataTable';
import { parseCSVData } from '@/utils/csvParser';

export default function EbayAnalysisDashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [profitMargin, setProfitMargin] = useState(30);
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

  // 価格を数値として取得する関数
  const getPriceAsNumber = (item: any) => {
    const price = item['価格(USD)'];
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      if (price.includes('円')) {
        return (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150;
      }
      return parseFloat(price) || 0;
    }
    return 0;
  };

  // 地域別フィルター
  const filteredByRegion = data.filter(item => {
    if (selectedRegion === 'all') return true;
    return item['発送元']?.includes(selectedRegion);
  });

  // 検索フィルター
  const filteredData = filteredByRegion.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 統計情報の計算
  const stats = {
    averagePrice: filteredData.reduce((acc, curr) => acc + getPriceAsNumber(curr), 0) / filteredData.length || 0,
    totalItems: filteredData.length,
    highestPrice: Math.max(...filteredData.map(item => getPriceAsNumber(item)), 0),
    lowestPrice: Math.min(...filteredData.map(item => getPriceAsNumber(item)), 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">eBay販売データ分析</h1>
          <p className="text-gray-600">輸出入ビジネス分析ダッシュボード</p>
        </div>

        <StatisticsCards stats={stats} />

        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          profitMargin={profitMargin}
          setProfitMargin={setProfitMargin}
        />

        <TrendChart data={filteredData} profitMargin={profitMargin} />

        <DataTable data={filteredData} profitMargin={profitMargin} />
      </div>
    </div>
  );
}