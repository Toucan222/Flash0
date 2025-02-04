import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Star, Scale, Headphones, Info } from 'lucide-react';
import type { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  selectedMetrics: Array<keyof Company>;
  onClick: () => void;
  onCompare: () => void;
  isSelected: boolean;
  viewMode: 'grid' | 'compact';
}

export function CompanyCard({ company, selectedMetrics, onClick, onCompare, isSelected, viewMode }: CompanyCardProps) {
  const [showPodcastInfo, setShowPodcastInfo] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-50 text-green-700 border-green-200';
    if (score >= 7) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getMetricColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    return 'text-gray-600';
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  const metricLabels: Record<string, string> = {
    financial_health_score: 'Financial Health',
    market_position_score: 'Market Position',
    company_viability_score: 'Company Viability',
    revenue_quality_score: 'Revenue Quality',
    profitability_score: 'Profitability',
    outlook_score: 'Outlook',
    track_record_score: 'Track Record'
  };

  const podcastUrl = `https://api.example.com/podcasts/${company.ticker.toLowerCase()}.mp3`;

  if (viewMode === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-grow cursor-pointer" onClick={onClick}>
            <div>
              <h3 className="font-semibold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-600">{company.ticker}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-sm ${getScoreColor(company.overall_score)}`}>
              {company.overall_score.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isSelected
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-lg transition-all relative group">
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPodcastInfo(!showPodcastInfo);
            }}
            className="p-1.5 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full transition-colors"
            title="AI Analysis"
          >
            <Headphones className="w-4 h-4" />
          </button>
          {showPodcastInfo && (
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-purple-100 z-10 text-sm text-gray-600">
              <p>Listen to our AI-generated analysis of {company.name}'s performance and market position.</p>
              <audio controls className="mt-2 w-full" src={podcastUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
          className={`p-1.5 rounded-full transition-colors ${
            isSelected
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
            <p className="text-sm text-gray-600">{company.ticker}</p>
          </div>
          <div className={`flex items-center px-3 py-1.5 rounded-full border ${getScoreColor(company.overall_score)}`}>
            <Star className="w-4 h-4 mr-1" />
            <span className="font-semibold">{company.overall_score.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
            <Activity className="w-4 h-4 text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Base</span>
            <span className="text-sm font-semibold">{formatPercent(company.base_5year_return)}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-red-50 rounded border border-red-100 hover:bg-red-100 transition-colors">
            <TrendingDown className="w-4 h-4 text-red-600 mb-1" />
            <span className="text-xs text-gray-600">Bear</span>
            <span className="text-sm font-semibold">{formatPercent(company.bear_5year_return)}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-green-50 rounded border border-green-100 hover:bg-green-100 transition-colors">
            <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
            <span className="text-xs text-gray-600">Bull</span>
            <span className="text-sm font-semibold">{formatPercent(company.bull_5year_return)}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {selectedMetrics.map((metric) => (
            <div key={metric} className="flex justify-between items-center text-sm group">
              <span className="text-gray-600">{metricLabels[metric]}</span>
              <div className="flex items-center">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full mr-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getMetricColor(company[metric] as number)} bg-current transition-all`}
                    style={{ width: `${(company[metric] as number) * 10}%` }}
                  />
                </div>
                <span className={`font-semibold ${getMetricColor(company[metric] as number)}`}>
                  {company[metric]}/10
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {company.financial_health_score >= 8 && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
              Strong Financial Health
            </span>
          )}
          {company.market_position_score >= 9 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">
              Market Leader
            </span>
          )}
          {company.bull_5year_return >= 0.15 && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded border border-purple-200">
              High Bull Return
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
