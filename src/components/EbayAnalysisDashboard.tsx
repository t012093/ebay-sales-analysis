import { useState, useEffect } from 'react';
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { FilterSection } from '@/components/dashboard/FilterSection';
import { DataTable } from '@/components/dashboard/DataTable';

export default function EbayAnalysisDashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [profitMargin, setProfitMargin] = useState(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ebay_data.csv');
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const parsedData = rows.slice(1).map(row => {
          const item = {};
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
    averagePrice: filteredData.reduce((acc, curr) => acc + parseFloat(curr['価格(USD)'] || 0), 0) / filteredData.length || 0,
    totalItems: filteredData.length,
    highestPrice: Math.max(...filteredData.map(item => parseFloat(item['価格(USD)'] || 0)), 0),
    lowestPrice: Math.min(...filteredData.map(item => parseFloat(item['価格(USD)'] || 0)), 0)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">eBay販売データ分析</h1>
          <p className="text-gray-600">輸出入ビジネス分析ダッシュボード</p>
        </div>

        {/* 統計カード */}
        <StatisticsCards stats={stats} />

        {/* フィルターセクション */}
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          profitMargin={profitMargin}
          setProfitMargin={setProfitMargin}
        />

        {/* トレンドチャート */}
        <TrendChart data={filteredData} profitMargin={profitMargin} />

        {/* データテーブル */}
        <DataTable data={filteredData} profitMargin={profitMargin} />
      </div>
    </div>
  );
}