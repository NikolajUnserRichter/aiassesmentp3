import { create } from 'zustand';
import type { AssessmentFormData, AssessmentResult } from '@/types';

const initialFormData: AssessmentFormData = {
  projectType: '',
  aiTool: '',
  aiUseCases: [],
  dataTypes: [],
  autonomyLevel: '',
  impactScope: '',
  transparencyLevel: '',
};

interface AssessmentState {
  currentStep: number;
  formData: AssessmentFormData;
  result: AssessmentResult | null;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<AssessmentFormData>) => void;
  setResult: (result: AssessmentResult) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  resetAssessment: () => void;
  validateStep: (step: number) => { valid: boolean; errors: string[] };
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  result: null,
  isSubmitting: false,
  error: null,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, validateStep } = get();
    const validation = validateStep(currentStep);
    if (validation.valid && currentStep < 3) {
      set({ currentStep: currentStep + 1, error: null });
    } else if (!validation.valid) {
      set({ error: validation.errors[0] });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1, error: null });
    }
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
      error: null,
    }));
  },

  setResult: (result) => set({ result }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  setError: (error) => set({ error }),

  resetAssessment: () => {
    set({
      currentStep: 1,
      formData: initialFormData,
      result: null,
      isSubmitting: false,
      error: null,
    });
  },

  validateStep: (step) => {
    const { formData } = get();
    const errors: string[] = [];

    if (step === 1) {
      if (!formData.projectType) {
        errors.push('Please select a project type');
      }
      if (!formData.aiTool) {
        errors.push('Please select an AI tool');
      }
      if (formData.aiUseCases.length === 0) {
        errors.push('Please select at least one AI use case');
      }
      if (formData.dataTypes.length === 0) {
        errors.push('Please select at least one data type');
      }
    }

    if (step === 2) {
      if (!formData.autonomyLevel) {
        errors.push('Please select an autonomy level');
      }
      if (!formData.impactScope) {
        errors.push('Please select an impact scope');
      }
      if (!formData.transparencyLevel) {
        errors.push('Please select a transparency level');
      }
    }

    return { valid: errors.length === 0, errors };
  },
}));
