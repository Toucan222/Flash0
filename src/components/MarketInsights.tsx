import React, { useState, useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Shield, BarChart2, Target, Award, AlertTriangle, Zap, LineChart, DollarSign, Percent, Gauge, Scale, ArrowUpRight, Bookmark } from 'lucide-react';
import type { Company } from '../types';

interface MarketInsightsProps {
  companies: Company[];
}

interface SectorAnalysis {
  highPerformers: Company[];
  riskyCandidates: Company[];
  stablePerformers: Company[];
  highGrowth: Company[];
  defensiveStocks: Company[];
  valueStocks: Company[];
  momentumStocks: Company[];
}

interface MarketMetrics {
  avgBullReturn: number;
  avgBearReturn: number;
  avgFinancialHealth: number;
  avgMarketPosition: number;
  volatilitySpread: number;
  healthIndex: number;
  momentumScore: number;
  qualityScore: number;
}

export function MarketInsights({ companies }: MarketInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'performance' | 'risk' | 'opportunity' | 'trends' | 'quality'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short' | 'medium' | 'long'>('medium');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  const analyzeSectors = useMemo((): SectorAnalysis => {
    return {
      highPerformers: companies.filter(c => 
        c.overall_score >= 8.5 && 
        c.bull_5year_return > 0.15 &&
        c.bear_5year_return > -0.1
      ),
      riskyCandidates: companies.filter(c =>
        c.overall_score < 6 ||
        (c.bear_5year_return < -0.15 && c.bull_5year_return < 0.1)
      ),
      stablePerformers: companies.filter(c =>
        c.overall_score >= 7 &&
        Math.abs(c.bear_5year_return) < 0.1 &&
        c.bull_5year_return >= 0.1
      ),
      highGrowth: companies.filter(c =>
        c.bull_5year_return > 0.2 &&
        c.outlook_score >= 8 &&
        c.market_position_score >= 7
      ),
      defensiveStocks: companies.filter(c =>
        c.bear_5year_return > -0.05 &&
        c.financial_health_score >= 8 &&
        c.track_record_score >= 7
      ),
      valueStocks: companies.filter(c =>
        c.financial_health_score >= 7 &&
        c.profitability_score >= 7 &&
        c.overall_score >= 7 &&
        c.bull_5year_return < 0.15
      ),
      momentumStocks: companies.filter(c =>
        c.bull_5year_return > 0.15 &&
        c.market_position_score >= 7 &&
        c.outlook_score >= 7
      )
    };
  }, [companies]);

  const calculateMarketMetrics = useMemo((): MarketMetrics | null => {
    if (companies.length === 0) return null;

    const avgBullReturn = companies.reduce((acc, c) => acc + c.bull_5year_return, 0) / companies.length;
    const avgBearReturn = companies.reduce((acc, c) => acc + c.bear_5year_return, 0) / companies.length;
    const avgFinancialHealth = companies.reduce((acc, c) => acc + c.financial_health_score, 0) / companies.length;
    const avgMarketPosition = companies.reduce((acc, c) => acc + c.market_position_score, 0) / companies.length;
    
    // Calculate momentum score based on bull returns and market position
    const momentumScore = companies.reduce((acc, c) => 
      acc + (c.bull_5year_return * 5 + c.market_position_score) / 2, 0) / companies.length;
    
    // Calculate quality score based on multiple factors
    const qualityScore = companies.reduce((acc, c) => 
      acc + (c.financial_health_score + c.profitability_score + c.track_record_score) / 3, 0) / companies.length;

    return {
      avgBullReturn,
      avgBearReturn,
      avgFinancialHealth,
      avgMarketPosition,
      volatilitySpread: avgBullReturn - avgBearReturn,
      healthIndex: (avgFinancialHealth + avgMarketPosition) / 2,
      momentumScore,
      qualityScore
    };
  }, [companies]);

  const getInsights = () => {
    if (companies.length === 0) return [];

    const insights = [];
    const metrics = calculateMarketMetrics;
    
    // Performance Insights
    const performanceInsights = [
      {
        category: 'performance',
        icon: <Award className="w-5 h-5 text-green-600" />,
        title: 'Market Leaders',
        description: `${analyzeSectors.highPerformers.length} companies demonstrate exceptional performance`,
        color: 'green',
        details: analyzeSectors.highPerformers.map(c => c.ticker).join(', '),
        timeframe: 'long'
      },
      {
        category: 'performance',
        icon: <Shield className="w-5 h-5 text-blue-600" />,
        title: 'Defensive Champions',
        description: `${analyzeSectors.defensiveStocks.length} companies with strong bear market resilience`,
        color: 'blue',
        details: analyzeSectors.defensiveStocks.map(c => c.ticker).join(', '),
        timeframe: 'medium'
      },
      {
        category: 'performance',
        icon: <Zap className="w-5 h-5 text-amber-600" />,
        title: 'Growth Leaders',
        description: `${analyzeSectors.highGrowth.length} companies with exceptional growth metrics`,
        color: 'amber',
        details: analyzeSectors.highGrowth.map(c => c.ticker).join(', '),
        timeframe: 'short'
      }
    ];

    // Quality Insights
    const qualityInsights = [
      {
        category: 'quality',
        icon: <Scale className="w-5 h-5 text-indigo-600" />,
        title: 'Quality Leaders',
        description: `Companies with superior fundamentals and stability`,
        color: 'indigo',
        details: `Quality Score: ${metrics?.qualityScore.toFixed(1)}/10`,
        timeframe: 'long'
      },
      {
        category: 'quality',
        icon: <Bookmark className="w-5 h-5 text-teal-600" />,
        title: 'Value Opportunities',
        description: `${analyzeSectors.valueStocks.length} companies with strong value characteristics`,
        color: 'teal',
        details: analyzeSectors.valueStocks.map(c => c.ticker).join(', '),
        timeframe: 'medium'
      }
    ];

    // Risk Assessment Insights
    const riskInsights = [
      {
        category: 'risk',
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
        title: 'High Risk Alerts',
        description: `${analyzeSectors.riskyCandidates.length} companies require attention`,
        color: 'red',
        details: analyzeSectors.riskyCandidates.map(c => c.ticker).join(', '),
        timeframe: 'short'
      },
      {
        category: 'risk',
        icon: <LineChart className="w-5 h-5 text-orange-600" />,
        title: 'Market Volatility',
        description: `Volatility spread: ${(metrics?.volatilitySpread || 0 * 100).toFixed(1)}%`,
        color: 'orange',
        details: 'Difference between bull and bear market performance',
        timeframe: 'medium'
      }
    ];

    // Market Opportunity Insights
    const opportunityInsights = [
      {
        category: 'opportunity',
        icon: <Target className="w-5 h-5 text-purple-600" />,
        title: 'Growth Opportunities',
        description: `${analyzeSectors.highGrowth.length} companies with strong growth potential`,
        color: 'purple',
        details: analyzeSectors.highGrowth.map(c => c.ticker).join(', '),
        timeframe: 'medium'
      },
      {
        category: 'opportunity',
        icon: <ArrowUpRight className="w-5 h-5 text-emerald-600" />,
        title: 'Momentum Leaders',
        description: `${analyzeSectors.momentumStocks.length} companies showing strong momentum`,
        color: 'emerald',
        details: analyzeSectors.momentumStocks.map(c => c.ticker).join(', '),
        timeframe: 'short'
      }
    ];

    // Market Trend Insights
    const trendInsights = [
      {
        category: 'trends',
        icon: <Gauge className="w-5 h-5 text-sky-600" />,
        title: 'Market Momentum',
        description: `Momentum Score: ${(metrics?.momentumScore || 0).toFixed(1)}/10`,
        color: 'sky',
        details: 'Combined measure of performance and market strength',
        timeframe: 'short'
      },
      {
        category: 'trends',
        icon: <BarChart2 className="w-5 h-5 text-violet-600" />,
        title: 'Market Health',
        description: `Health Index: ${(metrics?.healthIndex || 0).toFixed(1)}/10`,
        color: 'violet',
        details: 'Overall market robustness indicator',
        timeframe: 'medium'
      }
    ];

    return [
      ...performanceInsights,
      ...qualityInsights,
      ...riskInsights,
      ...opportunityInsights,
      ...trendInsights
    ];
  };

  const insights = getInsights();
  const filteredInsights = insights.filter(i => 
    (selectedCategory === 'all' || i.category === selectedCategory) &&
    (selectedTimeframe === 'medium' || i.timeframe === selectedTimeframe)
  );

  if (insights.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
            <button
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showAdvancedMetrics ? 'Hide Advanced Metrics' : 'Show Advanced Metrics'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setSelectedTimeframe('short')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === 'short'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Short Term
              </button>
              <button
                onClick={() => setSelectedTimeframe('medium')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === 'medium'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Medium Term
              </button>
              <button
                onClick={() => setSelectedTimeframe('long')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === 'long'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Long Term
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setSelectedCategory('performance')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'performance'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedCategory('quality')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'quality'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quality
          </button>
          <button
            onClick={() => setSelectedCategory('risk')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'risk'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Risk
          </button>
          <button
            onClick={() => setSelectedCategory('opportunity')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'opportunity'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setSelectedCategory('trends')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'trends'
                ? 'bg-sky-100 text-sky-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Trends
          </button>
        </div>

        {showAdvancedMetrics && calculateMarketMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Quality Score</div>
              <div className="text-lg font-semibold text-indigo-700">
                {calculateMarketMetrics.qualityScore.toFixed(1)}/10
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Momentum Score</div>
              <div className="text-lg font-semibold text-sky-700">
                {calculateMarketMetrics.momentumScore.toFixed(1)}/10
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Market Health</div>
              <div className="text-lg font-semibold text-emerald-700">
                {calculateMarketMetrics.healthIndex.toFixed(1)}/10
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Volatility Spread</div>
              <div className="text-lg font-semibold text-amber-700">
                {(calculateMarketMetrics.volatilitySpread * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInsights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border bg-${insight.color}-50 border-${insight.color}-100 hover:shadow-md transition-all`}
            >
              <div className="flex items-center mb-2">
                {insight.icon}
                <span className="ml-2 font-medium text-gray-900">{insight.title}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              {insight.details && (
                <div className="mt-2 p-2 bg-white bg-opacity-50 rounded-md">
                  <p className="text-xs text-gray-500">{insight.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Summary</h3>
        <div className="prose prose-sm text-gray-600">
          <p>
            Current market analysis of {companies.length} companies shows:
          </p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center">
              <Award className="w-4 h-4 text-green-600 mr-2" />
              <span><strong className="text-green-700">Market Leaders:</strong> {analyzeSectors.highPerformers.length} companies with exceptional metrics</span>
            </li>
            <li className="flex items-center">
              <Shield className="w-4 h-4 text-blue-600 mr-2" />
              <span><strong className="text-blue-700">Defensive Stocks:</strong> {analyzeSectors.defensiveStocks.length} with strong bear market resilience</span>
            </li>
            <li className="flex items-center">
              <Scale className="w-4 h-4 text-indigo-600 mr-2" />
              <span><strong className="text-indigo-700">Quality Stocks:</strong> {analyzeSectors.valueStocks.length} with strong fundamentals</span>
            </li>
            <li className="flex items-center">
              <Zap className="w-4 h-4 text-amber-600 mr-2" />
              <span><strong className="text-amber-700">Growth Leaders:</strong> {analyzeSectors.highGrowth.length} with high growth potential</span>
            </li>
            <li className="flex items-center">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-2" />
              <span><strong className="text-emerald-700">Momentum Stocks:</strong> {analyzeSectors.momentumStocks.length} showing strong momentum</span>
            </li>
            <li className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span><strong className="text-red-700">Watch List:</strong> {analyzeSectors.riskyCandidates.length} companies require monitoring</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
