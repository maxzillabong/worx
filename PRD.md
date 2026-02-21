# Worx - Product Requirements Document

**Version:** 0.1.0  
**Last Updated:** 2026-02-21  
**Status:** MVP - Testing Claude Code 4.6 Autonomous Development

---

## Overview

Worx is an AI-powered blood analysis platform designed to demonstrate production-grade architecture and test Claude Code 4.6's autonomous development capabilities. The platform provides intelligent insights from bloodwork results using advanced AI models.

## Target Audience

**Primary:** Software engineers, technical founders, and AI developers evaluating autonomous coding tools

**Secondary:** Healthcare tech enthusiasts interested in AI-powered diagnostics (demo purposes only)

## Core Value Proposition

1. **For Developers:** Real-world test case demonstrating Claude Code 4.6's complete autonomous pipeline (write → review → security → merge)
2. **For Users:** Instant, AI-powered insights from bloodwork results with beautiful visualizations

---

## Features

### ✅ Phase 1: Foundation (COMPLETE)

**Landing Page**
- Marketing hero with "100% AI Generated" badge
- Feature highlights (Real-time analysis, Trend tracking, Security)
- Dark purple/pink gradient theme
- Responsive design
- Call-to-action buttons

**Dashboard**
- Patient information display
- Bloodwork results visualization
- Metric cards with status indicators (normal/low/high/critical)
- Visual range bars showing position within reference ranges
- Category grouping (Complete Blood Count, Metabolic Panel, Lipid Panel)
- Summary statistics (normal, abnormal, critical counts)
- Smooth animations with Framer Motion

**Architecture**
- Next.js 16 with App Router
- TypeScript strict mode
- Zod validation schemas
- Zustand state management
- Security headers (HSTS, CSP, X-Frame-Options)
- Centralized error handling

**Testing**
- Vitest test suite (66 tests)
- 100% passing
- Coverage: utils, validation, store, error handling

### 🚧 Phase 2: AI Insights (IN PROGRESS - Claude Code 4.6 Test)

**AI Analysis Feature** (To be built autonomously by Claude Code)

**Requirements:**
1. **API Endpoint:** `POST /api/analyze`
   - Accept bloodwork ID
   - Call AI model (Claude/GPT) for analysis
   - Return structured insights

2. **Insight Types:**
   - **Warnings:** Critical or abnormal values requiring attention
   - **Recommendations:** Lifestyle/dietary suggestions
   - **Trends:** Pattern detection across metrics
   - **Correlations:** Related metric analysis (e.g., glucose + cholesterol)

3. **Insight Schema:**
   ```typescript
   {
     type: 'warning' | 'recommendation' | 'trend' | 'correlation',
     severity: 'info' | 'low' | 'medium' | 'high',
     title: string,
     description: string,
     affectedMetrics: string[],
   }
   ```

4. **UI Component:**
   - Display insights in categorized list
   - Color-coded severity indicators
   - Expandable details
   - Loading states
   - Error handling

5. **State Management:**
   - Store insights in Zustand
   - Associate with bloodwork ID
   - Persist locally

**Acceptance Criteria:**
- [ ] API endpoint validates input with Zod
- [ ] AI model integration working (Claude/OpenAI)
- [ ] Structured insights returned
- [ ] UI component displays insights
- [ ] Loading and error states handled
- [ ] Tests written for new code
- [ ] TypeScript strict mode passes
- [ ] Security audit clean
- [ ] Auto-merge successful

### 📋 Phase 3: Production Features (PLANNED)

**Database Integration**
- PostgreSQL + Prisma ORM
- User authentication (NextAuth)
- Multiple patients per user
- Historical bloodwork storage

**Trend Analysis**
- Chart visualizations (Recharts)
- Historical comparisons
- Metric trends over time
- Alert thresholds

**PDF Reports**
- Downloadable bloodwork reports
- AI insights included
- Professional formatting

**Email Notifications**
- Critical value alerts
- Weekly summaries
- Insight digests

---

## Technical Specifications

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5.x |
| Validation | Zod | 4.3.6 |
| State | Zustand | 5.0.11 |
| Styling | Tailwind CSS | 4.x |
| UI Components | Shadcn UI | 3.8.5 |
| Animation | Framer Motion | 12.34.3 |
| Testing | Vitest | 4.0.18 |
| Charts | Recharts | 2.15.4 |

### Data Models

