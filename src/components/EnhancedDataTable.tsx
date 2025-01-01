'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'price' | 'date' | 'title' | 'seller' | 'location' | 'profit';
type SortOrder = 'asc' | 'desc';

export const EnhancedDataTable = ({ data, profitMargin }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const formatPrice = (price) => {
    if (typeof price === 'number') return `$${price.toFixed(2)}`;
    if (typeof price === 'string' && price.includes('円')) {
      const usdPrice = (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150;
      return `$${usdPrice.toFixed(2)}`;
    }
    return price;
  };

  const getPriceValue = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      if (price.includes('円')) {
        return (parseFloat(price.replace(/[^\d.-]/g, '')) || 0) / 150;
      }
      return parseFloat(price) || 0;
    }
    return 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '日時不明';
    try {
      // Unix timestampの場合
      if (typeof dateStr === 'number') {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      // 文字列の場合、様々な形式に対応
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // 日付が不正な場合
        return '日時不明';
      }
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Date formatting error:', e);
      return '日時不明';
    }
  };

  const getDateValue = (dateStr) => {
    if (!dateStr) return 0;
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    } catch (e) {
      return 0;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'price':
        return (getPriceValue(a['価格(USD)']) - getPriceValue(b['価格(USD)'])) * modifier;
      case 'date':
        return (getDateValue(a['販売日時']) - getDateValue(b['販売日時'])) * modifier;
      case 'title':
        return (a['タイトル'] || '').localeCompare(b['タイトル'] || '') * modifier;
      case 'seller':
        return (a['出品者'] || '').localeCompare(b['出品者'] || '') * modifier;
      case 'location':
        return (a['発送元'] || '').localeCompare(b['発送元'] || '') * modifier;
      case 'profit':
        return (getPriceValue(a['価格(USD)']) * (profitMargin / 100) - 
                getPriceValue(b['価格(USD)']) * (profitMargin / 100)) * modifier;
      default:
        return 0;
    }
  });

  const SortHeader = ({ field, label }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col">
          <ChevronUp 
            className={`h-3 w-3 -mb-1 ${sortField === field && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <ChevronDown 
            className={`h-3 w-3 ${sortField === field && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
        </span>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="date" label="販売日時" />
              <SortHeader field="title" label="タイトル" />
              <SortHeader field="price" label="価格" />
              <SortHeader field="seller" label="出品者" />
              <SortHeader field="location" label="発送元" />
              <SortHeader field="profit" label="予想利益" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => {
              const price = getPriceValue(item['価格(USD)']);
              const estimatedProfit = price * (profitMargin / 100);
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item['販売日時'])}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={item['URL']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                    >
                      {item['タイトル']}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm">{formatPrice(item['価格(USD)'])}</td>
                  <td className="px-6 py-4 text-sm">{item['出品者'] || '-'}</td>
                  <td className="px-6 py-4 text-sm">{item['発送元'] || '-'}</td>
                  <td className="px-6 py-4 text-sm">${estimatedProfit.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedDataTable;