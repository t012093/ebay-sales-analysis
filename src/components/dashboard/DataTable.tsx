'use client';

interface DataTableProps {
  data: any[];
  profitMargin: number;
}

export function DataTable({ data, profitMargin }: DataTableProps) {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'string' && price.includes('円')) {
      // 円表示の場合、数値を抽出して変換
      const numericValue = parseFloat(price.replace(/[^\d.-]/g, '')) || 0;
      return `¥${numericValue.toLocaleString()}`;
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '-' : `$${numPrice.toFixed(2)}`;
  };

  const calculateProfit = (price: string | number) => {
    let numPrice = 0;
    if (typeof price === 'string') {
      if (price.includes('円')) {
        // 円をドルに概算変換 (レート: 150円 = $1と仮定)
        numPrice = (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150;
      } else {
        numPrice = parseFloat(price) || 0;
      }
    } else {
      numPrice = price || 0;
    }
    return numPrice * (profitMargin / 100);
  };

  const formatShipping = (shipping: string) => {
    if (!shipping) return '-';
    if (shipping === '送料無料') return '送料無料';
    if (shipping.includes('円')) {
      const numericValue = parseFloat(shipping.replace(/[^\d.-]/g, '')) || 0;
      return `¥${numericValue.toLocaleString()}`;
    }
    return shipping;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">発送元</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予想利益</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">送料</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item['タイトル'] || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item['商品の状態'] || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item['発送元'] || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(item['価格(表示)'] || item['価格(USD)'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  ${calculateProfit(item['価格(USD)']).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatShipping(item['送料'])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}