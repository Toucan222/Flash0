export interface Company {
  id: number;
  name: string;
  ticker: string;
  overall_score: number;
  base_5year_return: number;
  bear_5year_return: number;
  bull_5year_return: number;
  financial_health_score: number;
  company_viability_score: number;
  market_position_score: number;
  revenue_quality_score: number;
  profitability_score: number;
  outlook_score: number;
  track_record_score: number;
  alignment_score: number;
  capital_allocation_score: number;
  analyst_sentiment_score: number;
  podcast_url?: string; // URL to the AI-generated podcast audio file
}

export interface InsightTag {
  id: number;
  name: string;
  description: string;
  category: 'Performance' | 'Fundamentals' | 'Market' | 'Other';
}

export interface CompanyInsightTag {
  id: number;
  company_id: number;
  tag_id: number;
}
