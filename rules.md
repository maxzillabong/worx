# Worx - Coding Standards & Architecture Rules

**Enforce these rules strictly. No exceptions without explicit approval.**

---

## Core Principles

### 1. Type Safety First
- **No `any` types** unless interfacing with untyped external libraries
- All validation uses **Zod schemas** from `lib/validation.ts`
- Types are **inferred** from Zod: `type Patient = z.infer<typeof PatientSchema>`
- Explicit return types on all exported functions

```typescript
// ✅ GOOD
export function analyzeBloodwork(data: BloodworkResult): Promise<AIInsight> {
  const validated = BloodworkResultSchema.parse(data);
  // ...
}

// ❌ BAD - no type safety
export async function analyzeBloodwork(data: any) {
  // ...
}
```

### 2. Single Source of Truth
- **State:** Zustand store (`lib/store.ts`)
- **Validation:** Zod schemas (`lib/validation.ts`)  
- **Config:** `next.config.ts` (no `process.env` in components)
- **Errors:** API error utilities (`lib/api-error.ts`)

```typescript
// ✅ GOOD - centralized schema
import { PatientSchema } from '@/lib/validation';
const patient = PatientSchema.parse(data);

// ❌ BAD - inline validation
if (!data.firstName || typeof data.firstName !== 'string') { ... }
```

### 3. Validate at Boundaries
- **API routes:** Validate all inputs with Zod before processing
- **Forms:** Use Zod schemas for both client and server validation
- **Trust internally:** Once validated, don't re-validate

```typescript
// ✅ GOOD - validate at entry point
export async function POST(request: Request) {
  const body = await request.json();
  const data = AnalyzeBloodworkRequestSchema.parse(body); // Throws if invalid
  // ... process validated data safely
}

// ❌ BAD - no validation
export async function POST(request: Request) {
  const body = await request.json();
  const result = await analyze(body.bloodworkId); // Unsafe!
}
```

### 4. No Code Duplication
- Extract shared logic to `lib/` utilities
- Reusable UI components in `components/`
- API helpers in `lib/api-*.ts`

```typescript
// ✅ GOOD - reusable utility
import { formatDate } from '@/lib/utils';
const formatted = formatDate(date);

// ❌ BAD - duplicated logic
const formatted = new Date(date).toLocaleString(...);
```

### 5. Security by Default
- Security headers in `next.config.ts` (HSTS, CSP, etc.)
- Input sanitization via Zod validation
- No secrets in client bundles (only `NEXT_PUBLIC_*` vars)
- Error responses via `createErrorResponse()` (hide details in production)

---

## File Organization

```
worx/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
│       └── analyze/       # Feature-specific routes
│           └── route.ts   # GET, POST handlers
├── components/            # React components
│   ├── ui/               # Shadcn UI base components
│   └── [feature].tsx     # Feature components
├── lib/                  # Shared utilities
│   ├── validation.ts     # Zod schemas & types
│   ├── store.ts          # Zustand state management
│   ├── api-error.ts      # Error handling
│   ├── utils.ts          # Helper functions
│   └── __tests__/        # Test suites
├── public/               # Static assets
└── [docs].md             # Documentation
```

---

## TypeScript Rules

### Explicit Types
```typescript
// ✅ GOOD
export function calculateStats(metrics: BloodworkMetric[]): SummaryStats {
  // ...
}

// ❌ BAD - implicit any
export function calculateStats(metrics) {
  // ...
}
```

### Type Inference from Zod
```typescript
// ✅ GOOD - single source of truth
export const PatientSchema = z.object({
  firstName: z.string().min(1),
  // ...
});
export type Patient = z.infer<typeof PatientSchema>;

// ❌ BAD - duplicated types
export interface Patient {
  firstName: string;
}
```

### React Components
```typescript
// ✅ GOOD - explicit props and return type
interface MetricCardProps {
  metric: BloodworkMetric;
  index?: number;
}

export function MetricCard({ metric, index = 0 }: MetricCardProps): React.JSX.Element {
  return <div>...</div>;
}

// ❌ BAD - no types
export function MetricCard({ metric, index = 0 }) {
  return <div>...</div>;
}
```

---

## Validation Rules

### API Routes
```typescript
// ✅ GOOD - validate, then process
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = AnalyzeBloodworkRequestSchema.parse(body);
    
    const result = await processData(data);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ❌ BAD - no validation, poor error handling
export async function POST(request: Request) {
  const body = await request.json();
  const result = await processData(body);
  return NextResponse.json(result);
}
```

### Schema Design
```typescript
// ✅ GOOD - strict, explicit
export const BloodworkMetricSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number().positive(),
  unit: z.string().min(1),
  status: z.enum(['normal', 'low', 'high', 'critical']),
  referenceRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  category: z.string(),
});

// ❌ BAD - loose, unsafe
const schema = z.object({
  name: z.string(),
  value: z.number(),
  // missing constraints
});
```

---

## State Management Rules

### Zustand Store Usage
```typescript
// ✅ GOOD - use Zustand for global state
'use client';
import { useWorxStore } from '@/lib/store';

export function BloodworkCard() {
  const patient = useWorxStore((state) => state.currentPatient);
  const isAnalyzing = useWorxStore((state) => state.isAnalyzing);
  
  return <div>{patient?.firstName}</div>;
}

// ❌ BAD - useState for global data (prop drilling)
export function BloodworkCard() {
  const [patient, setPatient] = useState<Patient | null>(null);
  // ... causes prop drilling, sync issues
}
```

### Store Actions
```typescript
// ✅ GOOD - descriptive action names
const { setCurrentPatient, addBloodworkResult } = useWorxStore.getState();

// ❌ BAD - generic setters
const { set, update } = useWorxStore.getState();
```

