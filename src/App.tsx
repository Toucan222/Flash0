import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CompanyCard } from './components/CompanyCard';
import { CompanyDetails } from './components/CompanyDetails';
import { CompanyComparison } from './components/CompanyComparison';
import { QuickStats } from './components/QuickStats';
import { PerformanceTrends } from './components/PerformanceTrends';
import { MarketInsights } from './components/MarketInsights';
import { supabase } from './lib/supabase';
import type { Company } from './types';
import { BarChart, SlidersHorizontal, X, ArrowUpDown, Scale, RefreshCw, LayoutGrid, LineChart, TrendingUp } from 'lucide-react';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Company>('overall_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterScore, setFilterScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<Array<keyof Company>>([
    'financial_health_score',
    'market_position_score'
  ]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [comparisonCompanies, setComparisonCompanies] = useState<Company[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filterMetric, setFilterMetric] = useState<keyof Company | ''>('');
  const [filterMinValue, setFilterMinValue] = useState(0);
  const [activeView, setActiveView] = useState<'companies' | 'performance' | 'insights'>('companies');
  const [statsData, setStatsData] = useState({
    totalCompanies: 0,
    avgOverallScore: 0,
    topPerformer: null as Company | null,
    highestBullReturn: 0
  });
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'resilient' | 'aggressive' | 'balanced'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const fetchCompanies = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('overall_score', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
      
      if (data) {
        const avgScore = data.reduce((acc, company) => acc + company.overall_score, 0) / data.length;
        const topPerformer = data.reduce((prev, current) => 
          prev.overall_score > current.overall_score ? prev : current
        );
        const maxBullReturn = Math.max(...data.map(c => c.bull_5year_return));
        
        setStatsData({
          totalCompanies: data.length,
          avgOverallScore: Number(avgScore.toFixed(2)),
          topPerformer,
          highestBullReturn: maxBullReturn
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const meetsScoreThreshold = company.overall_score >= filterScore;
      const meetsMetricFilter = filterMetric ? (company[filterMetric] as number) >= filterMinValue : true;
      
      let meetsPerformanceFilter = true;
      if (performanceFilter === 'resilient') {
        meetsPerformanceFilter = company.bear_5year_return > -0.05;
      } else if (performanceFilter === 'aggressive') {
        meetsPerformanceFilter = company.bull_5year_return > 0.15;
      } else if (performanceFilter === 'balanced') {
        meetsPerformanceFilter = 
          company.bull_5year_return > 0.10 && 
          company.bear_5year_return > -0.08;
      }

      return matchesSearch && meetsScoreThreshold && meetsMetricFilter && meetsPerformanceFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const multiplier = sortOrder === 'desc' ? 1 : -1;
      return typeof bValue === 'number' && typeof aValue === 'number' 
        ? (bValue - aValue) * multiplier
        : String(bValue).localeCompare(String(aValue)) * multiplier;
    });

  const metrics: Array<{ key: keyof Company; label: string }> = [
    { key: 'overall_score', label: 'Overall Score' },
    { key: 'bull_5year_return', label: 'Bull Market Return' },
    { key: 'bear_5year_return', label: 'Bear Market Return' },
    { key: 'financial_health_score', label: 'Financial Health' },
    { key: 'market_position_score', label: 'Market Position' },
    { key: 'company_viability_score', label: 'Company Viability' },
    { key: 'revenue_quality_score', label: 'Revenue Quality' },
    { key: 'profitability_score', label: 'Profitability' },
    { key: 'outlook_score', label: 'Outlook' },
    { key: 'track_record_score', label: 'Track Record' }
  ];

  const toggleMetric = (metric: keyof Company) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const toggleComparisonCompany = (company: Company) => {
    setComparisonCompanies(prev => {
      if (prev.find(c => c.id === company.id)) {
        return prev.filter(c => c.id !== company.id);
      }
      if (prev.length < 3) {
        return [...prev, company];
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Sentinel Flash</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchCompanies}
                className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium text-gray-600 border-gray-300 hover:bg-gray-50 ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {comparisonCompanies.length > 0 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center px-3 py-2 border rounded-md text-sm font-medium text-blue-600 border-blue-500 hover:bg-blue-50"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Compare ({comparisonCompanies.length})
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  showFilters 
                    ? 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Close Filters
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveView('companies')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'companies'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Companies
            </button>
            <button
              onClick={() => setActiveView('performance')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'performance'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Performance Trends
            </button>
            <button
              onClick={() => setActiveView('insights')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'insights'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Insights
            </button>
          </div>

          {activeView === 'companies' && (
            <>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 border border-gray-200 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort by
                      </label>
                      <div className="flex items-center">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as keyof Company)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {metrics.map(({ key, label }) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <button
                          onClick={toggleSortOrder}
                          className="ml-2 p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ArrowUpDown className={`h-5 w-5 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Overall Score: {filterScore}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filterScore}
                        onChange={(e) => setFilterScore(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Filter
                      </label>
                      <div className="flex space-x-4">
                        <select
                          value={filterMetric}
                          onChange={(e) => setFilterMetric(e.target.value as keyof Company)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">None</option>
                          {metrics.map(({ key, label }) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        {filterMetric && (
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={filterMinValue}
                            onChange={(e) => setFilterMinValue(Number(e.target.value))}
                            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Performance Profile
                      </label>
                      <select
                        value={performanceFilter}
                        onChange={(e) => setPerformanceFilter(e.target.value as 'all' | 'resilient' | 'aggressive' | 'balanced')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Companies</option>
                        <option value="resilient">Defensive (Bear Market Resilient)</option>
                        <option value="aggressive">Aggressive (High Bull Returns)</option>
                        <option value="balanced">Balanced (Good in Both)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        View Mode
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'grid'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode('compact')}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'compact'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Compact
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Display Metrics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {metrics.slice(3).map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => toggleMetric(key)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedMetrics.includes(key)
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredCompanies.length} companies
                  </div>
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-2"
                  }>
                    {filteredCompanies.map(company => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        selectedMetrics={selectedMetrics}
                        onClick={() => setSelectedCompany(company)}
                        onCompare={() => toggleComparisonCompany(company)}
                        isSelected={comparisonCompanies.some(c => c.id === company.id)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeView === 'performance' && (
            <>
              <QuickStats data={statsData} />
              <PerformanceTrends companies={companies} />
            </>
          )}

          {activeView === 'insights' && (
            <MarketInsights companies={companies} />
          )}
        </div>
      </main>

      {selectedCompany && (
        <CompanyDetails
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onCompare={() => {
            toggleComparisonCompany(selectedCompany);
            setSelectedCompany(null);
          }}
          isSelected={comparisonCompanies.some(c => c.id === selectedCompany.id)}
        />
      )}

      {showComparison && comparisonCompanies.length > 0 && (
        <CompanyComparison
          companies={comparisonCompanies}
          onClose={() => setShowComparison(false)}
          onRemove={toggleComparisonCompany}
        />
      )}
    </div>
  );
}

export default App;
