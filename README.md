# P3 AI Risk Assessment Platform

A modern, enterprise-grade web application for evaluating AI usage in compliance with EU AI Act and GDPR requirements. Built with the P3 Group corporate design system.

![P3 Group](https://img.shields.io/badge/P3_Group-Enterprise-6544FE)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)

## 🎯 Overview

The P3 AI Risk Assessment Platform helps organizations systematically evaluate AI system usage across projects, ensuring compliance with regulatory frameworks and identifying potential risks before deployment.

### Key Features

- **Guided Assessment Wizard** - Step-by-step evaluation of AI systems
- **Risk Scoring Engine** - Automated risk calculation based on multiple factors
- **Actionable Recommendations** - Tailored measures based on assessment results
- **Multi-language Support** - English and German interfaces
- **Dark/Light Mode** - Accessible theming options
- **Enterprise Authentication** - Azure AD / Entra ID integration
- **Data Persistence** - Supabase backend with Row Level Security
- **Admin Dashboard** - Configuration management for administrators

## 🎨 P3 Corporate Design

The application strictly adheres to the P3 Group brand guidelines with the following color palette:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Flying Salmon | `#FF7F6A` | Highlights, warnings, accents |
| Electric Blue | `#0000FF` | Buttons, interactive elements |
| Lemon Splash | `#DBFF55` | Accent highlights, progress indicators |
| Green Day Vibe | `#005B4C` | Success states, confirmations |
| Midnight Blue | `#00002D` | Primary surfaces, text |
| Purple Rain | `#6544FE` | Primary actions, focus states |

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── assessments/       # Assessment CRUD
│   └── admin/             # Admin configuration
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── assessment/        # Assessment-specific components
├── lib/
│   ├── auth/              # Azure AD authentication
│   ├── supabase/          # Database client & queries
│   └── utils/             # Utility functions
├── store/                 # Zustand state management
├── config/                # Configuration & translations
├── styles/                # Global CSS & Tailwind
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Azure AD / Entra ID tenant

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NikolajUnserRichter/aiassesmentp3.git
   cd aiassesmentp3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials (see [Configuration](#configuration))

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_AZURE_AD_CLIENT_ID` | Azure AD application ID | Yes |
| `NEXT_PUBLIC_AZURE_AD_TENANT_ID` | Azure AD tenant ID | Yes |
| `NEXT_PUBLIC_AZURE_AD_REDIRECT_URI` | OAuth redirect URI | Yes |

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to SQL Editor
3. Execute the schema from `supabase/schema.sql`
4. Copy your project URL and API keys from Settings > API

### Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) > Azure Active Directory
2. Navigate to App registrations > New registration
3. Configure:
   - **Name**: P3 AI Assessment
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: `http://localhost:3000` (Web)
4. After creation, note the:
   - Application (client) ID
   - Directory (tenant) ID
5. Add redirect URIs for production under Authentication
6. Configure API permissions:
   - Microsoft Graph > User.Read
   - Microsoft Graph > openid
   - Microsoft Graph > profile
   - Microsoft Graph > email

## 🔐 Authentication Flow

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│   User      │────▶│   Azure AD    │────▶│  Application │
└─────────────┘     └───────────────┘     └──────────────┘
                           │                      │
                           │  OAuth 2.0 / OIDC    │
                           │                      │
                    ┌──────▼──────┐        ┌──────▼──────┐
                    │   Token     │        │  Supabase   │
                    │  Validation │        │   User Sync │
                    └─────────────┘        └─────────────┘
```

1. User clicks "Sign in with Microsoft"
2. MSAL redirects to Azure AD login
3. User authenticates with corporate credentials
4. Azure AD returns tokens to application
5. Application syncs user to Supabase
6. User session is established

## 📊 Risk Assessment Logic

### Scoring Components

| Component | Max Score | Factors |
|-----------|-----------|---------|
| Autonomy | 5 | Level of AI independence |
| Impact | 5 | Scope of AI influence |
| Data Sensitivity | 5 | Type of data processed |
| Transparency | 2 | Explainability of AI |
| Tool Approval | 3 | IT approval status |

### Risk Levels

| Score Range | Level | Description |
|-------------|-------|-------------|
| 0-3 | Minimal | Standard operational use |
| 4-7 | Low | Basic documentation required |
| 8-12 | Medium | Documented controls needed |
| 13-16 | High | Comprehensive safeguards |
| 17-20 | Critical | Executive approval required |

## 📁 Data Model

### Users
```typescript
{
  id: UUID,
  azure_id: string,
  email: string,
  name: string,
  role: 'user' | 'admin',
  created_at: timestamp,
  updated_at: timestamp
}
```

### Assessments
```typescript
{
  id: UUID,
  user_id: UUID,
  project_type: string,
  ai_tool: string,
  ai_use_cases: string[],
  data_types: string[],
  autonomy_level: string,
  impact_scope: string,
  transparency_level: string,
  risk_score: number,
  risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical',
  measures: string[],
  status: 'draft' | 'completed' | 'archived',
  created_at: timestamp,
  updated_at: timestamp,
  completed_at: timestamp
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── ui/          # Design system components
│   │   ├── layout/      # Layout components
│   │   └── assessment/  # Feature components
│   ├── lib/             # Libraries and utilities
│   │   ├── auth/        # Authentication
│   │   ├── supabase/    # Database
│   │   └── utils/       # Helpers
│   ├── store/           # State management
│   ├── config/          # Configuration
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── public/              # Static assets
├── supabase/            # Database schema
└── package.json
```

## 🔒 Security Considerations

- **Authentication**: Azure AD with MFA support
- **Authorization**: Role-based access control (user/admin)
- **Data Protection**: Row Level Security in Supabase
- **Token Handling**: Secure session management via MSAL
- **Input Validation**: Server and client-side validation
- **HTTPS**: Required for production deployment

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps
- Self-hosted Node.js server

## 📝 License

This project is proprietary software owned by P3 Group.

## 🤝 Contributing

For internal P3 Group development:

1. Create a feature branch from `main`
2. Make your changes following the code style
3. Submit a pull request for review
4. Ensure all tests pass

## 📞 Support

For questions or issues:
- Create a GitHub issue
- Contact the P3 Digital Innovation team

---

Built with ❤️ by P3 Group Digital Innovation Team
