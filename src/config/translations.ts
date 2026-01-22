export const translations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      reset: 'Reset',
      viewAll: 'View All',
      learnMore: 'Learn More',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      assessments: 'Assessments',
      newAssessment: 'New Assessment',
      admin: 'Admin',
      settings: 'Settings',
      help: 'Help',
      signOut: 'Sign Out',
    },

    // Auth
    auth: {
      signIn: 'Sign In',
      signInWithMicrosoft: 'Sign in with Microsoft',
      signOut: 'Sign Out',
      welcomeBack: 'Welcome back',
      pleaseSignIn: 'Please sign in to continue',
    },

    // Landing Page
    landing: {
      title: 'P3 AI Risk Assessment',
      subtitle: 'Evaluate AI usage for compliance with EU AI Act and GDPR',
      getStarted: 'Get Started',
      features: {
        title: 'Why Use This Tool?',
        compliance: {
          title: 'Regulatory Compliance',
          description: 'Ensure your AI usage aligns with EU AI Act and GDPR requirements',
        },
        risk: {
          title: 'Risk Assessment',
          description: 'Systematic evaluation of AI-related risks in your projects',
        },
        guidance: {
          title: 'Actionable Guidance',
          description: 'Get specific recommendations based on your assessment results',
        },
      },
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      recentAssessments: 'Recent Assessments',
      quickStats: 'Quick Stats',
      totalAssessments: 'Total Assessments',
      completedThisMonth: 'Completed This Month',
      highRiskItems: 'High Risk Items',
      startNewAssessment: 'Start New Assessment',
      noAssessments: 'No assessments yet',
      noAssessmentsDescription: 'Start your first AI risk assessment to see results here.',
    },

    // Assessment
    assessment: {
      title: 'AI Risk Assessment',
      subtitle: 'Evaluate AI usage in your project',
      step: 'Step',
      of: 'of',

      // Steps
      steps: {
        context: 'Project Context',
        properties: 'AI Properties',
        results: 'Results',
      },

      // Step 1
      projectContext: {
        title: 'Project & AI System Context',
        description: 'Provide information about your project and the AI system being used.',
        projectType: 'Project Type',
        projectTypeDescription: 'Select the type of project this assessment is for',
        aiTool: 'AI Tool',
        aiToolDescription: 'Select the AI tool or system being used',
        aiUseCases: 'AI Use Cases',
        aiUseCasesDescription: 'Select all applicable use cases for the AI system',
        dataTypes: 'Data Types',
        dataTypesDescription: 'Select all types of data that will be processed',
      },

      // Step 2
      aiProperties: {
        title: 'AI System Properties',
        description: 'Describe the characteristics and deployment of the AI system.',
        autonomyLevel: 'Autonomy Level',
        autonomyLevelDescription: 'How autonomous is the AI system in its operation?',
        impactScope: 'Impact Scope',
        impactScopeDescription: 'What is the scope of impact for AI-generated outputs?',
        transparencyLevel: 'Transparency Level',
        transparencyLevelDescription: 'How explainable are the AI decisions?',
      },

      // Validation
      validation: {
        required: 'This field is required',
        selectOption: 'Please select an option',
        selectAtLeastOne: 'Please select at least one option',
      },
    },

    // Results
    results: {
      title: 'Assessment Results',
      subtitle: 'Review your AI risk assessment results',
      riskScore: 'Risk Score',
      riskLevel: 'Risk Level',
      assessmentDetails: 'Assessment Details',
      recommendations: 'Recommendations',
      measures: 'Recommended Measures',
      noMeasures: 'No specific measures required',
      exportResults: 'Export Results',
      startNewAssessment: 'Start New Assessment',
      saveAssessment: 'Save Assessment',

      // Risk Levels
      riskLevels: {
        minimal: 'Minimal Risk',
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk',
      },

      // Details
      details: {
        projectType: 'Project Type',
        aiTool: 'AI Tool',
        aiUseCases: 'AI Use Cases',
        dataTypes: 'Data Types',
        autonomyLevel: 'Autonomy Level',
        impactScope: 'Impact Scope',
        transparencyLevel: 'Transparency Level',
        toolApproved: 'Tool Approved',
        yes: 'Yes',
        no: 'No',
      },
    },

    // Admin
    admin: {
      title: 'Admin Settings',
      subtitle: 'Manage application configuration',
      dropdownConfig: 'Dropdown Configuration',
      userManagement: 'User Management',
      auditLogs: 'Audit Logs',
      systemSettings: 'System Settings',

      // Dropdown Config
      dropdowns: {
        projectTypes: 'Project Types',
        aiTools: 'AI Tools',
        aiUseCases: 'AI Use Cases',
        dataTypes: 'Data Types',
        autonomyLevels: 'Autonomy Levels',
        impactScopes: 'Impact Scopes',
        transparencyLevels: 'Transparency Levels',
        addOption: 'Add Option',
        editOption: 'Edit Option',
        deleteOption: 'Delete Option',
        resetDefaults: 'Reset to Defaults',
        exportConfig: 'Export Configuration',
        importConfig: 'Import Configuration',
      },
    },

    // Errors
    errors: {
      generic: 'Something went wrong',
      notFound: 'Page not found',
      unauthorized: 'You are not authorized to view this page',
      networkError: 'Network error. Please check your connection.',
      validationError: 'Please check the form for errors',
    },
  },

  de: {
    // Common
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      submit: 'Absenden',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      confirm: 'Bestätigen',
      close: 'Schließen',
      search: 'Suchen',
      filter: 'Filtern',
      export: 'Exportieren',
      import: 'Importieren',
      reset: 'Zurücksetzen',
      viewAll: 'Alle anzeigen',
      learnMore: 'Mehr erfahren',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      assessments: 'Bewertungen',
      newAssessment: 'Neue Bewertung',
      admin: 'Admin',
      settings: 'Einstellungen',
      help: 'Hilfe',
      signOut: 'Abmelden',
    },

    // Auth
    auth: {
      signIn: 'Anmelden',
      signInWithMicrosoft: 'Mit Microsoft anmelden',
      signOut: 'Abmelden',
      welcomeBack: 'Willkommen zurück',
      pleaseSignIn: 'Bitte melden Sie sich an, um fortzufahren',
    },

    // Landing Page
    landing: {
      title: 'P3 KI-Risikobewertung',
      subtitle: 'Bewerten Sie die KI-Nutzung für die Einhaltung von EU AI Act und DSGVO',
      getStarted: 'Jetzt starten',
      features: {
        title: 'Warum dieses Tool nutzen?',
        compliance: {
          title: 'Regulatorische Compliance',
          description: 'Stellen Sie sicher, dass Ihre KI-Nutzung den Anforderungen des EU AI Act und der DSGVO entspricht',
        },
        risk: {
          title: 'Risikobewertung',
          description: 'Systematische Bewertung von KI-bezogenen Risiken in Ihren Projekten',
        },
        guidance: {
          title: 'Handlungsempfehlungen',
          description: 'Erhalten Sie spezifische Empfehlungen basierend auf Ihren Bewertungsergebnissen',
        },
      },
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Willkommen',
      recentAssessments: 'Aktuelle Bewertungen',
      quickStats: 'Schnellübersicht',
      totalAssessments: 'Gesamte Bewertungen',
      completedThisMonth: 'Diesen Monat abgeschlossen',
      highRiskItems: 'Hochrisiko-Elemente',
      startNewAssessment: 'Neue Bewertung starten',
      noAssessments: 'Noch keine Bewertungen',
      noAssessmentsDescription: 'Starten Sie Ihre erste KI-Risikobewertung, um Ergebnisse hier zu sehen.',
    },

    // Assessment
    assessment: {
      title: 'KI-Risikobewertung',
      subtitle: 'Bewerten Sie die KI-Nutzung in Ihrem Projekt',
      step: 'Schritt',
      of: 'von',

      // Steps
      steps: {
        context: 'Projektkontext',
        properties: 'KI-Eigenschaften',
        results: 'Ergebnisse',
      },

      // Step 1
      projectContext: {
        title: 'Projekt- & KI-Systemkontext',
        description: 'Geben Sie Informationen über Ihr Projekt und das verwendete KI-System an.',
        projectType: 'Projekttyp',
        projectTypeDescription: 'Wählen Sie den Projekttyp für diese Bewertung',
        aiTool: 'KI-Tool',
        aiToolDescription: 'Wählen Sie das verwendete KI-Tool oder -System',
        aiUseCases: 'KI-Anwendungsfälle',
        aiUseCasesDescription: 'Wählen Sie alle zutreffenden Anwendungsfälle für das KI-System',
        dataTypes: 'Datentypen',
        dataTypesDescription: 'Wählen Sie alle Arten von Daten, die verarbeitet werden',
      },

      // Step 2
      aiProperties: {
        title: 'KI-Systemeigenschaften',
        description: 'Beschreiben Sie die Eigenschaften und den Einsatz des KI-Systems.',
        autonomyLevel: 'Autonomiegrad',
        autonomyLevelDescription: 'Wie autonom arbeitet das KI-System?',
        impactScope: 'Auswirkungsbereich',
        impactScopeDescription: 'Was ist der Auswirkungsbereich für KI-generierte Ausgaben?',
        transparencyLevel: 'Transparenzgrad',
        transparencyLevelDescription: 'Wie erklärbar sind die KI-Entscheidungen?',
      },

      // Validation
      validation: {
        required: 'Dieses Feld ist erforderlich',
        selectOption: 'Bitte wählen Sie eine Option',
        selectAtLeastOne: 'Bitte wählen Sie mindestens eine Option',
      },
    },

    // Results
    results: {
      title: 'Bewertungsergebnisse',
      subtitle: 'Überprüfen Sie Ihre KI-Risikobewertungsergebnisse',
      riskScore: 'Risikopunktzahl',
      riskLevel: 'Risikostufe',
      assessmentDetails: 'Bewertungsdetails',
      recommendations: 'Empfehlungen',
      measures: 'Empfohlene Maßnahmen',
      noMeasures: 'Keine spezifischen Maßnahmen erforderlich',
      exportResults: 'Ergebnisse exportieren',
      startNewAssessment: 'Neue Bewertung starten',
      saveAssessment: 'Bewertung speichern',

      // Risk Levels
      riskLevels: {
        minimal: 'Minimales Risiko',
        low: 'Niedriges Risiko',
        medium: 'Mittleres Risiko',
        high: 'Hohes Risiko',
        critical: 'Kritisches Risiko',
      },

      // Details
      details: {
        projectType: 'Projekttyp',
        aiTool: 'KI-Tool',
        aiUseCases: 'KI-Anwendungsfälle',
        dataTypes: 'Datentypen',
        autonomyLevel: 'Autonomiegrad',
        impactScope: 'Auswirkungsbereich',
        transparencyLevel: 'Transparenzgrad',
        toolApproved: 'Tool genehmigt',
        yes: 'Ja',
        no: 'Nein',
      },
    },

    // Admin
    admin: {
      title: 'Admin-Einstellungen',
      subtitle: 'Anwendungskonfiguration verwalten',
      dropdownConfig: 'Dropdown-Konfiguration',
      userManagement: 'Benutzerverwaltung',
      auditLogs: 'Audit-Protokolle',
      systemSettings: 'Systemeinstellungen',

      // Dropdown Config
      dropdowns: {
        projectTypes: 'Projekttypen',
        aiTools: 'KI-Tools',
        aiUseCases: 'KI-Anwendungsfälle',
        dataTypes: 'Datentypen',
        autonomyLevels: 'Autonomiegrade',
        impactScopes: 'Auswirkungsbereiche',
        transparencyLevels: 'Transparenzgrade',
        addOption: 'Option hinzufügen',
        editOption: 'Option bearbeiten',
        deleteOption: 'Option löschen',
        resetDefaults: 'Auf Standardwerte zurücksetzen',
        exportConfig: 'Konfiguration exportieren',
        importConfig: 'Konfiguration importieren',
      },
    },

    // Errors
    errors: {
      generic: 'Etwas ist schief gelaufen',
      notFound: 'Seite nicht gefunden',
      unauthorized: 'Sie sind nicht berechtigt, diese Seite anzuzeigen',
      networkError: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.',
      validationError: 'Bitte überprüfen Sie das Formular auf Fehler',
    },
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(
  key: string,
  language: 'en' | 'de'
): string {
  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}
