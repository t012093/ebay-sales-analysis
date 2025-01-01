'use client';

import { useState } from 'react';
import { Search, Download, Loader } from 'lucide-react';

interface ScrapingResult {
  status: string;
  items_count: number;
  csv_path: string;
  json_path: string;
}

export function ScrapingControl() {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxItems, setMaxItems] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScrapingResult | null>(null);

  const handleScrape = async () => {
    if (!searchTerm) {
      setError('検索語句を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search_term: searchTerm,
          max_items: maxItems,
        }),
      });

      if (!response.ok) {
        throw new Error('スクレイピングに失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const filename = path.split('/').pop();
      const response = await fetch(`http://localhost:8000/data/${filename}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'data';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('ファイルのダウンロードに失敗しました');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">データ収集</h2>
      
      <div className="space-y-4">
        {/* 検索フォーム */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索キーワード
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: Ichiban Kuji"
              />
            </div>
          </div>
          
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              取得件数
            </label>
            <input
              type="number"
              value={maxItems}
              onChange={(e) => setMaxItems(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="500"
            />
          </div>
        </div>

        {/* スクレイピングボタン */}
        <button
          onClick={handleScrape}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
              スクレイピング中...
            </>
          ) : (
            'スクレイピング開始'
          )}
        </button>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 結果表示 */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {result.items_count}件のデータを取得しました
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleDownload(result.csv_path)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700"
              >
                <Download className="h-5 w-5" />
                CSVをダウンロード
              </button>
              
              <button
                onClick={() => handleDownload(result.json_path)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700"
              >
                <Download className="h-5 w-5" />
                JSONをダウンロード
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}