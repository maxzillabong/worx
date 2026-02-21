# Claude Instructions - Worx Project

**Purpose:** Testing Claude Code 4.6 autonomous development pipeline  
**Context:** Production-grade blood analysis platform built to showcase AI-assisted development

---

## Essential Reading

Before doing anything, read these files in order:

1. **`PRD.md`** - Product requirements, features, specifications
2. **`rules.md`** - Coding standards and architecture rules
3. **`PROGRESS.md`** - Current status, completed tasks, next steps

## Current Mission

**Phase 2: AI Insights Feature** (Autonomous Development Test)

**STATUS: READY TO START**

Build the complete AI blood analysis feature autonomously. This tests your end-to-end pipeline from code generation to auto-merge.

### Your Autonomous Pipeline
1. **Write** - Implement feature per PRD.md specifications
2. **Review** - Auto code review with inline comments  
3. **Security** - Automated vulnerability scan
4. **Test** - Write comprehensive tests (target: 80%+ coverage)
5. **Merge** - Auto-merge when all checks pass

### What You Need to Build

**Backend (`app/api/analyze/route.ts`):**
- Replace stub with working `POST /api/analyze` endpoint
- Add AI model integration (recommend: Anthropic Claude Sonnet 4)
- Parse bloodwork metrics and generate structured insights
- Return validated AIInsight response
- Handle errors with existing error utilities

**Frontend (`components/ai-insights-panel.tsx`):**
- Remove "Coming Soon" placeholder
- Add "Generate Insights" button with onClick handler
- Implement loading states (use Zustand `isAnalyzing`)
- Display insights in categorized list
- Color-code by severity (info/low/medium/high)
- Show error states gracefully

**State Integration:**
- Use existing Zustand store (`lib/store.ts`)
- Store insights with `addInsight()`
- Retrieve with `getInsightsByBloodworkId()`

**Testing:**
- Write tests for API endpoint (validation, errors, response structure)
- Write tests for AI parsing logic
- Write tests for UI component (loading, error, display states)
- All existing tests must still pass (66/66)

### Environment Setup Needed
Add to `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

### Success Criteria
- All tests passing (target: 80+ total)
- TypeScript strict mode clean
- Build successful
- Feature works end-to-end
- Auto-merge completes

## Project Structure

```
worx/
├── PRD.md              ← Product requirements
├── rules.md            ← Coding standards
├── PROGRESS.md         ← Current status tracker
├── claude.md           ← This file
├── app/
│   ├── page.tsx        ← Landing page
│   ├── dashboard/      ← Main dashboard
│   └── api/
│       └── analyze/    ← AI endpoint (stub, needs implementation)
├── components/
│   ├── metric-card.tsx           ← Bloodwork display
│   └── ai-insights-panel.tsx     ← AI insights (empty state, needs completion)
├── lib/
│   ├── validation.ts   ← Zod schemas
│   ├── store.ts        ← Zustand state
│   ├── api-error.ts    ← Error handling
│   ├── utils.ts        ← Helper functions
│   └── __tests__/      ← Test suites (66 tests passing)
└── vitest.config.ts    ← Test configuration
```

## Tech Stack Quick Reference

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Validation:** Zod (runtime type checking)
- **State:** Zustand (global state management)
- **Testing:** Vitest + Testing Library
- **Styling:** Tailwind CSS + Shadcn UI
- **Animation:** Framer Motion

## Quality Gates (Must Pass)

Before considering a PR complete:

1. **Tests:** `npm test` → 100% passing
2. **Build:** `npm run build` → No TypeScript errors
3. **Types:** Strict mode, explicit return types
4. **Validation:** All inputs use Zod schemas
5. **State:** Zustand integration (no prop drilling)
6. **Errors:** Centralized error handling
7. **Security:** No secrets exposed, inputs sanitized

## Key Architectural Principles

### 1. Validate at Boundaries
```typescript
// API routes validate ALL inputs
const data = RequestSchema.parse(await request.json());
```

### 2. Single Source of Truth
```typescript
// State: lib/store.ts (Zustand)
// Validation: lib/validation.ts (Zod)
// Errors: lib/api-error.ts
```

### 3. Type Safety First
```typescript
// Infer types from Zod, never duplicate
type Patient = z.infer<typeof PatientSchema>;
```

### 4. No Code Duplication
```typescript
// Extract to lib/, never copy-paste
import { formatDate } from '@/lib/utils';
```

## Security Considerations

- Headers configured in `next.config.ts`
- Input sanitization via Zod
- Error details hidden in production
- No API keys in client bundles
- Rate limiting (future)

## Documentation Standards

**Code Comments:**
- Explain WHY, not WHAT
- Document complex logic
- Mark TODOs clearly

**File Headers:**
```typescript
/**
 * Component/Function Name
 * 
 * Brief description of purpose
 * Expected usage or behavior
 */
```

## Testing Expectations

- Every new feature needs tests
- Test happy path + edge cases
- Use descriptive test names
- Follow existing test patterns in `lib/__tests__/`

## Deployment

- **Hosting:** Hetzner VPS (188.245.46.71)
- **Domain:** worx.maxzilla.nl
- **Reverse Proxy:** Caddy
- **Docker:** Automated deployment

## Blog Post Context

This project will be featured in a blog post:

**Title:** "I Tried to Replace Myself With Claude's Auto-Pipeline (Here's What It Actually Did)"

**Metrics Tracked:**
- Token usage
- Time to completion
- Manual interventions
- Auto-merge success
- Security findings
- Code quality

**Be thorough. The world will see this code.**

## Design Philosophy

- **Clean:** Minimal, purposeful design
- **Fast:** Smooth animations, instant feedback
- **Professional:** Production-grade code quality
- **Accessible:** Semantic HTML, ARIA labels (future)

## Important Constraints

### DO:
- Follow rules.md strictly
- Update PROGRESS.md after completing tasks
- Write comprehensive tests
- Use existing utilities/components
- Ask clarifying questions if spec is unclear

### DON'T:
- Use `any` types
- Skip validation
- Duplicate code
- Bypass error handling
- Commit without testing

## Workflow

1. Read PRD.md for feature requirements
2. Check PROGRESS.md for current state
3. Implement following rules.md
4. Write tests
5. Update PROGRESS.md
6. Commit with descriptive message

## When Stuck

**If requirements are ambiguous:**
- Ask the user for clarification
- Reference PRD.md for context
- Check existing code for patterns

**If implementation is blocked:**
- Document the blocker in PROGRESS.md
- Propose alternative approaches
- Ask for guidance

---

**Remember:** This is a test of autonomous development. The goal is to ship production-quality code with minimal human intervention. Make it count.
