import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Activity, BarChart2, Scale, Headphones, Info } from 'lucide-react';
import type { Company } from '../types';

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
  onCompare: () => void;
  isSelected: boolean;
}

export function CompanyDetails({ company, onClose, onCompare, isSelected }: CompanyDetailsProps) {
  const [showPodcastInfo, setShowPodcastInfo] = useState(false);
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  const metrics = [
    { label: 'Financial Health', value: company.financial_health_score },
    { label: 'Company Viability', value: company.company_viability_score },
    { label: 'Market Position', value: company.market_position_score },
    { label: 'Revenue Quality', value: company.revenue_quality_score },
    { label: 'Profitability', value: company.profitability_score },
    { label: 'Outlook', value: company.outlook_score },
    { label: 'Track Record', value: company.track_record_score },
    { label: 'Alignment', value: company.alignment_score },
    { label: 'Capital Allocation', value: company.capital_allocation_score },
    { label: 'Analyst Sentiment', value: company.analyst_sentiment_score }
  ];

  // For demo purposes, generate a unique podcast URL for each company
  const podcastUrl = `https://api.example.com/podcasts/${company.ticker.toLowerCase()}.mp3`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
            <p className="text-gray-600">{company.ticker}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCompare}
              className={`p-2 rounded-full transition-colors ${
                isSelected
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Scale className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* AI Podcast Player */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Headphones className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-900">AI Analysis Podcast</h3>
              </div>
              <button
                onClick={() => setShowPodcastInfo(!showPodcastInfo)}
                className="p-1 hover:bg-white/50 rounded-full transition-colors"
              >
                <Info className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {showPodcastInfo && (
              <div className="mb-3 text-sm text-gray-600 bg-white/50 p-2 rounded">
                This AI-generated podcast provides a comprehensive analysis of {company.name}'s performance, 
                market position, and future outlook based on our research and data analysis.
              </div>
            )}
            <audio
              controls
              className="w-full"
              src={podcastUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700 font-medium">Base Return</span>
              </div>
              <p className="text-2xl font-bold">{formatPercent(company.base_5year_return)}</p>
              <p className="text-sm text-gray-600">5 Year Projection</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-gray-700 font-medium">Bear Return</span>
              </div>
              <p className="text-2xl font-bold">{formatPercent(company.bear_5year_return)}</p>
              <p className="text-sm text-gray-600">5 Year Bear Case</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700 font-medium">Bull Return</span>
              </div>
              <p className="text-2xl font-bold">{formatPercent(company.bull_5year_return)}</p>
              <p className="text-sm text-gray-600">5 Year Bull Case</p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <BarChart2 className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            </div>
            <div className="space-y-4">
              {metrics.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-medium">{value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
