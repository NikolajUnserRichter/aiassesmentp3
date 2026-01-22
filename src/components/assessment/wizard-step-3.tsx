'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/store/assessment-store';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
import {
  RISK_LEVEL_LABELS,
  RISK_LEVEL_DESCRIPTIONS,
  getRiskScorePercentage,
} from '@/lib/utils/risk-calculator';
import { exportToCSV, formatDateTime } from '@/lib/utils';
import {
  projectTypes,
  aiTools,
  aiUseCases,
  dataTypes,
  autonomyLevels,
  impactScopes,
  transparencyLevels,
  getOptionLabel,
} from '@/config/dropdown-options';
import type { RiskLevel } from '@/types';

interface WizardStep3Props {
  onSave: () => Promise<void>;
  onNewAssessment: () => void;
  isSaving: boolean;
}

export function WizardStep3({ onSave, onNewAssessment, isSaving }: WizardStep3Props) {
  const { formData, result } = useAssessmentStore();
  const { language } = useAppStore();
  const t = translations[language];

  if (!result) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {language === 'de' ? 'Keine Ergebnisse verfügbar' : 'No results available'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = result.riskLevel as RiskLevel;
  const riskPercentage = getRiskScorePercentage(result.riskScore);

  const getProgressVariant = () => {
    switch (riskLevel) {
      case 'minimal':
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
      case 'critical':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleExport = () => {
    const exportData = {
      assessmentDate: formatDateTime(new Date().toISOString()),
      projectType: getOptionLabel(
        projectTypes.find((p) => p.value === formData.projectType)!,
        language
      ),
      aiTool: getOptionLabel(
        aiTools.find((t) => t.value === formData.aiTool)!,
        language
      ),
      aiUseCases: formData.aiUseCases
        .map((uc) => getOptionLabel(aiUseCases.find((u) => u.value === uc)!, language))
        .join(', '),
      dataTypes: formData.dataTypes
        .map((dt) => getOptionLabel(dataTypes.find((d) => d.value === dt)!, language))
        .join(', '),
      autonomyLevel: getOptionLabel(
        autonomyLevels.find((a) => a.value === formData.autonomyLevel)!,
        language
      ),
      impactScope: getOptionLabel(
        impactScopes.find((i) => i.value === formData.impactScope)!,
        language
      ),
      transparencyLevel: getOptionLabel(
        transparencyLevels.find((t) => t.value === formData.transparencyLevel)!,
        language
      ),
      riskScore: result.riskScore,
      riskLevel: RISK_LEVEL_LABELS[riskLevel][language],
      toolApproved: result.details.isToolApproved
        ? t.results.details.yes
        : t.results.details.no,
      recommendedMeasures: result.measures.join('\n'),
    };

    exportToCSV(exportData, `ai-assessment-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Risk Score Card */}
      <Card className="overflow-hidden">
        <div
          className={`h-2 ${
            riskLevel === 'minimal' || riskLevel === 'low'
              ? 'bg-p3-green-day'
              : riskLevel === 'medium'
              ? 'bg-yellow-500'
              : 'bg-p3-flying-salmon'
          }`}
        />
        <CardHeader>
          <CardTitle>{t.results.title}</CardTitle>
          <CardDescription>{t.results.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-around">
            {/* Risk Score */}
            <div className="text-center">
              <CircularProgress
                value={result.riskScore}
                max={20}
                size={160}
                strokeWidth={12}
                variant={getProgressVariant()}
              />
              <p className="mt-4 text-sm text-muted-foreground">{t.results.riskScore}</p>
            </div>

            {/* Risk Level */}
            <div className="text-center">
              <Badge
                variant={`risk-${riskLevel}` as 'risk-minimal' | 'risk-low' | 'risk-medium' | 'risk-high' | 'risk-critical'}
                size="lg"
                className="text-lg px-6 py-2"
              >
                {RISK_LEVEL_LABELS[riskLevel][language]}
              </Badge>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                {RISK_LEVEL_DESCRIPTIONS[riskLevel][language]}
              </p>
            </div>

            {/* Tool Status */}
            <div className="text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                  result.details.isToolApproved
                    ? 'bg-p3-green-day/10'
                    : 'bg-p3-flying-salmon/10'
                }`}
              >
                {result.details.isToolApproved ? (
                  <ShieldCheckIcon className="h-10 w-10 text-p3-green-day" />
                ) : (
                  <ExclamationTriangleIcon className="h-10 w-10 text-p3-flying-salmon" />
                )}
              </div>
              <p className="mt-4 text-sm font-medium">
                {result.details.isToolApproved
                  ? language === 'de'
                    ? 'Tool genehmigt'
                    : 'Tool Approved'
                  : language === 'de'
                  ? 'Genehmigung erforderlich'
                  : 'Approval Required'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t.results.assessmentDetails}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <DetailRow
              label={t.results.details.projectType}
              value={getOptionLabel(
                projectTypes.find((p) => p.value === formData.projectType)!,
                language
              )}
            />
            <DetailRow
              label={t.results.details.aiTool}
              value={getOptionLabel(
                aiTools.find((t) => t.value === formData.aiTool)!,
                language
              )}
            />
            <DetailRow
              label={t.results.details.aiUseCases}
              value={formData.aiUseCases
                .map((uc) => getOptionLabel(aiUseCases.find((u) => u.value === uc)!, language))
                .join(', ')}
            />
            <DetailRow
              label={t.results.details.dataTypes}
              value={formData.dataTypes
                .map((dt) => getOptionLabel(dataTypes.find((d) => d.value === dt)!, language))
                .join(', ')}
            />
            <DetailRow
              label={t.results.details.autonomyLevel}
              value={getOptionLabel(
                autonomyLevels.find((a) => a.value === formData.autonomyLevel)!,
                language
              )}
            />
            <DetailRow
              label={t.results.details.impactScope}
              value={getOptionLabel(
                impactScopes.find((i) => i.value === formData.impactScope)!,
                language
              )}
            />
            <DetailRow
              label={t.results.details.transparencyLevel}
              value={getOptionLabel(
                transparencyLevels.find((t) => t.value === formData.transparencyLevel)!,
                language
              )}
            />
            <DetailRow
              label={t.results.details.toolApproved}
              value={result.details.isToolApproved ? t.results.details.yes : t.results.details.no}
              highlight={!result.details.isToolApproved}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommended Measures */}
      <Card>
        <CardHeader>
          <CardTitle>{t.results.measures}</CardTitle>
        </CardHeader>
        <CardContent>
          {result.measures.length > 0 ? (
            <ul className="space-y-3">
              {result.measures.map((measure, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-p3-green-day" />
                  <span className="text-sm text-foreground">{measure}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t.results.noMeasures}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={handleExport}
          leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
        >
          {t.results.exportResults}
        </Button>
        <Button
          variant="outline"
          onClick={onNewAssessment}
          leftIcon={<ArrowPathIcon className="h-5 w-5" />}
        >
          {t.results.startNewAssessment}
        </Button>
        <Button onClick={onSave} isLoading={isSaving}>
          {t.results.saveAssessment}
        </Button>
      </div>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight ? 'text-p3-flying-salmon' : 'text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