**Patient**
```typescript
{
  id: uuid,
  firstName: string,
  lastName: string,
  dateOfBirth: date,
  sex: 'male' | 'female' | 'other',
  email?: string,
  phone?: string,
}
```

**BloodworkResult**
```typescript
{
  id: uuid,
  patientId: uuid,
  testDate: datetime,
  metrics: BloodworkMetric[],
  labName?: string,
  orderedBy?: string,
}
```

**BloodworkMetric**
```typescript
{
  name: string,
  value: number,
  unit: string,
  status: 'normal' | 'low' | 'high' | 'critical',
  referenceRange: { min: number, max: number },
  category: string,
}
```

**AIInsight**
```typescript
{
  id: uuid,
  bloodworkId: uuid,
  generatedAt: datetime,
  insights: Array<{
    type: 'warning' | 'recommendation' | 'trend' | 'correlation',
    severity: 'info' | 'low' | 'medium' | 'high',
    title: string,
    description: string,
    affectedMetrics: string[],
  }>,
  summary: string,
  model: string,
}
```

### API Endpoints

**Current:**
- `GET /` - Landing page
- `GET /dashboard` - Patient dashboard
- `GET /how-it-was-made` - About page

**To be implemented (Phase 2):**
- `POST /api/analyze` - Generate AI insights
- `GET /api/analyze?bloodworkId=<uuid>` - Retrieve insights

**Planned (Phase 3):**
- `POST /api/bloodwork` - Upload new results
- `GET /api/bloodwork/:id` - Get specific result
- `GET /api/patients/:id/bloodwork` - Patient history
- `GET /api/reports/:id/pdf` - Generate PDF report

---

## Security Requirements

1. **Input Validation**
   - All API inputs validated with Zod
   - Reject malformed UUIDs, dates, numbers
   - Sanitize text inputs

2. **Headers**
   - HSTS enabled
   - CSP configured
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin

3. **Secrets Management**
   - No API keys in client bundles
   - Environment variables for sensitive data
   - `.env.example` for documentation

4. **Error Handling**
   - Production: Hide stack traces and details
   - Development: Show full error context
   - Centralized error responses

---

## Success Metrics (Blog Post)

**Claude Code 4.6 Test Metrics:**
1. **Token Efficiency:** Actual tokens vs estimated human tokens
2. **Time to Completion:** Autonomous build time vs human estimate
3. **Manual Interventions:** Number of times human had to correct/guide
4. **Auto-Merge Success:** Did CI/CD auto-merge without intervention?
5. **Security Findings:** Vulnerabilities caught by automated scanner
6. **Code Quality:** Test coverage, type safety, architecture adherence
7. **Feature Completeness:** % of requirements implemented correctly

**Target Results:**
- < 5% manual intervention rate
- Auto-merge success on first attempt
- Zero critical security findings
- 80%+ test coverage on new code
- All TypeScript strict mode rules passing

---

## Design Guidelines

### Colors

| Element | Color | Usage |
|---------|-------|-------|
| Background | Slate 950 | Main background gradient |
| Accent 1 | Purple 500 | Primary brand color |
| Accent 2 | Pink 500 | Secondary accent |
| Normal | Green 500 | Healthy metrics |
| Warning | Orange 500 | Out-of-range metrics |
| Critical | Red 500 | Critical values |
| Info | Blue 500 | Informational elements |

### Typography
- Font: System font stack (Geist Sans, fallback to system)
- Headings: Bold, larger sizes
- Body: Regular weight, readable sizes
- Code: Monospace (Geist Mono)

### Spacing
- Consistent 4px/8px grid system
- Generous whitespace for readability
- Card padding: 24px (p-6)
- Section spacing: 32px (mb-8)

---

## Out of Scope (v1)

- Multi-user authentication
- Real patient data storage
- HIPAA compliance
- Mobile app (responsive web only)
- Integration with lab systems
- Payment processing
- Doctor consultations
- Medical advice (disclaimer only)

---

## Legal Disclaimer

**This is a demonstration project. All data is fictitious.**

Worx is not intended for medical use. All bloodwork data, AI insights, and recommendations are for demonstration purposes only. Users should consult qualified healthcare professionals for medical advice.

---

## Appendix

### Mock Data

**Demo Patient:** John Doe, 34M, born 1990-01-15  
**Demo Lab:** LabCorp  
**Demo Metrics:** 8 tests across CBC, Metabolic, and Lipid panels

See `lib/validation.ts` for complete mock data structures.
