'use client';

import React, { useState, useEffect } from 'react';
import { StatisticsCards } from '@/components/dashboard/StatisticsCards';
import { FilterSection } from '@/components/dashboard/FilterSection';
import { EnhancedCharts } from './EnhancedCharts';
import { EnhancedDataTable } from './EnhancedDataTable';
import { parseCSVData } from '@/utils/csvParser';

// 以下は既存のコードと同じ
export const ImprovedDashboard = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [profitMargin, setProfitMargin] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ebay_data.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const filteredData = data.filter(item => {
    const matchesRegion = selectedRegion === 'all' || item['発送元']?.includes(selectedRegion);
    const matchesSearch = Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesRegion && matchesSearch;
  });

  const stats = {
    totalItems: filteredData.length,
    averagePrice: filteredData.reduce((acc, curr) => {
      const price = parseFloat(curr['価格(USD)']) || 0;
      return acc + price;
    }, 0) / filteredData.length || 0,
    totalValue: filteredData.reduce((acc, curr) => {
      const price = parseFloat(curr['価格(USD)']) || 0;
      return acc + price;
    }, 0),
    uniqueSellers: new Set(filteredData.map(item => item['出品者'])).size
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
          <p className="text-gray-600">詳細な分析とインサイト</p>
        </div>

        <StatisticsCards stats={stats} />

        <div className="mb-6">
          <FilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            profitMargin={profitMargin}
            setProfitMargin={setProfitMargin}
          />
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex border-b">
            <button
              onClick={() => setActiveView('all')}
              className={`px-6 py-3 text-sm font-medium ${
                activeView === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              すべて表示
            </button>
            <button
              onClick={() => setActiveView('charts')}
              className={`px-6 py-3 text-sm font-medium ${
                activeView === 'charts'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              グラフ分析
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-6 py-3 text-sm font-medium ${
                activeView === 'table'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              データテーブル
            </button>
          </nav>
        </div>

        <div className="space-y-6">
          {(activeView === 'all' || activeView === 'charts') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">データ分析とインサイト</h2>
              <EnhancedCharts data={filteredData} profitMargin={profitMargin} />
            </div>
          )}

          {(activeView === 'all' || activeView === 'table') && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">商品リスト</h2>
                <p className="text-gray-600">
                  クリック可能なタイトルで商品ページに直接アクセス
                </p>
              </div>
              <EnhancedDataTable data={filteredData} profitMargin={profitMargin} />
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>データ最終更新: {new Date().toLocaleDateString()}</p>
          <p>表示件数: {filteredData.length} / 総件数: {data.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDashboard;