import React from 'react';
import { TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';
import type { Company } from '../types';

interface PerformanceTrendsProps {
  companies: Company[];
}

export function PerformanceTrends({ companies }: PerformanceTrendsProps) {
  const calculateAverages = () => {
    const total = companies.length;
    if (total === 0) return { base: 0, bull: 0, bear: 0 };

    const sum = companies.reduce(
      (acc, company) => ({
        base: acc.base + company.base_5year_return,
        bull: acc.bull + company.bull_5year_return,
        bear: acc.bear + company.bear_5year_return,
      }),
      { base: 0, bull: 0, bear: 0 }
    );

    return {
      base: sum.base / total,
      bull: sum.bull / total,
      bear: sum.bear / total,
    };
  };

  const averages = calculateAverages();
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
            <p className="text-sm text-gray-600">
              Average returns across all companies in different market scenarios over a 5-year period.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-gray-700 font-medium">Base Scenario</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPercent(averages.base)}</p>
          <p className="text-sm text-gray-500">Average Base Return</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-gray-700 font-medium">Bear Market</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{formatPercent(averages.bear)}</p>
          <p className="text-sm text-gray-500">Average Bear Return</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">Bull Market</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatPercent(averages.bull)}</p>
          <p className="text-sm text-gray-500">Average Bull Return</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-800">
          {averages.bear > -0.05 
            ? "Companies show strong resilience in bear markets"
            : averages.bull > 0.15
            ? "Companies demonstrate exceptional bull market performance"
            : "Companies show balanced performance across market conditions"}
        </p>
      </div>
    </div>
  );
}
