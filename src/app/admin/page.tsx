'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Modal,
  ConfirmModal,
  PageLoading,
  EmptyState,
} from '@/components/ui';
import { useAuth, useRequireAdmin } from '@/lib/auth/auth-context';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
// API fetch helpers
async function fetchStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

async function fetchAuditLogs() {
  // For now, return empty array since audit logs API is not fully implemented
  return [];
}
import { formatDateTime } from '@/lib/utils';
import {
  defaultDropdownConfig,
  projectTypes,
  aiTools,
  aiUseCases,
  dataTypes,
  autonomyLevels,
  impactScopes,
  transparencyLevels,
} from '@/config/dropdown-options';
import type { DropdownOption, AIToolOption } from '@/types';

type ConfigCategory =
  | 'projectTypes'
  | 'aiTools'
  | 'aiUseCases'
  | 'dataTypes'
  | 'autonomyLevels'
  | 'impactScopes'
  | 'transparencyLevels';

const CATEGORY_CONFIG: Record<ConfigCategory, { label: string; labelDe: string }> = {
  projectTypes: { label: 'Project Types', labelDe: 'Projekttypen' },
  aiTools: { label: 'AI Tools', labelDe: 'KI-Tools' },
  aiUseCases: { label: 'AI Use Cases', labelDe: 'KI-Anwendungsfälle' },
  dataTypes: { label: 'Data Types', labelDe: 'Datentypen' },
  autonomyLevels: { label: 'Autonomy Levels', labelDe: 'Autonomiegrade' },
  impactScopes: { label: 'Impact Scopes', labelDe: 'Auswirkungsbereiche' },
  transparencyLevels: { label: 'Transparency Levels', labelDe: 'Transparenzgrade' },
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, shouldRedirect } = useRequireAdmin();
  const { language } = useAppStore();
  const t = translations[language];

  const [activeTab, setActiveTab] = React.useState<'config' | 'stats' | 'audit'>('config');
  const [selectedCategory, setSelectedCategory] = React.useState<ConfigCategory>('projectTypes');
  const [config, setConfig] = React.useState(defaultDropdownConfig);
  const [stats, setStats] = React.useState({
    total: 0,
    recentCount: 0,
    byRiskLevel: { minimal: 0, low: 0, medium: 0, high: 0, critical: 0 },
    byStatus: { draft: 0, completed: 0, archived: 0 },
  });
  const [auditLogs, setAuditLogs] = React.useState<Array<{
    id: string;
    action: string;
    entity_type: string;
    created_at: string;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal states
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);
  const [editingOption, setEditingOption] = React.useState<DropdownOption | AIToolOption | null>(null);

  // Form states
  const [formValue, setFormValue] = React.useState('');
  const [formLabelEn, setFormLabelEn] = React.useState('');
  const [formLabelDe, setFormLabelDe] = React.useState('');
  const [formApproved, setFormApproved] = React.useState(false);

  React.useEffect(() => {
    if (shouldRedirect) {
      router.push('/dashboard');
    }
  }, [shouldRedirect, router]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, logsData] = await Promise.all([
          fetchStats(),
          fetchAuditLogs(),
        ]);
        setStats(statsData);
        setAuditLogs(logsData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const resetForm = () => {
    setFormValue('');
    setFormLabelEn('');
    setFormLabelDe('');
    setFormApproved(false);
    setEditingOption(null);
  };

  const handleAddOption = () => {
    if (!formValue || !formLabelEn || !formLabelDe) return;

    const newOption: DropdownOption | AIToolOption = {
      value: formValue.toLowerCase().replace(/\s+/g, '_'),
      labelEn: formLabelEn,
      labelDe: formLabelDe,
      ...(selectedCategory === 'aiTools' && { approved: formApproved }),
    };

    setConfig((prev) => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], newOption],
    }));

    setAddModalOpen(false);
    resetForm();
  };

  const handleEditOption = () => {
    if (!editingOption || !formLabelEn || !formLabelDe) return;

    setConfig((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].map((opt) =>
        opt.value === editingOption.value
          ? {
              ...opt,
              labelEn: formLabelEn,
              labelDe: formLabelDe,
              ...(selectedCategory === 'aiTools' && { approved: formApproved }),
            }
          : opt
      ),
    }));

    setEditModalOpen(false);
    resetForm();
  };

  const handleDeleteOption = () => {
    if (!editingOption) return;

    setConfig((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter(
        (opt) => opt.value !== editingOption.value
      ),
    }));

    setDeleteModalOpen(false);
    resetForm();
  };

  const handleResetConfig = () => {
    setConfig(defaultDropdownConfig);
    setResetModalOpen(false);
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'dropdown-config.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
      } catch (error) {
        console.error('Error importing config:', error);
      }
    };
    reader.readAsText(file);
  };

  const openEditModal = (option: DropdownOption | AIToolOption) => {
    setEditingOption(option);
    setFormLabelEn(option.labelEn);
    setFormLabelDe(option.labelDe);
    if ('approved' in option) {
      setFormApproved(option.approved);
    }
    setEditModalOpen(true);
  };

  const openDeleteModal = (option: DropdownOption | AIToolOption) => {
    setEditingOption(option);
    setDeleteModalOpen(true);
  };

  if (authLoading || !isAdmin) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  const currentCategoryOptions = config[selectedCategory];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.admin.title}</h1>
          <p className="mt-1 text-muted-foreground">{t.admin.subtitle}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'config'
                ? 'border-p3-purple-rain text-p3-purple-rain'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cog6ToothIcon className="h-4 w-4" />
            {t.admin.dropdownConfig}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'stats'
                ? 'border-p3-purple-rain text-p3-purple-rain'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            {language === 'de' ? 'Statistiken' : 'Statistics'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'audit'
                ? 'border-p3-purple-rain text-p3-purple-rain'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DocumentTextIcon className="h-4 w-4" />
            {t.admin.auditLogs}
          </button>
        </div>

        {/* Config Tab */}
        {activeTab === 'config' && (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Category Sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">
                  {language === 'de' ? 'Kategorien' : 'Categories'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {Object.entries(CATEGORY_CONFIG).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as ConfigCategory)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === key
                          ? 'bg-p3-purple-rain/10 text-p3-purple-rain font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {language === 'de' ? value.labelDe : value.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options List */}
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {language === 'de'
                      ? CATEGORY_CONFIG[selectedCategory].labelDe
                      : CATEGORY_CONFIG[selectedCategory].label}
                  </CardTitle>
                  <CardDescription>
                    {currentCategoryOptions.length}{' '}
                    {language === 'de' ? 'Optionen' : 'options'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResetModalOpen(true)}
                    leftIcon={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    {t.common.reset}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportConfig}
                    leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                  >
                    {t.common.export}
                  </Button>
                  <label>
                    <Button
                      variant="outline"
                      size="sm"
                      as="span"
                      leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                    >
                      {t.common.import}
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfig}
                      className="hidden"
                    />
                  </label>
                  <Button
                    size="sm"
                    onClick={() => setAddModalOpen(true)}
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                  >
                    {t.admin.dropdowns.addOption}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentCategoryOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'de' ? option.labelDe : option.labelEn}
                          </p>
                          <p className="text-xs text-muted-foreground">{option.value}</p>
                        </div>
                        {selectedCategory === 'aiTools' && 'approved' in option && (
                          <Badge
                            variant={option.approved ? 'success' : 'warning'}
                            size="sm"
                          >
                            {option.approved
                              ? language === 'de'
                                ? 'Genehmigt'
                                : 'Approved'
                              : language === 'de'
                              ? 'Nicht genehmigt'
                              : 'Not Approved'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditModal(option)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteModal(option)}
                          className="text-muted-foreground hover:text-p3-flying-salmon"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Gesamt' : 'Total Assessments'}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-foreground">
                      {stats.total}
                    </p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-p3-purple-rain" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Diesen Monat' : 'This Month'}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-foreground">
                      {stats.recentCount}
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-p3-green-day" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  {language === 'de' ? 'Nach Risikostufe' : 'By Risk Level'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.byRiskLevel).map(([level, count]) => (
                    <div
                      key={level}
                      className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2"
                    >
                      <Badge
                        variant={
                          `risk-${level}` as
                            | 'risk-minimal'
                            | 'risk-low'
                            | 'risk-medium'
                            | 'risk-high'
                            | 'risk-critical'
                        }
                        size="sm"
                      >
                        {level}
                      </Badge>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.auditLogs}</CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Letzte 50 Aktivitäten'
                  : 'Last 50 activities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs.length > 0 ? (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.entity_type}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(log.created_at, language === 'de' ? 'de-DE' : 'en-US')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<DocumentTextIcon className="h-8 w-8" />}
                  title={language === 'de' ? 'Keine Protokolle' : 'No audit logs'}
                  description={
                    language === 'de'
                      ? 'Es wurden noch keine Aktivitäten protokolliert.'
                      : 'No activities have been logged yet.'
                  }
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Option Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          resetForm();
        }}
        title={t.admin.dropdowns.addOption}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Value (ID)</label>
            <Input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="e.g., new_option"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Label (English)</label>
            <Input
              value={formLabelEn}
              onChange={(e) => setFormLabelEn(e.target.value)}
              placeholder="English label"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Label (German)</label>
            <Input
              value={formLabelDe}
              onChange={(e) => setFormLabelDe(e.target.value)}
              placeholder="German label"
            />
          </div>
          {selectedCategory === 'aiTools' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="approved"
                checked={formApproved}
                onChange={(e) => setFormApproved(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="approved" className="text-sm font-medium">
                {language === 'de' ? 'Genehmigt' : 'Approved'}
              </label>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleAddOption}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Option Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          resetForm();
        }}
        title={t.admin.dropdowns.editOption}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Label (English)</label>
            <Input
              value={formLabelEn}
              onChange={(e) => setFormLabelEn(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Label (German)</label>
            <Input
              value={formLabelDe}
              onChange={(e) => setFormLabelDe(e.target.value)}
            />
          </div>
          {selectedCategory === 'aiTools' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="approved-edit"
                checked={formApproved}
                onChange={(e) => setFormApproved(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="approved-edit" className="text-sm font-medium">
                {language === 'de' ? 'Genehmigt' : 'Approved'}
              </label>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleEditOption}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          resetForm();
        }}
        onConfirm={handleDeleteOption}
        title={t.admin.dropdowns.deleteOption}
        description={
          language === 'de'
            ? `Sind Sie sicher, dass Sie "${editingOption?.labelDe}" löschen möchten?`
            : `Are you sure you want to delete "${editingOption?.labelEn}"?`
        }
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        variant="destructive"
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetConfig}
        title={t.admin.dropdowns.resetDefaults}
        description={
          language === 'de'
            ? 'Sind Sie sicher, dass Sie alle Konfigurationen auf die Standardwerte zurücksetzen möchten?'
            : 'Are you sure you want to reset all configurations to default values?'
        }
        confirmText={t.common.reset}
        cancelText={t.common.cancel}
        variant="destructive"
      />
    </MainLayout>
  );
}
