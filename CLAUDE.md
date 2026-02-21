# Worx - Coding Standards & Architecture

**Purpose:** Test Claude Code 4.6 autonomous development pipeline  
**Stack:** Next.js 15, TypeScript, Tailwind, Shadcn UI, Zod, Zustand

---

## Core Principles

### 1. Type Safety First
- **No `any` types** unless interfacing with untyped external libraries
- All validation uses **Zod schemas** from `lib/validation.ts`
- Types are **inferred** from Zod: `type Patient = z.infer<typeof PatientSchema>`
- Explicit return types on all exported functions

### 2. Single Source of Truth
- **State:** Zustand store (`lib/store.ts`)
- **Validation:** Zod schemas (`lib/validation.ts`)  
- **Config:** `next.config.ts` (no `process.env` in components)
- **Errors:** API error utilities (`lib/api-error.ts`)

### 3. Validate at Boundaries
- **API routes:** Validate all inputs with Zod before processing
- **Forms:** Use Zod schemas for both client and server validation
- **Trust internally:** Once validated, don't re-validate

### 4. No Code Duplication
- Extract shared logic to `lib/` utilities
- Reusable UI components in `components/`
- API helpers in `lib/api-*.ts`

### 5. Security by Default
- Security headers in `next.config.ts` (HSTS, CSP, etc.)
- Input sanitization via Zod validation
- No secrets in client bundles (only `NEXT_PUBLIC_*` vars)
- Error responses via `createErrorResponse()` (hide details in production)

---

## File Structure

```
worx/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes (future)
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── ...               # Feature components
├── lib/                  # Shared utilities
│   ├── validation.ts     # Zod schemas & types
│   ├── store.ts          # Zustand state management
│   ├── api-error.ts      # Error handling
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── CLAUDE.md            # This file
```

---

## Coding Standards

### TypeScript
```typescript
// ✅ Good
export function analyzeBloodwork(data: BloodworkResult): AIInsight {
  const validated = BloodworkResultSchema.parse(data);
  // ... logic
  return result;
}

// ❌ Bad - no type safety
export function analyzeBloodwork(data: any) {
  // ... logic
  return result;
}
```

### Validation
```typescript
// ✅ Good - validate at API boundary
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = AnalyzeBloodworkRequestSchema.parse(body);
    // ... process validated data
  } catch (error) {
    return handleApiError(error);
  }
}

// ❌ Bad - no validation
export async function POST(request: Request) {
  const body = await request.json();
  // ... use body directly (unsafe!)
}
```

### State Management
```typescript
// ✅ Good - use Zustand store
'use client';
import { useWorxStore } from '@/lib/store';

export function BloodworkCard() {
  const patient = useWorxStore((state) => state.currentPatient);
  const isAnalyzing = useWorxStore((state) => state.isAnalyzing);
  
  return <div>{patient?.firstName}</div>;
}

// ❌ Bad - useState for global state
export function BloodworkCard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  // ... props drilling, sync issues
}
```

### Error Handling
```typescript
// ✅ Good - use error utilities
import { handleApiError, Errors } from '@/lib/api-error';

if (!bloodwork) {
  throw Errors.NotFound('Bloodwork');
}

// ❌ Bad - manual error responses
if (!bloodwork) {
  return new Response('Not found', { status: 404 });
}
```

---

## Testing Checklist

Before opening a PR, verify:

- [ ] **Types:** No `any` types, explicit return types on exports
- [ ] **Validation:** All API inputs validated with Zod
- [ ] **State:** Using Zustand store, not local useState for global data
- [ ] **Errors:** Using `createErrorResponse()` and `handleApiError()`
- [ ] **Security:** No secrets exposed, inputs sanitized
- [ ] **Build:** `npm run build` passes without errors
- [ ] **Lint:** `npm run lint` passes (if configured)

---

## API Route Template

```typescript
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { MyRequestSchema } from '@/lib/validation';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Parse and validate
    const body = await request.json();
    const data = MyRequestSchema.parse(body);

    // 2. Business logic
    const result = await processData(data);

    // 3. Return success response
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 4. Centralized error handling
    return handleApiError(error);
  }
}
```

---

## Component Template

```typescript
'use client';

import { useWorxStore } from '@/lib/store';
import type { BloodworkResult } from '@/lib/validation';

interface BloodworkCardProps {
  bloodwork: BloodworkResult;
}

export function BloodworkCard({ bloodwork }: BloodworkCardProps): JSX.Element {
  const isAnalyzing = useWorxStore((state) => state.isAnalyzing);
  
  return (
    <div className="rounded-lg border p-4">
      {/* Component JSX */}
    </div>
  );
}
```

---

## Mock Data

Use mock data from `lib/validation.ts`:

```typescript
import { MOCK_PATIENT, MOCK_BLOODWORK } from '@/lib/validation';

// Use in development/demo
const patient = MOCK_PATIENT;
const results = MOCK_BLOODWORK;
```

---

## Questions?

This project is a test case for Claude Code 4.6. When building features:

1. Follow these standards strictly
2. Use Zod for all validation
3. Use Zustand for state management
4. Write type-safe, production-quality code
5. Document security considerations

**The goal:** Prove Claude Code can autonomously ship production-ready features.
