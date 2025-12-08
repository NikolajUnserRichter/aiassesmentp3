/**
 * P3 AI Risk Assessment Tool - Main Application Script
 * 
 * This application provides risk assessment for AI systems used in
 * P3 consulting projects, with consideration for EU AI Act and GDPR compliance.
 * 
 * Features:
 * - Multi-language support (English/German)
 * - Theme switching (Light/Dark mode)
 * - Risk calculation based on multiple factors
 * - Interactive assessment workflow
 * - Results export functionality
 */

// ===== APPLICATION STATE =====
let currentAssessment = null;
let currentLanguage = 'en'; // Default language
let currentTheme = 'light'; // Default theme

// ===== CONSTANTS =====
const SCROLL_OFFSET = 120; // Offset in pixels for smooth scrolling to keep header/tabs visible

// Define approved AI tools list
const APPROVED_AI_TOOLS = ['m365_copilot', 'ai_builder'];

// Navigation delay for smooth transition when auto-navigating to results
const AUTO_NAVIGATION_DELAY_MS = 300;

// Maximum risk score components: autonomy(5) + data(5) + impact(5) + transparency(2) + unapproved_tool(3) = 20
const MAX_RISK_SCORE = 20;

// Risk scoring weights
const AUTONOMY_SCORES = {
    'support_only': 1,
    'interactive': 2,
    'semi_automated': 3,
    'automated': 4,
    'critical_automated': 5
};

const IMPACT_SCORES = {
    'internal_efficiency': 1,
    'project_support': 2,
    'client_deliverable': 3,
    'strategic_decision': 4,
    'critical_operations': 5
};

const DATA_SCORES = {
    'public_only': 0,
    'company_general': 1,
    'client_confidential': 2,
    'strategic_sensitive': 3,
    'personal_data': 4,
    'special_categories': 5
};

// Theme toggle function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButtons();
}

