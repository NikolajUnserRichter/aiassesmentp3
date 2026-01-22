// User types
export interface User {
  id: string;
  azure_id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Assessment types
export interface Assessment {
  id: string;
  user_id: string;
  project_type: string;
  ai_tool: string;
  ai_use_cases: string[];
  data_types: string[];
  autonomy_level: string;
  impact_scope: string;
  transparency_level: string;
  risk_score: number;
  risk_level: RiskLevel;
  measures: string[];
  status: 'draft' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type RiskLevel = 'minimal' | 'low' | 'medium' | 'high' | 'critical';

// Assessment form data
export interface AssessmentFormData {
  projectType: string;
  aiTool: string;
  aiUseCases: string[];
  dataTypes: string[];
  autonomyLevel: string;
  impactScope: string;
  transparencyLevel: string;
}

// Assessment result
export interface AssessmentResult {
  riskScore: number;
  riskLevel: RiskLevel;
  measures: string[];
  details: AssessmentDetails;
}

export interface AssessmentDetails {
  autonomyScore: number;
  impactScore: number;
  dataScore: number;
  transparencyScore: number;
  toolApprovalScore: number;
  isToolApproved: boolean;
}

// Dropdown option types
export interface DropdownOption {
  value: string;
  labelEn: string;
  labelDe: string;
}

export interface AIToolOption extends DropdownOption {
  approved: boolean;
}

// Configuration types
export interface DropdownConfig {
  projectTypes: DropdownOption[];
  aiTools: AIToolOption[];
  aiUseCases: DropdownOption[];
  dataTypes: DropdownOption[];
  autonomyLevels: DropdownOption[];
  impactScopes: DropdownOption[];
  transparencyLevels: DropdownOption[];
}

// Question types for the wizard
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  fields: WizardField[];
}

export interface WizardField {
  name: keyof AssessmentFormData;
  type: 'select' | 'multiselect';
  label: string;
  description?: string;
  required: boolean;
  options: DropdownOption[] | AIToolOption[];
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Language types
export type Language = 'en' | 'de';

export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Store types
export interface AppState {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

export interface AssessmentState {
  currentStep: number;
  formData: AssessmentFormData;
  result: AssessmentResult | null;
  isLoading: boolean;
  error: string | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<AssessmentFormData>) => void;
  setResult: (result: AssessmentResult) => void;
  resetAssessment: () => void;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Database row types (for Supabase)
export interface DatabaseUser {
  id: string;
  azure_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAssessment {
  id: string;
  user_id: string;
  project_type: string;
  ai_tool: string;
  ai_use_cases: string[];
  data_types: string[];
  autonomy_level: string;
  impact_scope: string;
  transparency_level: string;
  risk_score: number;
  risk_level: string;
  measures: string[];
  status: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface DatabaseConfig {
  id: string;
  config_key: string;
  config_value: Record<string, unknown>;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
