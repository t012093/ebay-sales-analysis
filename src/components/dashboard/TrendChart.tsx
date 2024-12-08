'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
  // 価格を数値として取得する関数
  const getPriceAsNumber = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      if (price.includes('円')) {
        return (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150; // 円をドルに換算
      }
      return parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
    }
    return 0;
  };

  // データを日付でソート
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a['販売日時'] || '').getTime();
    const dateB = new Date(b['販売日時'] || '').getTime();
    return dateA - dateB;
  });

  // グラフ用のデータを作成
  const chartData = sortedData.map(item => {
    const price = getPriceAsNumber(item['価格(USD)']);
    return {
      name: item['販売日時'] || '日付なし',
      価格: Number(price.toFixed(2)),
      利益: Number((price * (profitMargin / 100)).toFixed(2))
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="text-gray-600">{label}</p>
          <p className="text-blue-600">価格: ${payload[0].value}</p>
          <p className="text-green-600">予想利益: ${payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">価格トレンド分析</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#6b7280' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="価格" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="利益" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        表示されている価格はUSDでの表示です。円表示の商品は1ドル=150円で換算しています。
      </div>
    </div>
  );
}