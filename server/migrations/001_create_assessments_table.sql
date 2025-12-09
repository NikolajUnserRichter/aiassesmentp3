-- Migration: Create assessments table
-- Description: Stores AI risk assessment results with user information

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    
    -- Assessment data
    risk_level VARCHAR(50) NOT NULL,
    risk_score INTEGER NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    ai_tool VARCHAR(100) NOT NULL,
    ai_use_cases TEXT NOT NULL,
    data_types TEXT NOT NULL,
    autonomy VARCHAR(50) NOT NULL,
    impact VARCHAR(50) NOT NULL,
    transparency VARCHAR(50) NOT NULL,
    
    -- Measures/recommendations
    measures JSONB NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- Create index on risk_level for filtering
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON assessments(risk_level);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE
    ON assessments FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
