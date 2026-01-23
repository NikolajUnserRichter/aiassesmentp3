import type { DropdownOption, AIToolOption } from '@/types';

// Project Types
export const projectTypes: DropdownOption[] = [
  { value: 'internal_operations', labelEn: 'Internal Operations', labelDe: 'Interne Betriebsabläufe' },
  { value: 'consulting_project', labelEn: 'Consulting Project', labelDe: 'Beratungsprojekt' },
  { value: 'client_delivery', labelEn: 'Client Delivery', labelDe: 'Kundenlieferung' },
  { value: 'product_development', labelEn: 'Product Development', labelDe: 'Produktentwicklung' },
  { value: 'research_innovation', labelEn: 'Research & Innovation', labelDe: 'Forschung & Innovation' },
  { value: 'training_education', labelEn: 'Training & Education', labelDe: 'Schulung & Weiterbildung' },
  { value: 'customer_service', labelEn: 'Customer Service', labelDe: 'Kundenservice' },
  { value: 'hr_recruitment', labelEn: 'HR & Recruitment', labelDe: 'HR & Recruiting' },
  { value: 'marketing', labelEn: 'Marketing & Sales', labelDe: 'Marketing & Vertrieb' },
  { value: 'finance', labelEn: 'Finance & Accounting', labelDe: 'Finanzen & Buchhaltung' },
  { value: 'other', labelEn: 'Other', labelDe: 'Sonstiges' },
];

// AI Tools
export const aiTools: AIToolOption[] = [
  // Approved tools
  { value: 'm365_copilot', labelEn: 'M365 Copilot', labelDe: 'M365 Copilot', approved: true },
  { value: 'copilot', labelEn: 'Microsoft Copilot', labelDe: 'Microsoft Copilot', approved: true },
  { value: 'ai_builder', labelEn: 'AI Builder in Power Platform', labelDe: 'AI Builder in Power Platform', approved: true },
  // Requires IT Approval
  { value: 'chatgpt', labelEn: 'ChatGPT (OpenAI)', labelDe: 'ChatGPT (OpenAI)', approved: false },
  { value: 'gpt4', labelEn: 'GPT-4 / GPT-4o (OpenAI)', labelDe: 'GPT-4 / GPT-4o (OpenAI)', approved: false },
  { value: 'claude', labelEn: 'Claude (Anthropic)', labelDe: 'Claude (Anthropic)', approved: false },
  { value: 'gemini', labelEn: 'Google Gemini / Bard', labelDe: 'Google Gemini / Bard', approved: false },
  { value: 'github_copilot', labelEn: 'GitHub Copilot', labelDe: 'GitHub Copilot', approved: false },
  { value: 'azure_openai', labelEn: 'Azure OpenAI Service', labelDe: 'Azure OpenAI Service', approved: false },
  { value: 'aws_bedrock', labelEn: 'AWS Bedrock', labelDe: 'AWS Bedrock', approved: false },
  { value: 'huggingface', labelEn: 'HuggingFace Models', labelDe: 'HuggingFace Models', approved: false },
  { value: 'midjourney_dalle', labelEn: 'Midjourney / DALL-E', labelDe: 'Midjourney / DALL-E', approved: false },
  { value: 'jasper', labelEn: 'Jasper AI', labelDe: 'Jasper AI', approved: false },
  { value: 'notion_ai', labelEn: 'Notion AI', labelDe: 'Notion AI', approved: false },
  { value: 'perplexity', labelEn: 'Perplexity AI', labelDe: 'Perplexity AI', approved: false },
  { value: 'custom_ml', labelEn: 'Custom ML Model', labelDe: 'Eigenes ML-Modell', approved: false },
  { value: 'other', labelEn: 'Other AI System', labelDe: 'Anderes KI-System', approved: false },
];

// AI Use Cases
export const aiUseCases: DropdownOption[] = [
  { value: 'text_generation', labelEn: 'Text Generation', labelDe: 'Textgenerierung' },
  { value: 'content_generation', labelEn: 'Content Generation', labelDe: 'Inhaltserstellung' },
  { value: 'code_generation', labelEn: 'Code Generation', labelDe: 'Code-Generierung' },
  { value: 'document_creation', labelEn: 'Document Creation', labelDe: 'Dokumentenerstellung' },
  { value: 'data_analysis', labelEn: 'Data Analysis', labelDe: 'Datenanalyse' },
  { value: 'translation', labelEn: 'Translation', labelDe: 'Übersetzung' },
  { value: 'image_generation', labelEn: 'Image Generation', labelDe: 'Bildgenerierung' },
  { value: 'summarization', labelEn: 'Summarization', labelDe: 'Zusammenfassung' },
  { value: 'research_assistant', labelEn: 'Research Assistant', labelDe: 'Recherche-Assistent' },
  { value: 'customer_support', labelEn: 'Customer Support', labelDe: 'Kundenbetreuung' },
  { value: 'decision_support', labelEn: 'Decision Support', labelDe: 'Entscheidungsunterstützung' },
  { value: 'automation', labelEn: 'Process Automation', labelDe: 'Prozessautomatisierung' },
];

