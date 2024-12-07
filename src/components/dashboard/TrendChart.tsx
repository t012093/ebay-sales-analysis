'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendDataPoint {
  name: string;
  価格: number;
  利益: number;
}

interface TrendChartProps {
  data: any[];
  profitMargin: number;
}

export function TrendChart({ data, profitMargin }: TrendChartProps) {
  // データを日付でグループ化し、平均価格を計算
  const groupedData = data.reduce((acc: { [key: string]: number[] }, item) => {
    const date = item['販売日時'] || 'N/A';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(parseFloat(item['価格(USD)']) || 0);
    return acc;
  }, {});

  const trendData: TrendDataPoint[] = Object.entries(groupedData).map(([date, prices]) => {
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    return {
      name: date,
      価格: avgPrice,
      利益: avgPrice * (profitMargin / 100)
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">価格トレンド分析</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="価格" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="利益" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}