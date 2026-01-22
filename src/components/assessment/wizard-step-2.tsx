'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useAssessmentStore } from '@/store/assessment-store';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
import {
  autonomyLevels,
  impactScopes,
  transparencyLevels,
  toSelectOptions,
} from '@/config/dropdown-options';

export function WizardStep2() {
  const { formData, updateFormData, error } = useAssessmentStore();
  const { language } = useAppStore();
  const t = translations[language];

  const autonomyOptions = toSelectOptions(autonomyLevels, language);
  const impactOptions = toSelectOptions(impactScopes, language);
  const transparencyOptions = toSelectOptions(transparencyLevels, language);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t.assessment.aiProperties.title}</CardTitle>
          <CardDescription>{t.assessment.aiProperties.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Autonomy Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.aiProperties.autonomyLevel} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.aiProperties.autonomyLevelDescription}
            </p>
            <Select
              options={autonomyOptions}
              value={formData.autonomyLevel}
              onChange={(value) => updateFormData({ autonomyLevel: value })}
              placeholder={t.assessment.validation.selectOption}
              error={error && !formData.autonomyLevel ? t.assessment.validation.required : undefined}
            />
          </div>

          {/* Impact Scope */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.aiProperties.impactScope} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.aiProperties.impactScopeDescription}
            </p>
            <Select
              options={impactOptions}
              value={formData.impactScope}
              onChange={(value) => updateFormData({ impactScope: value })}
              placeholder={t.assessment.validation.selectOption}
              error={error && !formData.impactScope ? t.assessment.validation.required : undefined}
            />
          </div>

          {/* Transparency Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.assessment.aiProperties.transparencyLevel} <span className="text-p3-flying-salmon">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              {t.assessment.aiProperties.transparencyLevelDescription}
            </p>
            <Select
              options={transparencyOptions}
              value={formData.transparencyLevel}
              onChange={(value) => updateFormData({ transparencyLevel: value })}
              placeholder={t.assessment.validation.selectOption}
              error={error && !formData.transparencyLevel ? t.assessment.validation.required : undefined}
            />
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-p3-purple-rain/10 border border-p3-purple-rain/30 p-4">
            <h4 className="text-sm font-semibold text-p3-purple-rain mb-2">
              {language === 'de' ? 'Hinweis zur Autonomie' : 'Note on Autonomy'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'de'
                ? 'Höhere Autonomiegrade erfordern in der Regel strengere Kontrollmaßnahmen und eine umfassendere Dokumentation gemäß dem EU AI Act.'
                : 'Higher autonomy levels typically require more stringent control measures and more comprehensive documentation according to the EU AI Act.'}
            </p>
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
