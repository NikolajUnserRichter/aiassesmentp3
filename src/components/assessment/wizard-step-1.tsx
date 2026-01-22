'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, MultiSelect } from '@/components/ui/select';
import { useAssessmentStore } from '@/store/assessment-store';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
import {
  projectTypes,
  aiUseCases,
  dataTypes,
  toSelectOptions,
  getAIToolsGrouped,
} from '@/config/dropdown-options';

export function WizardStep1() {
  const { formData, updateFormData, error } = useAssessmentStore();
  const { language } = useAppStore();
  const t = translations[language];

  const projectTypeOptions = toSelectOptions(projectTypes, language);
  const aiToolOptions = getAIToolsGrouped(language);
  const aiUseCaseOptions = toSelectOptions(aiUseCases, language);
  const dataTypeOptions = toSelectOptions(dataTypes, language);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t.assessment.projectContext.title}</CardTitle>
          <CardDescription>{t.assessment.projectContext.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.projectContext.projectType} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.projectContext.projectTypeDescription}
            </p>
            <Select
              options={projectTypeOptions}
              value={formData.projectType}
              onChange={(value) => updateFormData({ projectType: value })}
              placeholder={t.assessment.validation.selectOption}
              error={error && !formData.projectType ? t.assessment.validation.required : undefined}
            />
          </div>

          {/* AI Tool */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.projectContext.aiTool} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.projectContext.aiToolDescription}
            </p>
            <Select
              options={aiToolOptions}
              value={formData.aiTool}
              onChange={(value) => updateFormData({ aiTool: value })}
              placeholder={t.assessment.validation.selectOption}
              groupBy={true}
              error={error && !formData.aiTool ? t.assessment.validation.required : undefined}
            />
          </div>

          {/* AI Use Cases */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.projectContext.aiUseCases} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.projectContext.aiUseCasesDescription}
            </p>
            <MultiSelect
              options={aiUseCaseOptions}
              value={formData.aiUseCases}
              onChange={(value) => updateFormData({ aiUseCases: value })}
              placeholder={t.assessment.validation.selectAtLeastOne}
              error={error && formData.aiUseCases.length === 0 ? t.assessment.validation.selectAtLeastOne : undefined}
            />
          </div>

          {/* Data Types */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.projectContext.dataTypes} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.projectContext.dataTypesDescription}
            </p>
            <MultiSelect
              options={dataTypeOptions}
              value={formData.dataTypes}
              onChange={(value) => updateFormData({ dataTypes: value })}
              placeholder={t.assessment.validation.selectAtLeastOne}
              error={error && formData.dataTypes.length === 0 ? t.assessment.validation.selectAtLeastOne : undefined}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-p3-flying-salmon/10 border border-p3-flying-salmon/30 p-4">
              <p className="text-sm text-p3-flying-salmon">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
