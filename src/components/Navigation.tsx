'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout, BarChart } from 'lucide-react';

export function Navigation() {
  const [activePage, setActivePage] = useState('viewer');

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <Link 
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePage === 'viewer' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActivePage('viewer')}
              >
                <Layout className="h-5 w-5 mr-2" />
                データビューア
              </Link>

              <Link 
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePage === 'dashboard' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActivePage('dashboard')}
              >
                <BarChart className="h-5 w-5 mr-2" />
                ダッシュボード
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}