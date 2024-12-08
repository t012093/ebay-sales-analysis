'use client';

import { DollarSign, TrendingUp, Globe, Package } from 'lucide-react';

interface StatsData {
  averagePrice: number;
  totalItems: number;
  highestPrice: number;
  lowestPrice: number;
}

export function StatisticsCards({ stats }: { stats: StatsData }) {
  const formatPrice = (price: number) => {
    return isNaN(price) ? '-' : `$${price.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">平均価格</p>
            <p className="text-xl font-bold">{formatPrice(stats.averagePrice)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">総アイテム数</p>
            <p className="text-xl font-bold">{stats.totalItems}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">最高価格</p>
            <p className="text-xl font-bold">{formatPrice(stats.highestPrice)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <Globe className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">最低価格</p>
            <p className="text-xl font-bold">{formatPrice(stats.lowestPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}