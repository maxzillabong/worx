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
8. **Pre-Push Agents:** All three agents below must pass (see "Pre-Push Agent Gates")

## Pre-Push Agent Gates (MANDATORY)

**Before every `git push`, you MUST launch all three agents in parallel using the Task tool. No exceptions. Do not push until all three pass.**

These agents run as parallel subagents. Launch all three simultaneously, wait for all results, and only push if every agent passes clean.

### 1. SEO Audit Agent
- **Subagent type:** `general-purpose`
- **Scope:** Audit all pages in `app/` for SEO best practices
- **Checks:**
  - Every page/layout exports proper `metadata` (title, description, openGraph)
  - Semantic HTML structure (single `<h1>` per page, logical heading hierarchy)
  - Images have `alt` attributes
  - No missing `<meta>` viewport or charset tags
  - Proper use of Next.js `generateMetadata` where dynamic
  - `robots.txt` and `sitemap.xml` exist if applicable
- **Output:** List of findings with severity (pass/warn/fail)
- **Gate:** No "fail" findings allowed. Warnings are acceptable but should be noted.

### 2. Code Review Agent
- **Subagent type:** `general-purpose`
- **Scope:** Review all changed files (use `git diff` against base branch)
- **Checks:**
  - No `any` types, no `@ts-ignore`, no `eslint-disable` without justification
  - Functions have explicit return types
  - No unused imports, variables, or dead code
  - No hardcoded secrets, API keys, or credentials
  - Zod validation at all API boundaries
  - Error handling follows `lib/api-error.ts` patterns
  - No prop drilling (state via Zustand)
  - No code duplication (DRY principle)
  - Component/function naming follows project conventions
  - Test coverage exists for new code paths
- **Output:** Inline-style review comments with file:line references
- **Gate:** No critical findings allowed. Suggestions are acceptable.

### 3. Security Audit Agent
- **Subagent type:** `general-purpose`
- **Scope:** Scan the full codebase for security vulnerabilities
- **Checks:**
  - OWASP Top 10 (XSS, injection, CSRF, SSRF, etc.)
  - No secrets or API keys in source code or git history
  - All user inputs sanitized via Zod before use
  - API routes validate authentication/authorization where needed
  - No `eval()`, `dangerouslySetInnerHTML`, or unsafe DOM manipulation
  - Dependencies checked for known vulnerabilities (`npm audit`)
  - HTTP security headers configured in `next.config.ts`
  - Environment variables not leaked to client bundles
  - No sensitive data in error responses (production mode)
- **Output:** Vulnerability report with severity (info/low/medium/high/critical)
- **Gate:** No "high" or "critical" findings allowed. Medium findings require justification.

### Pre-Push Workflow

```
1. Finish implementation
2. Run `npm test` → all passing
3. Run `npm run build` → clean
4. Launch all 3 agents in parallel (Task tool):
   a. SEO Audit Agent
   b. Code Review Agent
   c. Security Audit Agent
5. Review agent outputs
6. Fix any blocking findings
7. Re-run failed agents if fixes were made
8. Only after all 3 pass → `git push`
```

### Agent Launch Template

When launching, use prompts like:

**SEO Agent:**
> "Audit all pages in app/ for SEO. Check metadata exports, semantic HTML, heading hierarchy, image alt tags, and Next.js metadata patterns. Report findings as pass/warn/fail with file:line references."

**Code Review Agent:**
> "Review all files changed vs the main branch (git diff main...HEAD). Check for type safety, unused code, validation patterns, error handling, naming conventions, and test coverage. Report as inline review comments with file:line references."

**Security Agent:**
> "Perform a security audit of the full codebase. Check OWASP Top 10, secrets in code, input sanitization, unsafe APIs (eval, dangerouslySetInnerHTML), dependency vulnerabilities (npm audit), security headers, and client bundle leaks. Report findings with severity levels."

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
- Push without running all 3 pre-push agents (SEO, Code Review, Security)

## Workflow

1. Read PRD.md for feature requirements
2. Check PROGRESS.md for current state
3. Implement following rules.md
4. Write tests
5. Run `npm test` and `npm run build`
6. **Run Pre-Push Agent Gates (SEO + Code Review + Security) in parallel**
7. Fix any findings, re-run agents if needed
8. Update PROGRESS.md
9. Commit with descriptive message
10. Push only after all agents pass

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
