-- P3 AI Assessment Platform - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE assessment_status AS ENUM ('draft', 'completed', 'archived');
CREATE TYPE risk_level AS ENUM ('minimal', 'low', 'medium', 'high', 'critical');

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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropdown_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (azure_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (azure_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Assessments policies
CREATE POLICY "Users can view their own assessments"
  ON assessments FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can create their own assessments"
  ON assessments FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users
    WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can update their own assessments"
  ON assessments FOR UPDATE
  USING (user_id IN (
    SELECT id FROM users
    WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

CREATE POLICY "Users can delete their own assessments"
  ON assessments FOR DELETE
  USING (user_id IN (
    SELECT id FROM users
    WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Questions policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view active questions"
  ON questions FOR SELECT
  USING (is_active = true);

-- Dropdown configs policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view dropdown configs"
  ON dropdown_configs FOR SELECT
  USING (true);

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id IN (
    SELECT id FROM users
    WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- =============================================================================
-- ADMIN POLICIES (for admin role users)
-- =============================================================================

-- Admin can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

-- Admin can view all assessments
CREATE POLICY "Admins can view all assessments"
  ON assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

-- Admin can manage questions
CREATE POLICY "Admins can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

-- Admin can manage dropdown configs
CREATE POLICY "Admins can manage dropdown configs"
  ON dropdown_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

-- Admin can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE azure_id = current_setting('request.jwt.claims', true)::json->>'sub'
      AND role = 'admin'
    )
  );

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
-- SEED DATA (Optional - Default Admin User)
-- =============================================================================

-- Insert a default admin user (replace with actual Azure AD ID after first login)
-- INSERT INTO users (azure_id, email, name, role)
-- VALUES ('your-azure-ad-object-id', 'admin@example.com', 'Admin User', 'admin')
-- ON CONFLICT (azure_id) DO NOTHING;