// Data Types
export const dataTypes: DropdownOption[] = [
  { value: 'public_only', labelEn: 'Public Data Only', labelDe: 'Nur öffentliche Daten' },
  { value: 'company_general', labelEn: 'General Company Data', labelDe: 'Allgemeine Unternehmensdaten' },
  { value: 'aggregated_data', labelEn: 'Aggregated/Anonymized Data', labelDe: 'Aggregierte/Anonymisierte Daten' },
  { value: 'usage_data', labelEn: 'Usage/Behavioral Data', labelDe: 'Nutzungs-/Verhaltensdaten' },
  { value: 'client_confidential', labelEn: 'Client Confidential Data', labelDe: 'Vertrauliche Kundendaten' },
  { value: 'strategic_sensitive', labelEn: 'Strategic/Sensitive Data', labelDe: 'Strategische/Sensible Daten' },
  { value: 'personal_data', labelEn: 'Personal Data (GDPR)', labelDe: 'Personenbezogene Daten (DSGVO)' },
  { value: 'sensitive_data', labelEn: 'Sensitive Personal Data', labelDe: 'Sensible personenbezogene Daten' },
  { value: 'financial_data', labelEn: 'Financial Data', labelDe: 'Finanzdaten' },
  { value: 'special_categories', labelEn: 'Special Categories (Art. 9 GDPR)', labelDe: 'Besondere Kategorien (Art. 9 DSGVO)' },
];

// Autonomy Levels
export const autonomyLevels: DropdownOption[] = [
  { value: 'support_only', labelEn: 'Support Only (Human fully in control)', labelDe: 'Nur Unterstützung (Mensch hat volle Kontrolle)' },
  { value: 'human_controlled', labelEn: 'Human Controlled', labelDe: 'Menschlich gesteuert' },
  { value: 'interactive', labelEn: 'Interactive (Human guides process)', labelDe: 'Interaktiv (Mensch führt Prozess)' },
  { value: 'human_supervised', labelEn: 'Human Supervised', labelDe: 'Menschlich überwacht' },
  { value: 'semi_automated', labelEn: 'Semi-Automated (Human reviews output)', labelDe: 'Teilautomatisiert (Mensch prüft Ergebnis)' },
  { value: 'ai_recommended', labelEn: 'AI Recommended', labelDe: 'KI-empfohlen' },
  { value: 'automated', labelEn: 'Automated (Human oversight only)', labelDe: 'Automatisiert (Nur menschliche Aufsicht)' },
  { value: 'ai_autonomous', labelEn: 'AI Autonomous', labelDe: 'KI-autonom' },
  { value: 'critical_automated', labelEn: 'Critical Automated (Minimal human intervention)', labelDe: 'Kritisch automatisiert (Minimale menschliche Intervention)' },
];

// Impact Scopes
export const impactScopes: DropdownOption[] = [
  { value: 'internal_efficiency', labelEn: 'Internal Efficiency', labelDe: 'Interne Effizienz' },
  { value: 'internal', labelEn: 'Internal Only', labelDe: 'Nur intern' },
  { value: 'project_support', labelEn: 'Project Support', labelDe: 'Projektunterstützung' },
  { value: 'client_deliverable', labelEn: 'Client Deliverable', labelDe: 'Kundenlieferung' },
  { value: 'customer_facing', labelEn: 'Customer Facing', labelDe: 'Kundenorientiert' },
  { value: 'strategic_decision', labelEn: 'Strategic Decision Support', labelDe: 'Strategische Entscheidungsunterstützung' },
  { value: 'regulatory', labelEn: 'Regulatory Impact', labelDe: 'Regulatorische Auswirkung' },
  { value: 'critical_operations', labelEn: 'Critical Operations', labelDe: 'Kritische Betriebsabläufe' },
];

// Transparency Levels
export const transparencyLevels: DropdownOption[] = [
  { value: 'high', labelEn: 'High (Explainable AI)', labelDe: 'Hoch (Erklärbare KI)' },
  { value: 'full_disclosure', labelEn: 'Full Disclosure', labelDe: 'Vollständige Offenlegung' },
  { value: 'medium', labelEn: 'Medium (Partial explainability)', labelDe: 'Mittel (Teilweise erklärbar)' },
  { value: 'partial_disclosure', labelEn: 'Partial Disclosure', labelDe: 'Teilweise Offenlegung' },
  { value: 'low', labelEn: 'Low (Black box)', labelDe: 'Niedrig (Black Box)' },
  { value: 'minimal_disclosure', labelEn: 'Minimal Disclosure', labelDe: 'Minimale Offenlegung' },
];

// Export all options as a config object
export const defaultDropdownConfig = {
  projectTypes,
  aiTools,
  aiUseCases,
  dataTypes,
  autonomyLevels,
  impactScopes,
  transparencyLevels,
};

// Helper function to get label based on language
export function getOptionLabel(option: DropdownOption | undefined, language: 'en' | 'de'): string {
  if (!option) return 'Unknown';
  return language === 'de' ? option.labelDe : option.labelEn;
}

// Helper function to convert options to select format
export function toSelectOptions(
  options: DropdownOption[],
  language: 'en' | 'de'
): { value: string; label: string }[] {
  return options.map((opt) => ({
    value: opt.value,
    label: getOptionLabel(opt, language),
  }));
}

// Helper function for AI tools with grouping
export function getAIToolsGrouped(
  language: 'en' | 'de'
): { value: string; label: string; group: string }[] {
  return aiTools.map((tool) => ({
    value: tool.value,
    label: getOptionLabel(tool, language),
    group: tool.approved
      ? language === 'de'
        ? 'Genehmigt'
        : 'Approved'
      : language === 'de'
      ? 'Erfordert IT-Genehmigung'
      : 'Requires IT Approval',
  }));
}
