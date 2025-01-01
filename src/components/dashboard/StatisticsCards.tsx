'use client';

import React from 'react';

interface StatisticsCardsProps {
  stats: {
    totalItems: number;
    averagePrice: number;
    totalValue: number;
    uniqueSellers: number;
  };
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">総商品数</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {stats.totalItems.toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">平均価格</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          ${stats.averagePrice.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">総取引額</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          ${stats.totalValue.toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">ユニーク出品者数</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {stats.uniqueSellers.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatisticsCards;