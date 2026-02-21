# Worx - AI-Powered Blood Analysis Platform

**Status:** 🚧 Active Development  
**Purpose:** Testing Claude Code 4.6 autonomous development capabilities  
**Live Demo:** [worx.maxzilla.nl](https://worx.maxzilla.nl)

---

## Overview

Worx is a production-grade demonstration of AI-assisted healthcare analytics. This project serves as a test case for Claude Code 4.6's autonomous development pipeline, showcasing:

- **Type-safe architecture** with TypeScript and Zod
- **Modern React patterns** with hooks and state management
- **Beautiful UI/UX** with Tailwind CSS and Framer Motion
- **Security-first** design with proper validation and headers
- **Production-ready** code structure and patterns

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Language** | TypeScript | Type safety and developer experience |
| **Validation** | Zod | Runtime type validation |
| **State** | Zustand | Global state management |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Shadcn UI | Customizable component library |
| **Animation** | Framer Motion | Smooth, performant animations |

### Project Structure

```
worx/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Dashboard pages
│   │   └── page.tsx        # Main dashboard
│   └── api/                 # API routes
│       └── analyze/         # AI analysis endpoint (stub)
│           └── route.ts
├── components/              # React components
│   ├── ui/                 # Shadcn UI base components
│   ├── metric-card.tsx     # Bloodwork metric display
│   └── ai-insights-panel.tsx  # AI insights (to be implemented)
├── lib/                     # Shared utilities
│   ├── validation.ts       # Zod schemas and types
│   ├── store.ts           # Zustand state management
│   ├── api-error.ts       # Error handling utilities
│   └── utils.ts           # Helper functions
├── public/                  # Static assets
├── CLAUDE.md               # Coding standards documentation
└── README.md               # This file
```

## Core Principles

### 1. Type Safety First

```typescript
// All data is validated with Zod schemas
export const BloodworkMetricSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
  unit: z.string().min(1),
  status: z.enum(['normal', 'low', 'high', 'critical']),
  // ...
});

// Types are inferred from schemas
export type BloodworkMetric = z.infer<typeof BloodworkMetricSchema>;
```

### 2. Single Source of Truth

- **State:** Zustand store (`lib/store.ts`)
- **Validation:** Zod schemas (`lib/validation.ts`)
- **Config:** Environment variables and `next.config.ts`
- **Errors:** Centralized error handling (`lib/api-error.ts`)

### 3. Validate at Boundaries

```typescript
// API routes validate all inputs
export async function POST(request: Request) {
  const body = await request.json();
  const data = AnalyzeBloodworkRequestSchema.parse(body); // Throws if invalid
  // ... process validated data
}
```

### 4. Security by Default

- HSTS headers
- CSP policies
- XSS protection
- Input sanitization via Zod
- No secrets in client bundles

## Features

### ✅ Implemented

- **Landing Page** - Marketing page with feature highlights
- **Dashboard** - Full bloodwork visualization with metrics
- **Metric Cards** - Individual test results with visual indicators
- **State Management** - Zustand store with persistence
- **Type Safety** - Full TypeScript coverage with Zod validation
- **Responsive Design** - Mobile-first layout
- **Animations** - Smooth transitions with Framer Motion
- **Mock Data** - Realistic patient and bloodwork data

### 🚧 In Progress (Claude Code 4.6 Test)

- **AI Insights** - Autonomous feature development
  - API endpoint implementation
  - AI model integration (Claude/GPT)
  - Real-time insight generation
  - Structured data parsing
  - UI component completion

### 📋 Planned

- Database integration (PostgreSQL + Prisma)
- User authentication
- Historical trend tracking
- PDF report generation
- Email notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/maxzillabong/worx.git
cd worx

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Add your API keys (when needed)
# ANTHROPIC_API_KEY=your_key_here
```

## Development Workflow

### Coding Standards

All code must follow the standards defined in [`CLAUDE.md`](./CLAUDE.md):

- No `any` types
- Explicit return types on exports
- Zod validation for all inputs
- Zustand for global state
- Centralized error handling
- Security headers enabled

### Testing Checklist

Before committing:

- [ ] TypeScript build passes: `npm run build`
- [ ] No type errors or warnings
- [ ] All API inputs validated with Zod
- [ ] Using Zustand store, not local state for global data
- [ ] Error responses use `createErrorResponse()`
- [ ] Security considerations documented

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t worx .

# Run container
docker run -p 3000:3000 worx
```

### Current Hosting

- **Platform:** Hetzner VPS
- **IP:** 188.245.46.71
- **Domain:** worx.maxzilla.nl
- **Reverse Proxy:** Caddy

## Blog Post

This project is featured in a blog post analyzing Claude Code 4.6's autonomous development capabilities:

**Title:** "I Tried to Replace Myself With Claude's Auto-Pipeline (Here's What It Actually Did)"

**Metrics tracked:**
- Token usage vs human estimate
- Time to completion
- Manual interventions required
- Auto-merge success rate
- Security vulnerabilities found
- Code quality assessment

## Contributing

This is a test project for Claude Code 4.6. The AI Insights feature will be developed autonomously to demonstrate the complete development pipeline:

1. **Write** - Claude Code generates feature implementation
2. **Review** - Auto code review with inline comments
3. **Security** - Automated vulnerability scanning
4. **Test** - CI/CD pipeline validation
5. **Merge** - Auto-merge when all checks pass

## License

MIT License - See [LICENSE](./LICENSE) for details

## Author

**Max van Anen**  
- Website: [maxzilla.nl](https://maxzilla.nl)
- GitHub: [@maxzillabong](https://github.com/maxzillabong)
- Twitter: [@maxzilla](https://twitter.com/maxzilla)

---

**Built with ❤️ and 🤖 AI assistance**
