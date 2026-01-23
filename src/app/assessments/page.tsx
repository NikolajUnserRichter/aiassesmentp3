'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Select,
  EmptyState,
  CardSkeleton,
  ConfirmModal,
} from '@/components/ui';
import { useAuth, useRequireAuth } from '@/lib/auth/auth-context';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
// API fetch helpers
async function fetchAssessmentsApi(userId: string): Promise<Assessment[]> {
  const res = await fetch(`/api/assessments?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function deleteAssessmentApi(id: string) {
  const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete assessment');
  return res.json();
}
import { formatDate } from '@/lib/utils';
import type { Assessment } from '@/types';

const RISK_FILTER_OPTIONS = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function AssessmentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { shouldRedirect } = useRequireAuth();
  const { language } = useAppStore();
  const t = translations[language];

  const [assessments, setAssessments] = React.useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = React.useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [riskFilter, setRiskFilter] = React.useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  React.useEffect(() => {
    const loadAssessments = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const data = await fetchAssessmentsApi(user.id);
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadAssessments();
    }
  }, [user?.id]);

  // Filter assessments
  React.useEffect(() => {
    let filtered = [...assessments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.project_type.toLowerCase().includes(query) ||
          a.ai_tool.toLowerCase().includes(query)
      );
    }

    // Apply risk level filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter((a) => a.risk_level === riskFilter);
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchQuery, riskFilter]);

  const handleDeleteClick = (id: string) => {
    setAssessmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assessmentToDelete) return;

    try {
      setIsDeleting(true);
      await deleteAssessmentApi(assessmentToDelete);
      setAssessments((prev) => prev.filter((a) => a.id !== assessmentToDelete));
      setDeleteModalOpen(false);
      setAssessmentToDelete(null);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || shouldRedirect) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-p3-purple-rain animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.nav.assessments}</h1>
            <p className="mt-1 text-muted-foreground">
              {language === 'de'
                ? 'Verwalten Sie Ihre KI-Risikobewertungen'
                : 'Manage your AI risk assessments'}
            </p>
          </div>
          <Link href="/assessments/new">
            <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
              {t.nav.newAssessment}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  options={RISK_FILTER_OPTIONS}
                  value={riskFilter}
                  onChange={setRiskFilter}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAssessments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover="lift">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <Link
                        href={`/assessments/${assessment.id}`}
                        className="flex flex-1 items-center gap-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                          <DocumentTextIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {assessment.project_type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assessment.ai_tool.replace(/_/g, ' ')} •{' '}
                            {formatDate(
                              assessment.created_at,
                              language === 'de' ? 'de-DE' : 'en-US'
                            )}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            `risk-${assessment.risk_level}` as
                              | 'risk-minimal'
                              | 'risk-low'
                              | 'risk-medium'
                              | 'risk-high'
                              | 'risk-critical'
                          }
                        >
                          {
                            t.results.riskLevels[
                              assessment.risk_level as keyof typeof t.results.riskLevels
                            ]
                          }
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteClick(assessment.id)}
                          className="text-muted-foreground hover:text-p3-flying-salmon"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<DocumentTextIcon className="h-8 w-8" />}
            title={
              searchQuery || riskFilter !== 'all'
                ? language === 'de'
                  ? 'Keine Ergebnisse gefunden'
                  : 'No results found'
                : t.dashboard.noAssessments
            }
            description={
              searchQuery || riskFilter !== 'all'
                ? language === 'de'
                  ? 'Versuchen Sie, Ihre Suchkriterien anzupassen'
                  : 'Try adjusting your search criteria'
                : t.dashboard.noAssessmentsDescription
            }
            action={
              !searchQuery && riskFilter === 'all' ? (
                <Link href="/assessments/new">
                  <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
                    {t.dashboard.startNewAssessment}
                  </Button>
                </Link>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
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
