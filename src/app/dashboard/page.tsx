'use client';

import EbayAnalysisDashboard from '@/components/EbayAnalysisDashboard';
import { ScrapingControl } from '@/components/ScrapingControl';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4 space-y-6">
        <ScrapingControl />
        <EbayAnalysisDashboard />
      </div>
    </div>
  );
}