const translations = {
    en: {
        headerTitle: 'P3 AI Risk Assessment Tool',
        headerSubtitle: 'Strategic Assessment of AI Systems for Consulting Projects',
        'intro.title': 'AI Risk Assessment for Your Projects',
        'intro.description': 'This tool provides a comprehensive risk assessment for AI systems used in P3 consulting projects. It evaluates compliance with the EU AI Act and GDPR, helping you make informed decisions about AI tool usage. Complete the assessment to receive tailored recommendations and risk mitigation strategies.',
        'btn.startAssessment': '🚀 Start Assessment',
        'tab.assessment': 'Assessment',
        'tab.results': 'Risk Analysis',
        'tab.measures': 'Recommendations',
        'section.context': 'Project & AI System Context',
        'section.properties': 'AI System Properties',
        'label.projectType': 'Project Type / Area:',
        'label.aiTool': 'AI Tool / System:',
        'label.aiUseCase': 'AI Use Case:',
        'label.dataType': 'Processed Data Types:',
        'label.autonomy': 'Level of Autonomy:',
        'label.impact': 'Impact Scope:',
        'label.transparency': 'AI System Transparency:',
        'option.pleaseSelect': 'Please select...',
        'option.strategy': 'Strategy Consulting & Business Development',
        'option.digitalTransformation': 'Digital Transformation',
        'option.processOptimization': 'Process Optimization & Change Management',
        'option.softwareDevelopment': 'Software Development & Implementation',
        'option.dataAnalytics': 'Data Analytics & AI Solutions',
        'option.automotive': 'Automotive Engineering & Mobility',
        'option.internalOperations': 'Internal P3 Operations',
        'option.m365Copilot': 'M365 Copilot',
        'option.aiBuilder': 'AI Builder in Power Platform',
        'option.chatgpt': 'ChatGPT (OpenAI)',
        'option.gpt4': 'GPT-4 / GPT-4o (OpenAI)',
        'option.claude': 'Claude (Anthropic)',
        'option.gemini': 'Google Gemini / Bard',
        'option.githubCopilot': 'GitHub Copilot',
        'option.azureOpenai': 'Azure OpenAI Service',
        'option.awsBedrock': 'AWS Bedrock',
        'option.huggingface': 'HuggingFace Models',
        'option.midjourney': 'Midjourney / DALL-E (Image Gen)',
        'option.jasper': 'Jasper AI',
        'option.notionAi': 'Notion AI',
        'option.perplexity': 'Perplexity AI',
        'option.otherAI': 'Other AI System',
        'option.clientAdvisory': 'Client Advisory & Insight Generation',
        'option.predictiveAnalytics': 'Predictive Analytics & Forecasting',
        'option.automation': 'Process Automation',
        'option.decisionSupport': 'Decision Support System',
        'option.nlpAnalysis': 'NLP & Document Analysis',
        'option.codeGeneration': 'Code Generation & Testing',
        'option.resourceAllocation': 'Resource & Project Allocation',
        'option.riskAssessment': 'Risk Assessment & Compliance',
        'option.publicOnly': 'Public data only',
        'option.companyGeneral': 'General company data (anonymized)',
        'option.clientConfidential': 'Confidential client data',
        'option.strategicSensitive': 'Strategically sensitive information',
        'option.personalData': 'Personal data (employees/clients)',
        'option.specialCategories': 'Special categories of personal data',
        'option.supportOnly': 'Support: AI generates suggestions/insights',
        'option.interactive': 'Interactive: AI communicates with stakeholders',
        'option.semiAutomated': 'Semi-automated: AI makes preliminary decisions',
        'option.automated': 'Automated: AI makes final decisions',
        'option.criticalAutomated': 'Critical: AI makes high-impact decisions',
        'option.internalEfficiency': 'Internal efficiency (low impact)',
        'option.projectSupport': 'Project support (medium impact)',
        'option.clientDeliverable': 'Client deliverable (high impact)',
        'option.strategicDecision': 'Strategic decision basis',
        'option.criticalOperations': 'Critical business processes',
        'option.transparencyHigh': 'High: Decisions fully traceable',
        'option.transparencyMedium': 'Medium: Key factors explainable',
        'option.transparencyLow': 'Low: Black-box system',
        'info.note': 'Note:',
        'info.disclaimer': 'This tool provides an initial risk assessment of AI systems in the context of P3 consulting projects, considering the EU AI Act and GDPR.',
        'empty.results': 'Please complete the assessment first.',
        'empty.measures': 'Please complete the assessment first.',
        'btn.export': '📄 Export Assessment (CSV)',
        'btn.reset': '🔄 New Assessment',
        'result.riskAssessment': 'Risk Assessment',
        'result.riskScore': 'Risk Score',
        'result.projectType': 'Project Type',
        'result.recommendedMeasures': 'Recommended Measures',
        'result.assessmentDetails': 'Assessment Details',
        'result.aiTool': 'AI Tool',
        'result.aiUseCase': 'AI Use Case',
        'result.dataType': 'Data Type',
        'result.autonomy': 'Autonomy Level',
        'result.impact': 'Impact',
        'result.transparency': 'Transparency',
        'measures.title': 'Recommended Measures',
        'risk.minimal': 'Minimal Risk',
        'risk.low': 'Low Risk',
        'risk.medium': 'Medium Risk',
        'risk.high': 'High Risk',
        'risk.critical': 'Critical Risk',
        languageBtn: '🇩🇪 Deutsch'
    },
    de: {
        headerTitle: 'P3 AI Risk Assessment Tool',
        headerSubtitle: 'Strategische Bewertung von KI-Systemen für Consulting-Projekte',
        'intro.title': 'KI-Risikobewertung für Ihre Projekte',
        'intro.description': 'Dieses Tool bietet eine umfassende Risikobewertung für KI-Systeme, die in P3-Beratungsprojekten eingesetzt werden. Es bewertet die Einhaltung des EU AI Act und der DSGVO und hilft Ihnen, fundierte Entscheidungen über die Verwendung von KI-Tools zu treffen. Führen Sie die Bewertung durch, um maßgeschneiderte Empfehlungen und Risikominderungsstrategien zu erhalten.',
        'btn.startAssessment': '🚀 Assessment starten',
        'tab.assessment': 'Assessment',
        'tab.results': 'Risiko-Analyse',
        'tab.measures': 'Empfehlungen',
        'section.context': 'Projekt & KI-System Kontext',
        'section.properties': 'KI-System Eigenschaften',
        'label.projectType': 'Projekttyp / Bereich:',
        'label.aiTool': 'KI-Tool / System:',
        'label.aiUseCase': 'KI-Anwendungsfall:',
        'label.dataType': 'Verarbeitete Datentypen:',
        'label.autonomy': 'Autonomiegrad:',
        'label.impact': 'Auswirkungsbereich:',
        'label.transparency': 'KI-System Transparenz:',
        'option.pleaseSelect': 'Bitte wählen...',
        'option.strategy': 'Strategieberatung & Business Development',
        'option.digitalTransformation': 'Digitale Transformation',
        'option.processOptimization': 'Prozessoptimierung & Change Management',
        'option.softwareDevelopment': 'Softwareentwicklung & Implementation',
        'option.dataAnalytics': 'Data Analytics & AI Solutions',
        'option.automotive': 'Automotive Engineering & Mobility',
        'option.internalOperations': 'Interne P3-Operationen',
        'option.m365Copilot': 'M365 Copilot',
        'option.aiBuilder': 'AI Builder in Power Platform',
        'option.chatgpt': 'ChatGPT (OpenAI)',
        'option.gpt4': 'GPT-4 / GPT-4o (OpenAI)',
        'option.claude': 'Claude (Anthropic)',
        'option.gemini': 'Google Gemini / Bard',
        'option.githubCopilot': 'GitHub Copilot',
        'option.azureOpenai': 'Azure OpenAI Service',
        'option.awsBedrock': 'AWS Bedrock',
        'option.huggingface': 'HuggingFace Models',
        'option.midjourney': 'Midjourney / DALL-E (Bildgenerierung)',
        'option.jasper': 'Jasper AI',
        'option.notionAi': 'Notion AI',
        'option.perplexity': 'Perplexity AI',
        'option.otherAI': 'Anderes KI-System',
        'option.clientAdvisory': 'Client Advisory & Insight Generation',
        'option.predictiveAnalytics': 'Predictive Analytics & Forecasting',
        'option.automation': 'Prozessautomatisierung',
        'option.decisionSupport': 'Decision Support System',
        'option.nlpAnalysis': 'NLP & Document Analysis',
        'option.codeGeneration': 'Code Generation & Testing',
        'option.resourceAllocation': 'Resource & Project Allocation',
        'option.riskAssessment': 'Risk Assessment & Compliance',
        'option.publicOnly': 'Ausschließlich öffentliche Daten',
        'option.companyGeneral': 'Allgemeine Unternehmensdaten (anonymisiert)',
        'option.clientConfidential': 'Vertrauliche Kundendaten',
        'option.strategicSensitive': 'Strategisch sensible Informationen',
        'option.personalData': 'Personenbezogene Daten (Mitarbeiter/Kunden)',
        'option.specialCategories': 'Besondere Kategorien personenbezogener Daten',
        'option.supportOnly': 'Unterstützung: KI generiert Vorschläge/Insights',
        'option.interactive': 'Interaktiv: KI kommuniziert mit Stakeholdern',
        'option.semiAutomated': 'Semi-automatisiert: KI trifft Vorentscheidungen',
        'option.automated': 'Automatisiert: KI trifft finale Entscheidungen',
        'option.criticalAutomated': 'Kritisch: KI trifft Entscheidungen mit hoher Tragweite',
        'option.internalEfficiency': 'Interne Effizienz (low impact)',
        'option.projectSupport': 'Projektunterstützung (medium impact)',
        'option.clientDeliverable': 'Client Deliverable (high impact)',
        'option.strategicDecision': 'Strategische Entscheidungsgrundlage',
        'option.criticalOperations': 'Kritische Geschäftsprozesse',
        'option.transparencyHigh': 'Hoch: Entscheidungen vollständig nachvollziehbar',
        'option.transparencyMedium': 'Mittel: Wesentliche Faktoren erklärbar',
        'option.transparencyLow': 'Gering: Black-Box System',
        'info.note': 'Hinweis:',
        'info.disclaimer': 'Dieses Tool bietet eine erste Einschätzung zur Risikobewertung von KI-Systemen im Kontext der P3-Beratungsprojekte unter Berücksichtigung des EU AI Acts und DSGVO.',
        'empty.results': 'Bitte führen Sie zunächst das Assessment durch.',
        'empty.measures': 'Bitte führen Sie zunächst das Assessment durch.',
        'btn.export': '📄 Assessment exportieren (CSV)',
        'btn.reset': '🔄 Neues Assessment',
        'result.riskAssessment': 'Risiko-Bewertung',
        'result.riskScore': 'Risk Score',
        'result.projectType': 'Projekttyp',
        'result.recommendedMeasures': 'Empfohlene Maßnahmen',
        'result.assessmentDetails': 'Assessment Details',
        'result.aiTool': 'KI-Tool',
        'result.aiUseCase': 'KI-Anwendungsfall',
        'result.dataType': 'Datentyp',
        'result.autonomy': 'Autonomiegrad',
        'result.impact': 'Impact',
        'result.transparency': 'Transparenz',
        'measures.title': 'Empfohlene Maßnahmen',
        'risk.minimal': 'Minimales Risiko',
        'risk.low': 'Geringes Risiko',
        'risk.medium': 'Mittleres Risiko',
        'risk.high': 'Hohes Risiko',
        'risk.critical': 'Kritisches Risiko',
        languageBtn: '🇬🇧 English'
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
    
    // Re-render results if assessment exists
    if (currentAssessment) {
        updateResults(currentAssessment);
    }
}

function updateLanguage() {
    const lang = translations[currentLanguage];
    
    // Update header
    document.getElementById('headerTitle').textContent = lang.headerTitle;
    document.getElementById('headerSubtitle').textContent = lang.headerSubtitle;
    
    // Update language buttons
    const langBtns = [document.getElementById('languageBtn'), document.getElementById('languageBtn2')];
    langBtns.forEach((btn, index) => {
        if (btn) {
            // Sticky header button (short version)
            if (index === 0) {
                btn.textContent = currentLanguage === 'en' ? '🇩🇪' : '🇬🇧';
            } else {
                // Regular button (full text version)
                btn.textContent = lang.languageBtn;
            }
        }
    });
    
    // Update tabs
    document.querySelector('[data-tab="assessment"]').textContent = lang['tab.assessment'];
    document.querySelector('[data-tab="results"]').textContent = lang['tab.results'];
    document.querySelector('[data-tab="measures"]').textContent = lang['tab.measures'];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });
    
    // Update info boxes
    if (currentLanguage === 'de') {
        document.getElementById('infoBox1').innerHTML = `
            <strong>⚠️ P3 AI Policy:</strong> Aktuell sind nur folgende KI-Tools für den Einsatz freigegeben:
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li><strong>AI Builder in Power Platform</strong> - für Automatisierung und intelligente Workflows</li>
                <li><strong>M365 Copilot</strong> - für Produktivitätssteigerung in Microsoft 365</li>
            </ul>
            Alle anderen KI-Systeme (einschließlich ChatGPT, Claude, GitHub Copilot, etc.) <strong>benötigen eine IT-Genehmigung</strong> vor der Nutzung. Bitte kontaktieren Sie die IT-Abteilung für eine Bewertung.
        `;
    } else {
        document.getElementById('infoBox1').innerHTML = `
            <strong>⚠️ P3 AI Policy:</strong> Currently, only the following AI tools are approved for use:
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li><strong>AI Builder in Power Platform</strong> - for automation and intelligent workflows</li>
                <li><strong>M365 Copilot</strong> - for productivity enhancement in Microsoft 365</li>
            </ul>
            All other AI systems (including ChatGPT, Claude, GitHub Copilot, etc.) <strong>require IT approval</strong> before use. Please contact the IT department for assessment.
        `;
    }
    
    // Update AI Tool dropdown optgroup labels
    updateAIToolDropdown();
    
    document.documentElement.lang = currentLanguage;
}

