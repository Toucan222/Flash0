import React from 'react';
import { TrendingUp, Award, Users, LineChart } from 'lucide-react';
import type { Company } from '../types';

interface QuickStatsProps {
  data: {
    totalCompanies: number;
    avgOverallScore: number;
    topPerformer: Company | null;
    highestBullReturn: number;
  };
}

export function QuickStats({ data }: QuickStatsProps) {
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Companies</p>
            <p className="text-2xl font-bold text-gray-900">{data.totalCompanies}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{data.avgOverallScore}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <LineChart className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Top Performer</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.topPerformer?.ticker || 'N/A'}
            </p>
            {data.topPerformer && (
              <p className="text-sm text-gray-500">{data.topPerformer.name}</p>
            )}
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Highest Bull Return</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercent(data.highestBullReturn)}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
