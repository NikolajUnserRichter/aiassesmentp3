'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  EmptyState,
  CardSkeleton,
} from '@/components/ui';
import { useAuth, useRequireAuth } from '@/lib/auth/auth-context';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
import { getAssessments, getAssessmentStats } from '@/lib/supabase/queries';
import { getRiskLevelBadgeColor, formatDate } from '@/lib/utils';
import type { Assessment } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { shouldRedirect } = useRequireAuth();
  const { language } = useAppStore();
  const t = translations[language];

  const [assessments, setAssessments] = React.useState<Assessment[]>([]);
  const [stats, setStats] = React.useState({
    total: 0,
    recentCount: 0,
    byRiskLevel: { minimal: 0, low: 0, medium: 0, high: 0, critical: 0 },
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const [assessmentsData, statsData] = await Promise.all([
          getAssessments(user.id),
          getAssessmentStats(user.id),
        ]);

        setAssessments(assessmentsData as Assessment[]);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (authLoading || shouldRedirect) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-p3-purple-rain animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const highRiskCount = stats.byRiskLevel.high + stats.byRiskLevel.critical;
  const recentAssessments = assessments.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t.dashboard.welcome}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t.dashboard.title}
            </p>
          </div>
          <Link href="/assessments/new">
            <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
              {t.dashboard.startNewAssessment}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" hover="lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.dashboard.totalAssessments}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {isLoading ? '-' : stats.total}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-p3-purple-rain/10">
                    <DocumentTextIcon className="h-6 w-6 text-p3-purple-rain" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="gradient" hover="lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.dashboard.completedThisMonth}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {isLoading ? '-' : stats.recentCount}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-p3-green-day/10">
                    <ClockIcon className="h-6 w-6 text-p3-green-day" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" hover="lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.dashboard.highRiskItems}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {isLoading ? '-' : highRiskCount}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-p3-flying-salmon/10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-p3-flying-salmon" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="gradient" hover="lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t.dashboard.quickStats}
                    </p>
                    <div className="mt-2 flex gap-1">
                      {Object.entries(stats.byRiskLevel).map(([level, count]) => {
                        if (count === 0) return null;
                        const colors = getRiskLevelBadgeColor(level);
                        return (
                          <Badge
                            key={level}
                            variant={`risk-${level}` as 'risk-minimal' | 'risk-low' | 'risk-medium' | 'risk-high' | 'risk-critical'}
                            size="sm"
                          >
                            {count}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-p3-electric-blue/10">
                    <ChartBarIcon className="h-6 w-6 text-p3-electric-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Assessments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.dashboard.recentAssessments}</CardTitle>
              {assessments.length > 5 && (
                <Link href="/assessments">
                  <Button variant="ghost" size="sm">
                    {t.common.viewAll}
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : recentAssessments.length > 0 ? (
                <div className="space-y-4">
                  {recentAssessments.map((assessment) => {
                    const riskColors = getRiskLevelBadgeColor(assessment.risk_level);
                    return (
                      <Link
                        key={assessment.id}
                        href={`/assessments/${assessment.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-p3-purple-rain/50 hover:shadow-md">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {assessment.project_type.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {assessment.ai_tool.replace(/_/g, ' ')} • {formatDate(assessment.created_at, language === 'de' ? 'de-DE' : 'en-US')}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={`risk-${assessment.risk_level}` as 'risk-minimal' | 'risk-low' | 'risk-medium' | 'risk-high' | 'risk-critical'}
                          >
                            {t.results.riskLevels[assessment.risk_level as keyof typeof t.results.riskLevels]}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<DocumentTextIcon className="h-8 w-8" />}
                  title={t.dashboard.noAssessments}
                  description={t.dashboard.noAssessmentsDescription}
                  action={
                    <Link href="/assessments/new">
                      <Button leftIcon={<PlusIcon className="h-5 w-5" />}>
                        {t.dashboard.startNewAssessment}
                      </Button>
                    </Link>
                  }
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