---

## Error Handling Rules

### Centralized Errors
```typescript
// ✅ GOOD - use error utilities
import { handleApiError, Errors } from '@/lib/api-error';

if (!bloodwork) {
  throw Errors.NotFound('Bloodwork');
}

// ❌ BAD - manual error responses
if (!bloodwork) {
  return new Response('Not found', { status: 404 });
}
```

### Error Context
```typescript
// ✅ GOOD - structured errors
throw new ApiError(400, 'INVALID_BLOODWORK_ID', 'Bloodwork ID must be a valid UUID', {
  provided: bloodworkId,
  expected: 'UUID v4 format',
});

// ❌ BAD - generic errors
throw new Error('Invalid ID');
```

---

## Testing Rules

### Test Location
```
lib/
├── utils.ts
└── __tests__/
    └── utils.test.ts
```

### Test Structure
```typescript
// ✅ GOOD - descriptive, comprehensive
describe('calculateSummaryStats', () => {
  it('calculates correct statistics', () => {
    const metrics = [
      { status: 'normal' },
      { status: 'high' },
      { status: 'critical' },
    ];
    
    const stats = calculateSummaryStats(metrics);
    
    expect(stats.total).toBe(3);
    expect(stats.normal).toBe(1);
    expect(stats.abnormal).toBe(1);
    expect(stats.critical).toBe(1);
  });

  it('handles empty array', () => {
    expect(calculateSummaryStats([])).toEqual({
      total: 0,
      normal: 0,
      abnormal: 0,
      critical: 0,
    });
  });
});

// ❌ BAD - vague, incomplete
it('works', () => {
  const result = calculateSummaryStats(data);
  expect(result).toBeTruthy();
});
```

### Test Coverage Requirements
- **Happy path** - Normal, expected usage
- **Edge cases** - Empty arrays, null values, boundary conditions
- **Error cases** - Invalid input, missing data
- **Async** - Use `async/await` for promises

---

## Code Style

### Naming Conventions
```typescript
// Components: PascalCase
export function MetricCard() { }

// Functions: camelCase
export function calculatePercentage() { }

// Constants: UPPER_SNAKE_CASE or camelCase
export const MAX_RETRIES = 3;
export const defaultConfig = { };

// Types/Interfaces: PascalCase
export type BloodworkMetric = z.infer<typeof BloodworkMetricSchema>;

// File names: kebab-case
// metric-card.tsx, api-error.ts
```

### Comments
```typescript
// ✅ GOOD - explain WHY
// Calculate percentage clamped to 0-100 to prevent visual overflow
const percentage = Math.min(100, Math.max(0, value));

// ❌ BAD - explain WHAT (obvious from code)
// Set percentage to value
const percentage = value;
```

### Imports
```typescript
// ✅ GOOD - organized, aliased
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorxStore } from '@/lib/store';
import type { BloodworkMetric } from '@/lib/validation';

// ❌ BAD - disorganized, relative paths
import { motion } from 'framer-motion';
import React from 'react';
import { useWorxStore } from '../lib/store';
```

---

## Component Patterns

### Client vs Server Components
```typescript
// ✅ GOOD - explicit 'use client' when needed
'use client';
import { useState } from 'react';

export function InteractiveCard() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Server component (default)
export function StaticCard({ data }: { data: Data }) {
  return <div>{data.title}</div>;
}
```

### Props Interface
```typescript
// ✅ GOOD - explicit interface
interface MetricCardProps {
  metric: BloodworkMetric;
  index?: number;
  onAnalyze?: (id: string) => void;
}

export function MetricCard({ metric, index = 0, onAnalyze }: MetricCardProps) {
  // ...
}

// ❌ BAD - inline types
export function MetricCard({ metric, index }: { metric: any, index: number }) {
  // ...
}
```

---

## Pre-Commit Checklist

Before committing code:

- [ ] **Tests pass:** `npm test`
- [ ] **Build succeeds:** `npm run build`
- [ ] **Types valid:** No TypeScript errors
- [ ] **Validation present:** All inputs use Zod
- [ ] **State centralized:** Using Zustand, not local state for global data
- [ ] **Errors handled:** Using `createErrorResponse()` and `handleApiError()`
- [ ] **No duplication:** Extracted shared logic
- [ ] **Security considered:** No exposed secrets, inputs sanitized
- [ ] **Documentation updated:** Comments, README if needed
- [ ] **PROGRESS.md updated:** Track completed work

---

## Forbidden Patterns

### Never Do This
```typescript
// ❌ Any types
function process(data: any) { }

// ❌ Inline validation
if (typeof data.id === 'string') { }

// ❌ Manual error responses
return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });

// ❌ Prop drilling for global state
<Child patient={patient} setPatient={setPatient} />

// ❌ Process.env in components
const apiKey = process.env.API_KEY;

// ❌ Duplicate code
const formatted1 = value.toFixed(2);
const formatted2 = value.toFixed(2);

// ❌ Unclear test names
it('test1', () => { });
```

---

## Reference Implementations

**Look at these files for examples:**

- **Validation:** `lib/validation.ts`
- **State:** `lib/store.ts`
- **Errors:** `lib/api-error.ts`
- **Utils:** `lib/utils.ts`
- **Components:** `components/metric-card.tsx`
- **API Routes:** `app/api/analyze/route.ts`
- **Tests:** `lib/__tests__/*.test.ts`

**Follow these patterns. Don't reinvent the wheel.**

---

**Remember:** These rules exist for a reason. Production-grade code is consistent, type-safe, tested, and secure. No shortcuts.
