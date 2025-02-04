import React from 'react';
import { X, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import type { Company } from '../types';

interface CompanyComparisonProps {
  companies: Company[];
  onClose: () => void;
  onRemove: (company: Company) => void;
}

export function CompanyComparison({ companies, onClose, onRemove }: CompanyComparisonProps) {
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  const metrics = [
    { key: 'overall_score', label: 'Overall Score' },
    { key: 'financial_health_score', label: 'Financial Health' },
    { key: 'company_viability_score', label: 'Company Viability' },
    { key: 'market_position_score', label: 'Market Position' },
    { key: 'revenue_quality_score', label: 'Revenue Quality' },
    { key: 'profitability_score', label: 'Profitability' },
    { key: 'outlook_score', label: 'Outlook' },
    { key: 'track_record_score', label: 'Track Record' },
    { key: 'alignment_score', label: 'Alignment' },
    { key: 'capital_allocation_score', label: 'Capital Allocation' },
    { key: 'analyst_sentiment_score', label: 'Analyst Sentiment' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Company Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 bg-gray-50"></th>
                    {companies.map(company => (
                      <th key={company.id} className="text-left py-2 px-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{company.name}</div>
                            <div className="text-sm text-gray-600">{company.ticker}</div>
                          </div>
                          <button
                            onClick={() => onRemove(company)}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-4">Base Return</td>
                    {companies.map(company => (
                      <td key={company.id} className="py-3 px-4">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 text-gray-600 mr-2" />
                          {formatPercent(company.base_5year_return)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4">Bear Return</td>
                    {companies.map(company => (
                      <td key={company.id} className="py-3 px-4">
                        <div className="flex items-center">
                          <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                          {formatPercent(company.bear_5year_return)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4">Bull Return</td>
                    {companies.map(company => (
                      <td key={company.id} className="py-3 px-4">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                          {formatPercent(company.bull_5year_return)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {metrics.map(({ key, label }) => (
                    <tr key={key} className="border-t">
                      <td className="py-3 px-4">{label}</td>
                      {companies.map(company => (
                        <td key={company.id} className="py-3 px-4">
                          <span className={`font-medium ${getScoreColor(company[key] as number)}`}>
                            {company[key]}/10
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