function updateAIToolDropdown() {
    const select = document.getElementById('aiTool');
    const selectedValue = select.value;
    const lang = translations[currentLanguage];
    
    const approvedLabel = currentLanguage === 'de' ? '✅ Freigegebene Tools' : '✅ Approved Tools';
    const requiresApprovalLabel = currentLanguage === 'de' ? '⚠️ Benötigt IT-Genehmigung' : '⚠️ Requires IT Approval';
    
    select.innerHTML = `
        <option value="" data-i18n="option.pleaseSelect">${lang['option.pleaseSelect']}</option>
        <optgroup label="${approvedLabel}">
            <option value="m365_copilot" data-i18n="option.m365Copilot">${lang['option.m365Copilot']}</option>
            <option value="ai_builder" data-i18n="option.aiBuilder">${lang['option.aiBuilder']}</option>
        </optgroup>
        <optgroup label="${requiresApprovalLabel}">
            <option value="chatgpt" data-i18n="option.chatgpt">${lang['option.chatgpt']}</option>
            <option value="gpt4" data-i18n="option.gpt4">${lang['option.gpt4']}</option>
            <option value="claude" data-i18n="option.claude">${lang['option.claude']}</option>
            <option value="gemini" data-i18n="option.gemini">${lang['option.gemini']}</option>
            <option value="github_copilot" data-i18n="option.githubCopilot">${lang['option.githubCopilot']}</option>
            <option value="azure_openai" data-i18n="option.azureOpenai">${lang['option.azureOpenai']}</option>
            <option value="aws_bedrock" data-i18n="option.awsBedrock">${lang['option.awsBedrock']}</option>
            <option value="huggingface" data-i18n="option.huggingface">${lang['option.huggingface']}</option>
            <option value="midjourney" data-i18n="option.midjourney">${lang['option.midjourney']}</option>
            <option value="jasper" data-i18n="option.jasper">${lang['option.jasper']}</option>
            <option value="notion_ai" data-i18n="option.notionAi">${lang['option.notionAi']}</option>
            <option value="perplexity" data-i18n="option.perplexity">${lang['option.perplexity']}</option>
            <option value="other" data-i18n="option.otherAI">${lang['option.otherAI']}</option>
        </optgroup>
    `;
    
    // Restore the selected value if it existed
    if (selectedValue) {
        select.value = selectedValue;
    }
}

function showTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Activate the corresponding tab button
    const tabButton = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }
    
    // Smooth scroll to the section with proper offset to keep tabs visible
    const section = document.getElementById(tabName);
    if (section) {
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add smooth scrolling for sticky nav links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sticky-nav-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Show the tab first
            showTab(targetId);
        });
    });
});

function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    if (select.multiple) {
        return Array.from(select.selectedOptions).map(option => option.value).filter(value => value !== '');
    } else {
        return select.value;
    }
}

function getCombinedDataScore(dataTypes) {
    if (!Array.isArray(dataTypes) || dataTypes.length === 0) return 0;
    return Math.max(...dataTypes.map(type => DATA_SCORES[type] || 0));
}

function getSelectedLabels(selectId) {
    const select = document.getElementById(selectId);
    if (select.multiple) {
        return Array.from(select.selectedOptions).map(option => option.text).filter(text => !text.includes('...'));
    } else {
        const selectedOption = select.options[select.selectedIndex];
        return selectedOption ? selectedOption.text : '';
    }
}

function calculateRisk() {
    const projectType = getSelectedValues('projectType');
    const aiTool = getSelectedValues('aiTool');
    const aiUseCases = getSelectedValues('aiUseCase');
    const dataTypes = getSelectedValues('dataType');
    const autonomy = getSelectedValues('autonomy');
    const impact = getSelectedValues('impact');
    const transparency = getSelectedValues('transparency');
    
    if (!projectType || !aiTool || aiUseCases.length === 0 || dataTypes.length === 0 || !autonomy || !impact || !transparency) {
        return;
    }
    
    currentAssessment = performAssessment(projectType, aiTool, aiUseCases, dataTypes, autonomy, impact, transparency);
    updateResults(currentAssessment);
    
    // Automatically navigate to results tab when form is complete
    setTimeout(() => {
        showTab('results');
        // Scroll to top of page for better user experience
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, AUTO_NAVIGATION_DELAY_MS);
}

function performAssessment(projectType, aiTool, aiUseCases, dataTypes, autonomy, impact, transparency) {
    let riskScore = 0;
    let measures = [];
    
    // Check if tool requires approval
    if (!APPROVED_AI_TOOLS.includes(aiTool)) {
        riskScore += 3;
        measures.push({
            title: currentLanguage === 'de' ? '🚨 IT-GENEHMIGUNG ERFORDERLICH' : '🚨 IT APPROVAL REQUIRED',
            description: currentLanguage === 'de' 
                ? 'Dieses KI-System ist nicht freigegeben! Gemäß P3 AI Policy muss dieses Tool vor dem Einsatz durch die IT-Abteilung geprüft und genehmigt werden. Bitte kontaktieren Sie das IT-Team für eine Bewertung.'
                : 'This AI system is not approved! According to P3 AI Policy, this tool must be reviewed and approved by the IT department before deployment. Please contact the IT team for an assessment.'
        });
    }
    
    riskScore += AUTONOMY_SCORES[autonomy] || 0;
    
    const maxDataScore = getCombinedDataScore(dataTypes);
    riskScore += maxDataScore;
    
    riskScore += IMPACT_SCORES[impact] || 0;
    
    if (transparency === 'low') riskScore += 2;
    else if (transparency === 'medium') riskScore += 1;
    
    let riskLevel = 'minimal';
    if (!APPROVED_AI_TOOLS.includes(aiTool) || riskScore >= 13) riskLevel = 'critical';
    else if (riskScore >= 10) riskLevel = 'high';
    else if (riskScore >= 7) riskLevel = 'medium';
    else if (riskScore >= 4) riskLevel = 'low';
    
    measures = generateMeasures(riskLevel, aiTool, autonomy, dataTypes, impact, transparency, aiUseCases, measures);
    
    return {
        riskLevel,
        riskScore,
        projectType,
        aiTool,
        aiUseCases,
        dataTypes,
        autonomy,
        impact,
        transparency,
        measures
    };
}

function generateMeasures(riskLevel, aiTool, autonomy, dataTypes, impact, transparency, aiUseCases, measures) {
    const isGerman = currentLanguage === 'de';
    
    if (APPROVED_AI_TOOLS.includes(aiTool)) {
        measures.push({
            title: isGerman ? '✅ P3-freigegebenes Tool' : '✅ P3-approved Tool',
            description: isGerman 
                ? 'Dieses KI-System ist gemäß P3 AI Policy freigegeben und kann nach Beachtung der Sicherheits- und Compliance-Richtlinien eingesetzt werden.'
                : 'This AI system is approved according to P3 AI Policy and can be deployed following security and compliance guidelines.'
        });
    }
    
    if (riskLevel === 'critical') {
        measures.push({
            title: isGerman ? 'Hochrisiko-System gemäß EU AI Act' : 'High-risk System under EU AI Act',
            description: isGerman 
                ? 'Umfassende Konformitätsbewertung erforderlich. Dokumentation aller technischen Spezifikationen, Risikomanagement und Qualitätssicherung.'
                : 'Comprehensive conformity assessment required. Documentation of all technical specifications, risk management and quality assurance.'
        });
        measures.push({
            title: isGerman ? 'Executive Approval' : 'Executive Approval',
            description: isGerman 
                ? 'Projekt erfordert Freigabe durch P3 Management und ggf. Client C-Level vor Deployment.'
                : 'Project requires approval from P3 Management and possibly client C-Level before deployment.'
        });
    }
    
    if (riskLevel === 'high' || riskLevel === 'critical') {
        measures.push({
            title: 'Human Oversight',
            description: isGerman 
                ? 'Implementierung eines robusten Human-in-the-Loop Systems. Kritische KI-Entscheidungen müssen von qualifizierten Consultants validiert werden.'
                : 'Implementation of a robust Human-in-the-Loop system. Critical AI decisions must be validated by qualified consultants.'
        });
        measures.push({
            title: 'Bias & Fairness Testing',
            description: isGerman 
                ? 'Systematische Überprüfung auf Verzerrungen und Diskriminierung. Besonders wichtig bei Entscheidungen mit personellem Impact.'
                : 'Systematic review for bias and discrimination. Especially important for decisions with personnel impact.'
        });
    }
    
    if (dataTypes.includes('personal_data') || dataTypes.includes('special_categories')) {
        measures.push({
            title: isGerman ? 'DSGVO Compliance' : 'GDPR Compliance',
            description: isGerman 
                ? 'Data Protection Impact Assessment (DPIA) durchführen. Rechtsgrundlage prüfen, Betroffenenrechte sicherstellen.'
                : 'Conduct Data Protection Impact Assessment (DPIA). Review legal basis, ensure data subject rights.'
        });
        measures.push({
            title: isGerman ? 'Data Minimization' : 'Data Minimization',
            description: isGerman 
                ? 'Nur absolut notwendige Daten verarbeiten. Anonymisierung/Pseudonymisierung wo möglich implementieren.'
                : 'Process only absolutely necessary data. Implement anonymization/pseudonymization where possible.'
        });
    }
    
    if (dataTypes.includes('client_confidential') || dataTypes.includes('strategic_sensitive')) {
        measures.push({
            title: isGerman ? 'Vertraulichkeit & IP-Schutz' : 'Confidentiality & IP Protection',
            description: isGerman 
                ? 'NDA-Compliance sicherstellen. Bei externen KI-Services: On-Premise oder Private-Cloud Lösung bevorzugen. Data Residency Requirements prüfen.'
                : 'Ensure NDA compliance. For external AI services: prefer on-premise or private cloud solutions. Review data residency requirements.'
        });
    }
    
    if (transparency === 'low') {
        measures.push({
            title: 'Explainability Enhancement',
            description: isGerman 
                ? 'Explainable AI Techniken implementieren (LIME, SHAP). Dokumentation der Modell-Logik für Client Transparency.'
                : 'Implement Explainable AI techniques (LIME, SHAP). Document model logic for client transparency.'
        });
    }
    
    if (autonomy === 'automated' || autonomy === 'critical_automated') {
        measures.push({
            title: 'Monitoring & Audit Trail',
            description: isGerman 
                ? 'Continuous Monitoring der KI-Entscheidungen. Vollständige Logging-Infrastruktur für Audits und Fehleranalyse.'
                : 'Continuous monitoring of AI decisions. Complete logging infrastructure for audits and error analysis.'
        });
    }
    
    if (aiUseCases.includes('risk_assessment')) {
        measures.push({
            title: isGerman ? 'Validierung & Backtesting' : 'Validation & Backtesting',
            description: isGerman 
                ? 'Regelmäßige Validierung der Risk-Assessment-Modelle gegen Real-World Outcomes. Confidence Intervals transparent kommunizieren.'
                : 'Regular validation of risk assessment models against real-world outcomes. Communicate confidence intervals transparently.'
        });
    }
    
    if (aiUseCases.includes('code_generation')) {
        measures.push({
            title: 'Security Review',
            description: isGerman 
                ? 'Code-Reviews für KI-generierten Code verpflichtend. Security Scanning und Vulnerability Assessment integrieren.'
                : 'Mandatory code reviews for AI-generated code. Integrate security scanning and vulnerability assessment.'
        });
    }
    
    measures.push({
        title: isGerman ? 'Dokumentation & Governance' : 'Documentation & Governance',
        description: isGerman 
            ? 'AI Model Card erstellen: Zweck, Limitationen, Training Data, Performance Metrics. Version Control für Model Updates.'
            : 'Create AI Model Card: purpose, limitations, training data, performance metrics. Version control for model updates.'
    });
    
    measures.push({
        title: 'Stakeholder Communication',
        description: isGerman 
            ? 'Transparente Kommunikation über KI-Einsatz gegenüber Kunden und betroffenen Personen. Klare Verantwortlichkeiten definieren.'
            : 'Transparent communication about AI deployment to clients and affected persons. Define clear responsibilities.'
    });
    
    return measures;
}

function updateResults(assessment) {
    const lang = translations[currentLanguage];
    const riskClass = `risk-${assessment.riskLevel}`;
    const riskLabel = lang[`risk.${assessment.riskLevel}`];
    
    // Generate risk level explanation
    const riskExplanations = {
        'minimal': currentLanguage === 'de' 
            ? 'Das KI-System stellt nur ein minimales Risiko dar. Es können Standardsicherheitsmaßnahmen angewendet werden.'
            : 'The AI system poses only minimal risk. Standard security measures can be applied.',
        'low': currentLanguage === 'de'
            ? 'Das KI-System hat ein geringes Risiko. Grundlegende Überwachung und Dokumentation sind erforderlich.'
            : 'The AI system has low risk. Basic monitoring and documentation are required.',
        'medium': currentLanguage === 'de'
            ? 'Das KI-System hat ein mittleres Risiko. Erweiterte Kontrollen und regelmäßige Überprüfungen sind notwendig.'
            : 'The AI system has medium risk. Enhanced controls and regular reviews are necessary.',
        'high': currentLanguage === 'de'
            ? 'Das KI-System hat ein hohes Risiko. Umfassende Risikomanagement-Maßnahmen und kontinuierliche Überwachung sind erforderlich.'
            : 'The AI system has high risk. Comprehensive risk management measures and continuous monitoring are required.',
        'critical': currentLanguage === 'de'
            ? 'Das KI-System hat ein kritisches Risiko. Vollständige Compliance-Bewertung, Management-Genehmigung und strenge Kontrollen sind zwingend erforderlich.'
            : 'The AI system has critical risk. Full compliance assessment, management approval, and strict controls are mandatory.'
    };
    
    const autonomyScore = AUTONOMY_SCORES[assessment.autonomy] || 0;
    const dataScore = getCombinedDataScore(assessment.dataTypes);
    const impactScore = IMPACT_SCORES[assessment.impact] || 0;
    const transparencyScore = assessment.transparency === 'low' ? 2 : (assessment.transparency === 'medium' ? 1 : 0);
    const toolApprovalScore = APPROVED_AI_TOOLS.includes(assessment.aiTool) ? 0 : 3;
    
    // Generate compliance requirements
    let complianceReqs = [];
    if (assessment.dataTypes.includes('personal_data') || assessment.dataTypes.includes('special_categories')) {
        complianceReqs.push(currentLanguage === 'de' ? 'DSGVO/GDPR Compliance' : 'GDPR Compliance');
    }
    if (assessment.riskLevel === 'critical' || assessment.riskLevel === 'high') {
        complianceReqs.push(currentLanguage === 'de' ? 'EU AI Act - Hochrisiko-System' : 'EU AI Act - High-Risk System');
    }
    if (!APPROVED_AI_TOOLS.includes(assessment.aiTool)) {
        complianceReqs.push(currentLanguage === 'de' ? 'P3 IT-Genehmigung erforderlich' : 'P3 IT Approval Required');
    }
    if (assessment.dataTypes.includes('client_confidential') || assessment.dataTypes.includes('strategic_sensitive')) {
        complianceReqs.push('NDA Compliance');
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-card scroll-reveal-scale">
            <div class="result-header">
                <div class="result-title">${lang['result.riskAssessment']}</div>
                <span class="risk-badge ${riskClass}">${riskLabel}</span>
            </div>
            <p style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; line-height: 1.6;">
                ${riskExplanations[assessment.riskLevel]}
            </p>
            <p style="margin-top: 15px;"><strong>${lang['result.riskScore']}:</strong> ${assessment.riskScore}/${MAX_RISK_SCORE}</p>
            <p><strong>${lang['result.projectType']}:</strong> ${getSelectedLabels('projectType')}</p>
            <p><strong>${lang['result.recommendedMeasures']}:</strong> ${assessment.measures.length}</p>
        </div>
        
        <div class="result-card scroll-reveal">
            <div class="result-title">${currentLanguage === 'de' ? 'Risikoanalyse nach Kategorien' : 'Risk Breakdown by Category'}</div>
            <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px;">
                    <span><strong>${currentLanguage === 'de' ? 'Autonomiegrad' : 'Autonomy Level'}:</strong></span>
                    <span>${autonomyScore}/5 ${currentLanguage === 'de' ? 'Punkte' : 'points'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px;">
                    <span><strong>${currentLanguage === 'de' ? 'Datensensibilität' : 'Data Sensitivity'}:</strong></span>
                    <span>${dataScore}/5 ${currentLanguage === 'de' ? 'Punkte' : 'points'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px;">
                    <span><strong>${currentLanguage === 'de' ? 'Auswirkungsbereich' : 'Impact Scope'}:</strong></span>
                    <span>${impactScore}/5 ${currentLanguage === 'de' ? 'Punkte' : 'points'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px;">
                    <span><strong>${currentLanguage === 'de' ? 'Transparenzmangel' : 'Transparency Gap'}:</strong></span>
                    <span>${transparencyScore}/2 ${currentLanguage === 'de' ? 'Punkte' : 'points'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px;">
                    <span><strong>${currentLanguage === 'de' ? 'Tool-Genehmigungsstatus' : 'Tool Approval Status'}:</strong></span>
                    <span>${toolApprovalScore}/3 ${currentLanguage === 'de' ? 'Punkte' : 'points'}</span>
                </div>
            </div>
        </div>
        
        <div class="result-card scroll-reveal-left">
            <div class="result-title">${currentLanguage === 'de' ? 'Datensensibilitäts-Analyse' : 'Data Sensitivity Analysis'}</div>
            <p style="margin-top: 10px;"><strong>${currentLanguage === 'de' ? 'Verarbeitete Datentypen' : 'Processed Data Types'}:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                ${getSelectedLabels('dataType').map(label => `<li>${label}</li>`).join('')}
            </ul>
            ${assessment.dataTypes.includes('personal_data') || assessment.dataTypes.includes('special_categories') ? `
                <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-left: 4px solid #856404; border-radius: 4px;">
                    <strong>⚠️ ${currentLanguage === 'de' ? 'Personenbezogene Daten' : 'Personal Data'}:</strong>
                    ${currentLanguage === 'de' 
                        ? 'DSGVO-Compliance ist erforderlich. Data Protection Impact Assessment (DPIA) muss durchgeführt werden.'
                        : 'GDPR compliance is required. Data Protection Impact Assessment (DPIA) must be conducted.'}
                </div>
            ` : ''}
            ${assessment.dataTypes.includes('client_confidential') || assessment.dataTypes.includes('strategic_sensitive') ? `
                <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-left: 4px solid #856404; border-radius: 4px;">
                    <strong>⚠️ ${currentLanguage === 'de' ? 'Vertrauliche Daten' : 'Confidential Data'}:</strong>
                    ${currentLanguage === 'de'
                        ? 'Besondere Vertraulichkeitsmaßnahmen und NDA-Compliance erforderlich.'
                        : 'Special confidentiality measures and NDA compliance required.'}
                </div>
            ` : ''}
        </div>
        
        <div class="result-card scroll-reveal-right">
            <div class="result-title">${currentLanguage === 'de' ? 'Compliance-Anforderungen' : 'Compliance Requirements'}</div>
            ${complianceReqs.length > 0 ? `
                <ul style="margin: 15px 0; padding-left: 20px;">
                    ${complianceReqs.map(req => `<li style="margin-bottom: 8px;">${req}</li>`).join('')}
                </ul>
            ` : `
                <p style="margin-top: 10px; color: #28a745;">
                    ✅ ${currentLanguage === 'de' 
                        ? 'Standard-Compliance-Anforderungen gelten.'
                        : 'Standard compliance requirements apply.'}
                </p>
            `}
        </div>
        
        <div class="result-card scroll-reveal-scale">
            <div class="result-title">${lang['result.assessmentDetails']}</div>
            <p><strong>${lang['result.aiTool']}:</strong> ${getSelectedLabels('aiTool')}</p>
            <p><strong>${lang['result.aiUseCase']}:</strong> ${getSelectedLabels('aiUseCase').join(', ')}</p>
            <p><strong>${lang['result.dataType']}:</strong> ${getSelectedLabels('dataType').join(', ')}</p>
            <p><strong>${lang['result.autonomy']}:</strong> ${getSelectedLabels('autonomy')}</p>
            <p><strong>${lang['result.impact']}:</strong> ${getSelectedLabels('impact')}</p>
            <p><strong>${lang['result.transparency']}:</strong> ${getSelectedLabels('transparency')}</p>
        </div>
    `;
    
    let measuresHTML = `<h3 class="section-title scroll-reveal">${lang['measures.title']}</h3>`;
    const animationClasses = ['scroll-reveal-left', 'scroll-reveal-right'];
    assessment.measures.forEach((measure, index) => {
        const revealClass = animationClasses[index % 2];
        measuresHTML += `
            <div class="measure-item ${revealClass}">
                <div class="measure-title">${index + 1}. ${measure.title}</div>
                <div>${measure.description}</div>
            </div>
        `;
    });
    
    document.getElementById('measuresContent').innerHTML = measuresHTML;
    
    // Re-setup scroll reveal for dynamically added elements
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setupScrollReveal();
        });
    });
}

function downloadPDF() {
    if (!currentAssessment) {
        alert(currentLanguage === 'de' 
            ? 'Bitte führen Sie zunächst das Assessment durch.' 
            : 'Please complete the assessment first.');
        return;
    }
    
    const aiUseCasesLabel = getSelectedLabels('aiUseCase').join(' | ');
    const dataTypesLabel = getSelectedLabels('dataType').join(' | ');
    const lang = translations[currentLanguage];
    
    const rows = [
        currentLanguage === 'de' ? 'Kategorie;Wert' : 'Category;Value',
        `${currentLanguage === 'de' ? 'Risikostufe' : 'Risk Level'};${lang[`risk.${currentAssessment.riskLevel}`]}`,
        `Risk Score;${currentAssessment.riskScore}/${MAX_RISK_SCORE}`,
        `${lang['result.projectType']};${getSelectedLabels('projectType')}`,
        `${lang['result.aiTool']};${getSelectedLabels('aiTool')}`,
        `${lang['result.aiUseCase']};"${aiUseCasesLabel.replace(/"/g, '""')}"`,
        `${lang['result.dataType']};"${dataTypesLabel.replace(/"/g, '""')}"`,
        `${lang['result.autonomy']};${getSelectedLabels('autonomy')}`,
        `${lang['result.impact']};${getSelectedLabels('impact')}`,
        `${lang['result.transparency']};${getSelectedLabels('transparency')}`,
        '',
        lang['measures.title']
    ];
    
    currentAssessment.measures.forEach((measure, index) => {
        rows.push(`${index + 1}. ${measure.title};"${measure.description.replace(/"/g, '""')}"`);
    });
    
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `P3_AI_Risk_Assessment_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function resetForm() {
    document.querySelectorAll('select').forEach(select => {
        if (select.multiple) {
            Array.from(select.options).forEach(option => option.selected = false);
        } else {
            select.value = '';
        }
    });
    
    currentAssessment = null;
    const lang = translations[currentLanguage];
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <p>${lang['empty.results']}</p>
        </div>
    `;
    
    document.getElementById('measuresContent').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">✅</div>
            <p>${lang['empty.measures']}</p>
        </div>
    `;
    
    showTab('assessment');
}

// Initialize language and theme on page load
window.onload = function() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    updateLanguage();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeButtons();
    }
    
    // Initialize scroll effects
    initScrollEffects();
    setupScrollReveal();
};

function updateThemeButtons() {
    const themeBtns = [document.getElementById('themeBtn'), document.getElementById('themeBtn2')];
    themeBtns.forEach(btn => {
        if (btn) {
            if (currentTheme === 'dark') {
                btn.textContent = btn === themeBtns[0] ? '☀️' : '☀️ Light Mode';
            } else {
                btn.textContent = btn === themeBtns[0] ? '🌙' : '🌙 Dark Mode';
            }
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll to Assessment section and activate tab
function scrollToAssessment(event) {
    if (event) {
        event.preventDefault();
    }
    
    // First, switch to the assessment tab
    showTab('assessment');
    
    // Then scroll to the assessment section with proper offset
    const assessmentSection = document.getElementById('assessment');
    if (assessmentSection) {
        const elementPosition = assessmentSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll effects
function initScrollEffects() {
    const stickyHeader = document.getElementById('stickyHeader');
    const scrollProgress = document.getElementById('scrollProgress');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScroll / windowHeight) * 100;
        
        // Update scroll progress bar
        scrollProgress.style.width = progress + '%';
        
        // Hide/show sticky header based on scroll direction
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                // Scrolling down
                stickyHeader.classList.add('hidden');
            } else {
                // Scrolling up
                stickyHeader.classList.remove('hidden');
            }
        } else {
            // At top of page
            stickyHeader.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
}

// Setup scroll reveal animations
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// Intersection Observer for scroll animations (legacy support)
function observeElements() {
    setupScrollReveal();
}
