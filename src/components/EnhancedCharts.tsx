'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const EnhancedCharts = ({ data, profitMargin }) => {
  // データの前処理
  const getPriceAsNumber = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      if (price.includes('円')) {
        return (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150;
      }
      return parseFloat(price) || 0;
    }
    return 0;
  };

  // 価格帯別の分布データ
  const getPriceRangeDistribution = () => {
    const ranges = {
      '0-50': 0,
      '51-100': 0,
      '101-200': 0,
      '201-500': 0,
      '501+': 0,
    };

    data.forEach(item => {
      const price = getPriceAsNumber(item['価格(USD)']);
      if (price <= 50) ranges['0-50']++;
      else if (price <= 100) ranges['51-100']++;
      else if (price <= 200) ranges['101-200']++;
      else if (price <= 500) ranges['201-500']++;
      else ranges['501+']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));
  };

  // 出品者別の集計データ
  const getSellerDistribution = () => {
    const sellerCounts = {};
    data.forEach(item => {
      const seller = item['出品者'] || 'Unknown';
      sellerCounts[seller] = (sellerCounts[seller] || 0) + 1;
    });

    return Object.entries(sellerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([seller, count]) => ({
        seller,
        count,
      }));
  };

  // 地域別の平均価格データ
  const getRegionPriceData = () => {
    const regionData = {};
    data.forEach(item => {
      const region = item['発送元'] || 'Unknown';
      if (!regionData[region]) {
        regionData[region] = {
          total: 0,
          count: 0,
        };
      }
      regionData[region].total += getPriceAsNumber(item['価格(USD)']);
      regionData[region].count++;
    });

    return Object.entries(regionData)
      .map(([region, { total, count }]) => ({
        region,
        averagePrice: total / count,
      }))
      .sort((a, b) => b.averagePrice - a.averagePrice)
      .slice(0, 8);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* 価格帯分布グラフ */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">価格帯別の商品数分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getPriceRangeDistribution()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="商品数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 出品者分布グラフ */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">主要出品者別の商品数</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={getSellerDistribution()}
              dataKey="count"
              nameKey="seller"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {getSellerDistribution().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 地域別平均価格グラフ */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">地域別の平均価格</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getRegionPriceData()} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" width={100} />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="averagePrice" fill="#82ca9d" name="平均価格" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnhancedCharts;