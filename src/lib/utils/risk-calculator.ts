import type { AssessmentFormData, AssessmentResult, AssessmentDetails, RiskLevel, AIToolOption } from '@/types';

// Scoring constants
const MAX_RISK_SCORE = 20;

const AUTONOMY_SCORES: Record<string, number> = {
  support_only: 1,
  interactive: 2,
  semi_automated: 3,
  automated: 4,
  critical_automated: 5,
};

const IMPACT_SCORES: Record<string, number> = {
  internal_efficiency: 1,
  project_support: 2,
  client_deliverable: 3,
  strategic_decision: 4,
  critical_operations: 5,
};

const DATA_SCORES: Record<string, number> = {
  public_only: 0,
  company_general: 1,
  client_confidential: 2,
  strategic_sensitive: 3,
  personal_data: 4,
  special_categories: 5,
};

const TRANSPARENCY_SCORES: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const UNAPPROVED_TOOL_PENALTY = 3;

// Risk level thresholds
const RISK_THRESHOLDS = {
  minimal: 3,
  low: 7,
  medium: 12,
  high: 16,
} as const;

function getRiskLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.minimal) return 'minimal';
  if (score <= RISK_THRESHOLDS.low) return 'low';
  if (score <= RISK_THRESHOLDS.medium) return 'medium';
  if (score <= RISK_THRESHOLDS.high) return 'high';
  return 'critical';
}

function calculateDataScore(dataTypes: string[]): number {
  if (dataTypes.length === 0) return 0;

  // Get the highest data sensitivity score from selected types
  const scores = dataTypes.map((type) => DATA_SCORES[type] ?? 0);
  return Math.max(...scores);
}

function isToolApproved(aiTool: string, aiTools: AIToolOption[]): boolean {
  const tool = aiTools.find((t) => t.value === aiTool);
  return tool?.approved ?? false;
}

export function calculateRiskScore(
  formData: AssessmentFormData,
  aiTools: AIToolOption[]
): AssessmentResult {
  // Calculate individual scores
  const autonomyScore = AUTONOMY_SCORES[formData.autonomyLevel] ?? 0;
  const impactScore = IMPACT_SCORES[formData.impactScope] ?? 0;
  const dataScore = calculateDataScore(formData.dataTypes);
  const transparencyScore = TRANSPARENCY_SCORES[formData.transparencyLevel] ?? 0;

  const toolApproved = isToolApproved(formData.aiTool, aiTools);
  const toolApprovalScore = toolApproved ? 0 : UNAPPROVED_TOOL_PENALTY;

  // Calculate total risk score
  const totalScore = Math.min(
    autonomyScore + impactScore + dataScore + transparencyScore + toolApprovalScore,
    MAX_RISK_SCORE
  );

  // Determine risk level
  const riskLevel = getRiskLevel(totalScore);

  // Generate recommended measures
  const measures = generateMeasures(formData, riskLevel, toolApproved);

  // Compile assessment details
  const details: AssessmentDetails = {
    autonomyScore,
    impactScore,
    dataScore,
    transparencyScore,
    toolApprovalScore,
    isToolApproved: toolApproved,
  };

  return {
    riskScore: totalScore,
    riskLevel,
    measures,
    details,
  };
}

function generateMeasures(
  formData: AssessmentFormData,
  riskLevel: RiskLevel,
  isToolApproved: boolean
): string[] {
  const measures: string[] = [];

  // Tool approval measures
  if (!isToolApproved) {
    measures.push('Obtain IT security approval for the AI tool before use');
    measures.push('Document justification for using non-standard AI tool');
    measures.push('Conduct security assessment of the AI tool');
  }

  // Risk level based measures
  if (riskLevel === 'critical') {
    measures.push('Executive approval required before deployment');
    measures.push('Implement comprehensive audit logging');
    measures.push('Establish real-time monitoring and alerting');
    measures.push('Create detailed incident response plan');
    measures.push('Schedule regular compliance reviews');
  }

  if (riskLevel === 'high' || riskLevel === 'critical') {
    measures.push('Conduct formal risk assessment with stakeholders');
    measures.push('Implement human oversight for all AI decisions');
    measures.push('Document AI decision-making process');
    measures.push('Establish rollback procedures');
  }

  if (riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical') {
    measures.push('Document AI usage in project documentation');
    measures.push('Inform relevant stakeholders about AI involvement');
    measures.push('Implement quality assurance checks');
  }

  // Data sensitivity measures
  if (formData.dataTypes.includes('special_categories')) {
    measures.push('Ensure GDPR Article 9 compliance for special category data');
    measures.push('Implement data minimization principles');
    measures.push('Conduct Data Protection Impact Assessment (DPIA)');
  }

  if (formData.dataTypes.includes('personal_data')) {
    measures.push('Review GDPR compliance requirements');
    measures.push('Document legal basis for processing');
    measures.push('Implement appropriate technical safeguards');
  }

  if (formData.dataTypes.includes('client_confidential')) {
    measures.push('Ensure client data confidentiality agreements are in place');
    measures.push('Implement data handling procedures');
    measures.push('Consider data anonymization where possible');
  }

  // Autonomy level measures
  if (formData.autonomyLevel === 'automated' || formData.autonomyLevel === 'critical_automated') {
    measures.push('Implement human-in-the-loop controls');
    measures.push('Define clear escalation procedures');
    measures.push('Establish performance monitoring');
  }

  // Impact scope measures
  if (formData.impactScope === 'client_deliverable' ||
      formData.impactScope === 'strategic_decision' ||
      formData.impactScope === 'critical_operations') {
    measures.push('Include AI disclosure in client communications if required');
    measures.push('Document AI contribution to deliverables');
    measures.push('Implement quality review process');
  }

  // Transparency measures
  if (formData.transparencyLevel === 'low') {
    measures.push('Consider more transparent AI alternatives if available');
    measures.push('Document limitations of AI explainability');
    measures.push('Implement additional validation steps');
  }

  // Use case specific measures
  if (formData.aiUseCases.includes('code_generation')) {
    measures.push('Implement code review process for AI-generated code');
    measures.push('Conduct security scanning of generated code');
  }

  if (formData.aiUseCases.includes('document_creation')) {
    measures.push('Review AI-generated documents before distribution');
    measures.push('Implement fact-checking procedures');
  }

  if (formData.aiUseCases.includes('data_analysis')) {
    measures.push('Validate AI analysis results with domain experts');
    measures.push('Document analysis methodology');
  }

  // Remove duplicates and return
  return [...new Set(measures)];
}

export function getRiskScorePercentage(score: number): number {
  return Math.round((score / MAX_RISK_SCORE) * 100);
}

export function getRiskScoreColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    minimal: '#005B4C', // Green Day Vibe
    low: '#DBFF55', // Lemon Splash
    medium: '#FFA500', // Orange
    high: '#FF7F6A', // Flying Salmon
    critical: '#FF0000', // Red
  };
  return colors[level];
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, { en: string; de: string }> = {
  minimal: { en: 'Minimal Risk', de: 'Minimales Risiko' },
  low: { en: 'Low Risk', de: 'Niedriges Risiko' },
  medium: { en: 'Medium Risk', de: 'Mittleres Risiko' },
  high: { en: 'High Risk', de: 'Hohes Risiko' },
  critical: { en: 'Critical Risk', de: 'Kritisches Risiko' },
};

export const RISK_LEVEL_DESCRIPTIONS: Record<RiskLevel, { en: string; de: string }> = {
  minimal: {
    en: 'Standard operational use with minimal compliance requirements.',
    de: 'Standard-Betriebsnutzung mit minimalen Compliance-Anforderungen.',
  },
  low: {
    en: 'Low risk use requiring basic documentation and awareness.',
    de: 'Nutzung mit geringem Risiko, die grundlegende Dokumentation und Sensibilisierung erfordert.',
  },
  medium: {
    en: 'Moderate risk requiring documented controls and oversight.',
    de: 'Mittleres Risiko, das dokumentierte Kontrollen und Aufsicht erfordert.',
  },
  high: {
    en: 'High risk requiring comprehensive safeguards and approvals.',
    de: 'Hohes Risiko, das umfassende Schutzmaßnahmen und Genehmigungen erfordert.',
  },
  critical: {
    en: 'Critical risk requiring executive approval and strict controls.',
    de: 'Kritisches Risiko, das Geschäftsführungsgenehmigung und strenge Kontrollen erfordert.',
  },
};
