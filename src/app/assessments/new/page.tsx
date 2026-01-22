'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/layout';
import { Button, StepProgress } from '@/components/ui';
import { WizardStep1, WizardStep2, WizardStep3 } from '@/components/assessment';
import { useAuth, useRequireAuth } from '@/lib/auth/auth-context';
import { useAssessmentStore } from '@/store/assessment-store';
import { useAppStore } from '@/store/app-store';
import { translations } from '@/config/translations';
import { calculateRiskScore } from '@/lib/utils/risk-calculator';
import { createAssessment } from '@/lib/supabase/queries';
import { aiTools } from '@/config/dropdown-options';

const STEPS = ['Context', 'Properties', 'Results'];
const STEPS_DE = ['Kontext', 'Eigenschaften', 'Ergebnisse'];

export default function NewAssessmentPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { shouldRedirect } = useRequireAuth();
  const { language } = useAppStore();
  const t = translations[language];

  const {
    currentStep,
    formData,
    result,
    isSubmitting,
    setStep,
    nextStep,
    previousStep,
    setResult,
    setIsSubmitting,
    resetAssessment,
    validateStep,
  } = useAssessmentStore();

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  // Reset assessment on mount
  React.useEffect(() => {
    resetAssessment();
  }, [resetAssessment]);

  const handleNext = () => {
    if (currentStep === 2) {
      // Calculate results
      const validation = validateStep(2);
      if (validation.valid) {
        const assessmentResult = calculateRiskScore(formData, aiTools);
        setResult(assessmentResult);
        setStep(3);
      }
    } else {
      nextStep();
    }
  };

  const handleSave = async () => {
    if (!user?.id || !result) return;

    try {
      setIsSaving(true);

      await createAssessment({
        user_id: user.id,
        project_type: formData.projectType,
        ai_tool: formData.aiTool,
        ai_use_cases: formData.aiUseCases,
        data_types: formData.dataTypes,
        autonomy_level: formData.autonomyLevel,
        impact_scope: formData.impactScope,
        transparency_level: formData.transparencyLevel,
        risk_score: result.riskScore,
        risk_level: result.riskLevel,
        measures: result.measures,
        status: 'completed',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewAssessment = () => {
    resetAssessment();
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

  const steps = language === 'de' ? STEPS_DE : STEPS;

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.assessment.title}</h1>
          <p className="mt-1 text-muted-foreground">{t.assessment.subtitle}</p>
        </div>

        {/* Step Progress */}
        <StepProgress steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && <WizardStep1 key="step1" />}
          {currentStep === 2 && <WizardStep2 key="step2" />}
          {currentStep === 3 && (
            <WizardStep3
              key="step3"
              onSave={handleSave}
              onNewAssessment={handleNewAssessment}
              isSaving={isSaving}
            />
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
            >
              {t.common.previous}
            </Button>
            <Button
              onClick={handleNext}
              rightIcon={<ArrowRightIcon className="h-5 w-5" />}
            >
              {currentStep === 2 ? t.results.title : t.common.next}
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
