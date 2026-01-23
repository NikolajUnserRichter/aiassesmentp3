'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  CircularProgress,
  PageLoading,
  ErrorState,
  ConfirmModal,
} from '@/components/ui';
import { useAuth, useRequireAuth } from '@/lib/auth/auth-context';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
// API fetch helpers
async function fetchAssessmentApi(id: string): Promise<Assessment | null> {
  const res = await fetch(`/api/assessments/${id}`);
  if (!res.ok) throw new Error('Failed to fetch assessment');
  const data = await res.json();
  return data.error ? null : data;
}

async function deleteAssessmentApi(id: string) {
  const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete assessment');
  return res.json();
}
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
import type { Assessment, RiskLevel } from '@/types';

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { shouldRedirect } = useRequireAuth();
  const { language } = useAppStore();
  const t = translations[language];

  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const assessmentId = params.id as string;

  React.useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  React.useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAssessmentApi(assessmentId);
        setAssessment(data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError(language === 'de' ? 'Bewertung nicht gefunden' : 'Assessment not found');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId, language]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAssessmentApi(assessmentId);
      router.push('/assessments');
    } catch (err) {
      console.error('Error deleting assessment:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (!assessment) return;

    const tool = aiTools.find((t) => t.value === assessment.ai_tool);
    const isToolApproved = tool?.approved ?? false;

    const exportData = {
      assessmentDate: formatDateTime(assessment.created_at),
      projectType: getOptionLabel(
        projectTypes.find((p) => p.value === assessment.project_type)!,
        language
      ),
      aiTool: getOptionLabel(tool!, language),
      aiUseCases: assessment.ai_use_cases
        .map((uc) => getOptionLabel(aiUseCases.find((u) => u.value === uc)!, language))
        .join(', '),
      dataTypes: assessment.data_types
        .map((dt) => getOptionLabel(dataTypes.find((d) => d.value === dt)!, language))
        .join(', '),
      autonomyLevel: getOptionLabel(
        autonomyLevels.find((a) => a.value === assessment.autonomy_level)!,
        language
      ),
      impactScope: getOptionLabel(
        impactScopes.find((i) => i.value === assessment.impact_scope)!,
        language
      ),
      transparencyLevel: getOptionLabel(
        transparencyLevels.find((t) => t.value === assessment.transparency_level)!,
        language
      ),
      riskScore: assessment.risk_score,
      riskLevel: RISK_LEVEL_LABELS[assessment.risk_level as RiskLevel][language],
      toolApproved: isToolApproved ? t.results.details.yes : t.results.details.no,
      recommendedMeasures: assessment.measures.join('\n'),
    };

    exportToCSV(exportData, `ai-assessment-${assessment.id}`);
  };

  if (authLoading || shouldRedirect) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  if (error || !assessment) {
    return (
      <MainLayout>
        <ErrorState
          message={error || (language === 'de' ? 'Bewertung nicht gefunden' : 'Assessment not found')}
          retry={() => router.push('/assessments')}
        />
      </MainLayout>
    );
  }

  const riskLevel = assessment.risk_level as RiskLevel;
  const tool = aiTools.find((t) => t.value === assessment.ai_tool);
  const isToolApproved = tool?.approved ?? false;

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

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getOptionLabel(
                  projectTypes.find((p) => p.value === assessment.project_type)!,
                  language
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(assessment.created_at, language === 'de' ? 'de-DE' : 'en-US')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            >
              {t.common.export}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(true)}
              className="text-p3-flying-salmon hover:text-p3-flying-salmon"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

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
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-around">
              {/* Risk Score */}
              <div className="text-center">
                <CircularProgress
                  value={assessment.risk_score}
                  max={20}
                  size={140}
                  strokeWidth={10}
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
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                    isToolApproved ? 'bg-p3-green-day/10' : 'bg-p3-flying-salmon/10'
                  }`}
                >
                  {isToolApproved ? (
                    <ShieldCheckIcon className="h-8 w-8 text-p3-green-day" />
                  ) : (
                    <ExclamationTriangleIcon className="h-8 w-8 text-p3-flying-salmon" />
                  )}
                </div>
                <p className="mt-4 text-sm font-medium">
                  {isToolApproved
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
                  projectTypes.find((p) => p.value === assessment.project_type)!,
                  language
                )}
              />
              <DetailRow
                label={t.results.details.aiTool}
                value={getOptionLabel(tool!, language)}
              />
              <DetailRow
                label={t.results.details.aiUseCases}
                value={assessment.ai_use_cases
                  .map((uc) =>
                    getOptionLabel(aiUseCases.find((u) => u.value === uc)!, language)
                  )
                  .join(', ')}
              />
              <DetailRow
                label={t.results.details.dataTypes}
                value={assessment.data_types
                  .map((dt) =>
                    getOptionLabel(dataTypes.find((d) => d.value === dt)!, language)
                  )
                  .join(', ')}
              />
              <DetailRow
                label={t.results.details.autonomyLevel}
                value={getOptionLabel(
                  autonomyLevels.find((a) => a.value === assessment.autonomy_level)!,
                  language
                )}
              />
              <DetailRow
                label={t.results.details.impactScope}
                value={getOptionLabel(
                  impactScopes.find((i) => i.value === assessment.impact_scope)!,
                  language
                )}
              />
              <DetailRow
                label={t.results.details.transparencyLevel}
                value={getOptionLabel(
                  transparencyLevels.find((t) => t.value === assessment.transparency_level)!,
                  language
                )}
              />
              <DetailRow
                label={t.results.details.toolApproved}
                value={isToolApproved ? t.results.details.yes : t.results.details.no}
                highlight={!isToolApproved}
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
            {assessment.measures.length > 0 ? (
              <ul className="space-y-3">
                {assessment.measures.map((measure, index) => (
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={language === 'de' ? 'Bewertung löschen' : 'Delete Assessment'}
        description={
          language === 'de'
            ? 'Sind Sie sicher, dass Sie diese Bewertung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
            : 'Are you sure you want to delete this assessment? This action cannot be undone.'
        }
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        variant="destructive"
        isLoading={isDeleting}
      />
    </MainLayout>
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
