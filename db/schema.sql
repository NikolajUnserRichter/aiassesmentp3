-- P3 AI Assessment Platform - PostgreSQL Database Schema
-- Run this SQL on your PostgreSQL database to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_status AS ENUM ('draft', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM ('minimal', 'low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  azure_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster Azure ID lookups
CREATE INDEX IF NOT EXISTS idx_users_azure_id ON users(azure_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================================================
-- ASSESSMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_type VARCHAR(100) NOT NULL,
  ai_tool VARCHAR(100) NOT NULL,
  ai_use_cases TEXT[] NOT NULL DEFAULT '{}',
  data_types TEXT[] NOT NULL DEFAULT '{}',
  autonomy_level VARCHAR(100) NOT NULL,
  impact_scope VARCHAR(100) NOT NULL,
  transparency_level VARCHAR(100) NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 20),
  risk_level risk_level NOT NULL,
  measures TEXT[] NOT NULL DEFAULT '{}',
  status assessment_status DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- =============================================================================
-- QUESTIONS TABLE (for dynamic question management)
-- =============================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  question_key VARCHAR(100) UNIQUE NOT NULL,
  question_en TEXT NOT NULL,
  question_de TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);

-- =============================================================================
-- DROPDOWN CONFIGURATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS dropdown_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL DEFAULT '[]',
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dropdown_configs_key ON dropdown_configs(config_key);

-- =============================================================================
-- AUDIT LOGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (to allow re-running schema)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
DROP TRIGGER IF EXISTS update_dropdown_configs_updated_at ON dropdown_configs;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for assessments table
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for questions table
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for dropdown_configs table
CREATE TRIGGER update_dropdown_configs_updated_at
  BEFORE UPDATE ON dropdown_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for assessment statistics by user
CREATE OR REPLACE VIEW user_assessment_stats AS
SELECT
  u.id as user_id,
  u.email,
  u.name,
  COUNT(a.id) as total_assessments,
  COUNT(CASE WHEN a.risk_level = 'minimal' THEN 1 END) as minimal_risk_count,
  COUNT(CASE WHEN a.risk_level = 'low' THEN 1 END) as low_risk_count,
  COUNT(CASE WHEN a.risk_level = 'medium' THEN 1 END) as medium_risk_count,
  COUNT(CASE WHEN a.risk_level = 'high' THEN 1 END) as high_risk_count,
  COUNT(CASE WHEN a.risk_level = 'critical' THEN 1 END) as critical_risk_count,
  COUNT(CASE WHEN a.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_count
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.email, u.name;

-- View for overall statistics
CREATE OR REPLACE VIEW overall_stats AS
SELECT
  COUNT(*) as total_assessments,
  COUNT(CASE WHEN risk_level = 'minimal' THEN 1 END) as minimal_risk_count,
  COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk_count,
  COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk_count,
  COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
  COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_risk_count,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
  COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_count
FROM assessments;

COMMENT ON TABLE users IS 'User accounts linked to Azure AD';
COMMENT ON TABLE assessments IS 'AI risk assessments created by users';
COMMENT ON TABLE questions IS 'Dynamic questions for the assessment wizard';
COMMENT ON TABLE dropdown_configs IS 'Configurable dropdown options for the wizard';
COMMENT ON TABLE audit_logs IS 'Audit trail for compliance and debugging';
