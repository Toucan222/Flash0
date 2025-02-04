/*
  # Sentinel Flash Database Schema

  1. New Tables
    - `companies`
      - Core company data including performance metrics and fundamental scores
      - Primary fields: id, name, ticker, overall_score, returns, and various fundamental scores
    
    - `insight_tags`
      - Predefined tags for company insights
      - Fields: id, name, description, category
    
    - `company_insight_tags`
      - Junction table linking companies to insight tags
      - Fields: id, company_id, tag_id

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Prepare for future user authentication features

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for search and filtering operations
*/

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  ticker text NOT NULL UNIQUE,
  overall_score numeric NOT NULL CHECK (overall_score >= 0 AND overall_score <= 10),
  base_5year_return numeric NOT NULL,
  bear_5year_return numeric NOT NULL,
  bull_5year_return numeric NOT NULL,
  financial_health_score integer NOT NULL CHECK (financial_health_score >= 0 AND financial_health_score <= 10),
  company_viability_score integer NOT NULL CHECK (company_viability_score >= 0 AND company_viability_score <= 10),
  market_position_score integer NOT NULL CHECK (market_position_score >= 0 AND market_position_score <= 10),
  revenue_quality_score integer NOT NULL CHECK (revenue_quality_score >= 0 AND revenue_quality_score <= 10),
  profitability_score integer NOT NULL CHECK (profitability_score >= 0 AND profitability_score <= 10),
  outlook_score integer NOT NULL CHECK (outlook_score >= 0 AND outlook_score <= 10),
  track_record_score integer NOT NULL CHECK (track_record_score >= 0 AND track_record_score <= 10),
  alignment_score integer NOT NULL CHECK (alignment_score >= 0 AND alignment_score <= 10),
  capital_allocation_score integer NOT NULL CHECK (capital_allocation_score >= 0 AND capital_allocation_score <= 10),
  analyst_sentiment_score integer NOT NULL CHECK (analyst_sentiment_score >= 0 AND analyst_sentiment_score <= 10),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insight Tags Table
CREATE TABLE IF NOT EXISTS insight_tags (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Performance', 'Fundamentals', 'Market', 'Other')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Company Insight Tags Junction Table
CREATE TABLE IF NOT EXISTS company_insight_tags (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_id bigint NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES insight_tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, tag_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS companies_ticker_idx ON companies(ticker);
CREATE INDEX IF NOT EXISTS companies_name_idx ON companies(name);
CREATE INDEX IF NOT EXISTS companies_overall_score_idx ON companies(overall_score);
CREATE INDEX IF NOT EXISTS companies_returns_idx ON companies(bull_5year_return, bear_5year_return, base_5year_return);
CREATE INDEX IF NOT EXISTS insight_tags_category_idx ON insight_tags(category);
CREATE INDEX IF NOT EXISTS company_insight_tags_company_id_idx ON company_insight_tags(company_id);
CREATE INDEX IF NOT EXISTS company_insight_tags_tag_id_idx ON company_insight_tags(tag_id);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_insight_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to companies"
  ON companies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to insight tags"
  ON insight_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to company insight tags"
  ON company_insight_tags FOR SELECT
  TO public
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial insight tags
INSERT INTO insight_tags (name, description, category) VALUES
  ('High Bull Return', 'Company shows exceptional performance in bull markets with returns above 15%', 'Performance'),
  ('Downside Resilient', 'Company maintains positive returns during bear markets', 'Performance'),
  ('Top Fundamentals', 'Overall fundamental score in the top quartile', 'Fundamentals'),
  ('Strong Financial Health', 'Financial health score of 8 or higher', 'Fundamentals'),
  ('Market Leader', 'Strong market position with score of 9 or higher', 'Market'),
  ('Growth Potential', 'High outlook and analyst sentiment scores', 'Market'),
  ('Quality Management', 'Strong track record and capital allocation scores', 'Fundamentals'),
  ('Defensive Stock', 'Shows resilience in various market conditions', 'Performance')
ON CONFLICT (name) DO NOTHING;
