-- P3 AI Assessment Platform - Seed Data
-- Run this SQL after schema.sql to populate initial data

-- =============================================================================
-- DEV USER (for testing with DEV_AUTH_BYPASS=true)
-- =============================================================================

INSERT INTO users (id, azure_id, email, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev-azure-id-001',
  'dev@p3-group.com',
  'Dev User',
  'admin'
)
ON CONFLICT (azure_id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- =============================================================================
-- SAMPLE ASSESSMENTS (for testing)
-- =============================================================================

INSERT INTO assessments (
  user_id,
  project_type,
  ai_tool,
  ai_use_cases,
  data_types,
  autonomy_level,
  impact_scope,
  transparency_level,
  risk_score,
  risk_level,
  measures,
  status,
  completed_at
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'customer_service',
  'chatgpt',
  ARRAY['content_generation', 'customer_support'],
  ARRAY['personal_data', 'usage_data'],
  'human_supervised',
  'internal',
  'full_disclosure',
  6,
  'low',
  ARRAY['Implement data anonymization', 'Regular model audits', 'User consent mechanism'],
  'completed',
  NOW() - INTERVAL '5 days'
),
(
  '00000000-0000-0000-0000-000000000001',
  'hr_recruitment',
  'custom_ml',
  ARRAY['decision_support', 'data_analysis'],
  ARRAY['personal_data', 'sensitive_data'],
  'ai_recommended',
  'customer_facing',
  'partial_disclosure',
  12,
  'high',
  ARRAY['Human review for all decisions', 'Bias testing quarterly', 'Explainability reports', 'GDPR compliance audit'],
  'completed',
  NOW() - INTERVAL '10 days'
),
(
  '00000000-0000-0000-0000-000000000001',
  'marketing',
  'copilot',
  ARRAY['content_generation'],
  ARRAY['aggregated_data'],
  'human_controlled',
  'internal',
  'full_disclosure',
  3,
  'minimal',
  ARRAY['Content review before publishing'],
  'completed',
  NOW() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000001',
  'finance',
  'azure_openai',
  ARRAY['decision_support', 'automation'],
  ARRAY['financial_data', 'personal_data'],
  'ai_autonomous',
  'regulatory',
  'minimal_disclosure',
  16,
  'critical',
  ARRAY['Mandatory human oversight', 'Real-time monitoring', 'Audit trail', 'Regulatory compliance review', 'Incident response plan'],
  'completed',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- DEFAULT DROPDOWN CONFIGURATIONS
-- =============================================================================

INSERT INTO dropdown_configs (config_key, config_value) VALUES
(
  'project_types',
  '[
    {"value": "customer_service", "label_en": "Customer Service", "label_de": "Kundenservice"},
    {"value": "hr_recruitment", "label_en": "HR & Recruitment", "label_de": "HR & Recruiting"},
    {"value": "marketing", "label_en": "Marketing & Sales", "label_de": "Marketing & Vertrieb"},
    {"value": "finance", "label_en": "Finance & Accounting", "label_de": "Finanzen & Buchhaltung"},
    {"value": "operations", "label_en": "Operations", "label_de": "Betrieb"},
    {"value": "research", "label_en": "Research & Development", "label_de": "Forschung & Entwicklung"},
    {"value": "legal", "label_en": "Legal & Compliance", "label_de": "Recht & Compliance"},
    {"value": "it", "label_en": "IT & Development", "label_de": "IT & Entwicklung"},
    {"value": "other", "label_en": "Other", "label_de": "Sonstiges"}
  ]'::jsonb
),
(
  'ai_tools',
  '[
    {"value": "chatgpt", "label_en": "ChatGPT (OpenAI)", "label_de": "ChatGPT (OpenAI)"},
    {"value": "copilot", "label_en": "Microsoft Copilot", "label_de": "Microsoft Copilot"},
    {"value": "azure_openai", "label_en": "Azure OpenAI Service", "label_de": "Azure OpenAI Service"},
    {"value": "claude", "label_en": "Claude (Anthropic)", "label_de": "Claude (Anthropic)"},
    {"value": "gemini", "label_en": "Gemini (Google)", "label_de": "Gemini (Google)"},
    {"value": "custom_ml", "label_en": "Custom ML Model", "label_de": "Eigenes ML-Modell"},
    {"value": "other", "label_en": "Other", "label_de": "Sonstiges"}
  ]'::jsonb
),
(
  'ai_use_cases',
  '[
    {"value": "content_generation", "label_en": "Content Generation", "label_de": "Inhaltserstellung", "risk_weight": 1},
    {"value": "data_analysis", "label_en": "Data Analysis", "label_de": "Datenanalyse", "risk_weight": 2},
    {"value": "customer_support", "label_en": "Customer Support", "label_de": "Kundenbetreuung", "risk_weight": 2},
    {"value": "decision_support", "label_en": "Decision Support", "label_de": "Entscheidungsunterstützung", "risk_weight": 3},
    {"value": "automation", "label_en": "Process Automation", "label_de": "Prozessautomatisierung", "risk_weight": 3},
    {"value": "prediction", "label_en": "Prediction & Forecasting", "label_de": "Vorhersage & Prognose", "risk_weight": 3},
    {"value": "classification", "label_en": "Classification & Categorization", "label_de": "Klassifizierung & Kategorisierung", "risk_weight": 2}
  ]'::jsonb
),
(
  'data_types',
  '[
    {"value": "public_data", "label_en": "Public Data", "label_de": "Öffentliche Daten", "risk_weight": 0},
    {"value": "aggregated_data", "label_en": "Aggregated/Anonymized Data", "label_de": "Aggregierte/Anonymisierte Daten", "risk_weight": 1},
    {"value": "usage_data", "label_en": "Usage/Behavioral Data", "label_de": "Nutzungs-/Verhaltensdaten", "risk_weight": 2},
    {"value": "personal_data", "label_en": "Personal Data (GDPR)", "label_de": "Personenbezogene Daten (DSGVO)", "risk_weight": 3},
    {"value": "sensitive_data", "label_en": "Sensitive Personal Data", "label_de": "Sensible personenbezogene Daten", "risk_weight": 4},
    {"value": "financial_data", "label_en": "Financial Data", "label_de": "Finanzdaten", "risk_weight": 3},
    {"value": "health_data", "label_en": "Health Data", "label_de": "Gesundheitsdaten", "risk_weight": 4}
  ]'::jsonb
),
(
  'autonomy_levels',
  '[
    {"value": "human_controlled", "label_en": "Human Controlled", "label_de": "Menschlich gesteuert", "description_en": "AI provides suggestions, human makes all decisions", "description_de": "KI macht Vorschläge, Mensch trifft alle Entscheidungen", "risk_weight": 1},
    {"value": "human_supervised", "label_en": "Human Supervised", "label_de": "Menschlich überwacht", "description_en": "AI acts with human oversight and approval", "description_de": "KI handelt mit menschlicher Aufsicht und Genehmigung", "risk_weight": 2},
    {"value": "ai_recommended", "label_en": "AI Recommended", "label_de": "KI-empfohlen", "description_en": "AI makes recommendations, human can override", "description_de": "KI macht Empfehlungen, Mensch kann überstimmen", "risk_weight": 3},
    {"value": "ai_autonomous", "label_en": "AI Autonomous", "label_de": "KI-autonom", "description_en": "AI makes decisions independently", "description_de": "KI trifft Entscheidungen selbstständig", "risk_weight": 4}
  ]'::jsonb
),
(
  'impact_scopes',
  '[
    {"value": "internal", "label_en": "Internal Only", "label_de": "Nur intern", "description_en": "Affects only internal processes/employees", "description_de": "Betrifft nur interne Prozesse/Mitarbeiter", "risk_weight": 1},
    {"value": "customer_facing", "label_en": "Customer Facing", "label_de": "Kundenorientiert", "description_en": "Directly affects customers/external parties", "description_de": "Betrifft direkt Kunden/externe Parteien", "risk_weight": 2},
    {"value": "regulatory", "label_en": "Regulatory Impact", "label_de": "Regulatorische Auswirkung", "description_en": "Subject to regulatory compliance", "description_de": "Unterliegt regulatorischer Compliance", "risk_weight": 3},
    {"value": "critical", "label_en": "Critical Infrastructure", "label_de": "Kritische Infrastruktur", "description_en": "Affects critical business or safety systems", "description_de": "Betrifft kritische Geschäfts- oder Sicherheitssysteme", "risk_weight": 4}
  ]'::jsonb
),
(
  'transparency_levels',
  '[
    {"value": "full_disclosure", "label_en": "Full Disclosure", "label_de": "Vollständige Offenlegung", "description_en": "Users are fully informed about AI usage", "description_de": "Nutzer sind vollständig über KI-Nutzung informiert", "risk_weight": 0},
    {"value": "partial_disclosure", "label_en": "Partial Disclosure", "label_de": "Teilweise Offenlegung", "description_en": "Some AI usage information provided", "description_de": "Einige Informationen zur KI-Nutzung bereitgestellt", "risk_weight": 1},
    {"value": "minimal_disclosure", "label_en": "Minimal Disclosure", "label_de": "Minimale Offenlegung", "description_en": "Limited information about AI involvement", "description_de": "Begrenzte Informationen über KI-Beteiligung", "risk_weight": 2},
    {"value": "no_disclosure", "label_en": "No Disclosure", "label_de": "Keine Offenlegung", "description_en": "AI usage is not disclosed", "description_de": "KI-Nutzung wird nicht offengelegt", "risk_weight": 3}
  ]'::jsonb
)
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  updated_at = NOW();

-- Verify data was inserted
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Assessments:', COUNT(*) FROM assessments
UNION ALL
SELECT 'Dropdown Configs:', COUNT(*) FROM dropdown_configs;
