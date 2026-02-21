# AI Insights Feature - Detailed Implementation Specification

**For:** Claude Code 4.6 Autonomous Development  
**Status:** Ready to implement  
**Estimated Complexity:** Medium (2-4 hours for human developer)

---

## Overview

Build a complete AI-powered blood analysis feature that takes bloodwork metrics and generates actionable health insights using an LLM (Claude Sonnet 4 recommended).

## Architecture

```
User clicks "Generate Insights"
  ↓
UI sets isAnalyzing = true (Zustand)
  ↓
POST /api/analyze { bloodworkId }
  ↓
Validate with Zod AnalyzeBloodworkRequestSchema
  ↓
Fetch bloodwork from Zustand store
  ↓
Send metrics to AI model with structured prompt
  ↓
Parse AI response into AIInsight format
  ↓
Store insight in Zustand with addInsight()
  ↓
Return insight to UI
  ↓
UI displays insights, sets isAnalyzing = false
```

---

## Implementation Tasks

### Task 1: API Endpoint Implementation

**File:** `app/api/analyze/route.ts`

**Current State:** Stub with TODOs  
**Target State:** Working endpoint that calls AI and returns insights

**Steps:**
1. Keep existing imports and error handling structure
2. Replace stub logic with real implementation:
   ```typescript
   // 1. Parse request
   const body = await request.json();
   const { bloodworkId } = AnalyzeBloodworkRequestSchema.parse(body);
   
   // 2. Get bloodwork data (from Zustand in demo, later from DB)
   // For now, use MOCK_BLOODWORK or fetch from store
   const bloodwork = MOCK_BLOODWORK; // Simplification for demo
   
   // 3. Call AI model
   const aiResponse = await callAIModel(bloodwork.metrics);
   
   // 4. Parse response into AIInsight
   const insight = parseAIResponse(aiResponse, bloodworkId);
   
   // 5. Validate and return
   const validated = AIInsightSchema.parse(insight);
   return NextResponse.json({ success: true, insights: validated });
   ```

3. Create AI integration helper:
   ```typescript
   async function callAIModel(metrics: BloodworkMetric[]): Promise<string> {
     const apiKey = process.env.ANTHROPIC_API_KEY;
     if (!apiKey) throw Errors.Internal('ANTHROPIC_API_KEY not configured');
     
     const prompt = buildPrompt(metrics);
     
     const response = await fetch('https://api.anthropic.com/v1/messages', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-api-key': apiKey,
         'anthropic-version': '2023-06-01',
       },
       body: JSON.stringify({
         model: 'claude-sonnet-4-20250514',
         max_tokens: 1024,
         messages: [{
           role: 'user',
           content: prompt,
         }],
       }),
     });
     
     if (!response.ok) {
       throw Errors.Internal(`AI API error: ${response.status}`);
     }
     
     const data = await response.json();
     return data.content[0].text;
   }
   ```

4. Create prompt builder:
   ```typescript
   function buildPrompt(metrics: BloodworkMetric[]): string {
     const metricsText = metrics.map(m => 
       `${m.name}: ${m.value} ${m.unit} (reference: ${m.referenceRange.min}-${m.referenceRange.max}, status: ${m.status})`
     ).join('\n');
     
     return `Analyze these bloodwork results and provide structured health insights:

${metricsText}

Return a JSON object with this structure:
{
  "insights": [
    {
      "type": "warning" | "recommendation" | "trend" | "correlation",
      "severity": "info" | "low" | "medium" | "high",
      "title": "Brief title",
      "description": "Detailed explanation",
      "affectedMetrics": ["metric names"]
    }
  ],
  "summary": "Overall health summary in 1-2 sentences"
}

Focus on:
- Flag values outside reference ranges
- Identify correlations (e.g., glucose + cholesterol)
- Provide actionable recommendations
- Use appropriate severity levels`;
   }
   ```

5. Create response parser:
   ```typescript
   function parseAIResponse(aiText: string, bloodworkId: string): AIInsight {
     // Parse JSON from AI response
     const jsonMatch = aiText.match(/\{[\s\S]*\}/);
     if (!jsonMatch) {
       throw Errors.Internal('Failed to parse AI response');
     }
     
     const parsed = JSON.parse(jsonMatch[0]);
     
     return {
       id: crypto.randomUUID(),
       bloodworkId,
       generatedAt: new Date().toISOString(),
       insights: parsed.insights,
       summary: parsed.summary,
       model: 'claude-sonnet-4',
     };
   }
   ```

**Environment Variable:**
Add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Error Handling:**
- Validate bloodworkId exists
- Handle AI API errors gracefully
- Validate AI response structure
- Use existing error utilities

---

### Task 2: UI Component Completion

**File:** `components/ai-insights-panel.tsx`

**Current State:** Empty state placeholder  
**Target State:** Working component that generates and displays insights

**Changes Needed:**

1. **Add Generate Button Handler:**
   ```typescript
   const handleAnalyze = async () => {
     try {
       setIsAnalyzing(true);
       
       const response = await fetch('/api/analyze', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ bloodworkId: bloodwork.id }),
       });
       
       if (!response.ok) throw new Error('Analysis failed');
       
       const data = await response.json();
       if (data.success && data.insights) {
         addInsight(data.insights);
       }
     } catch (error) {
       console.error('Analysis error:', error);
       // Show error state
     } finally {
       setIsAnalyzing(false);
     }
   };
   ```

2. **Update Button:**
   ```typescript
   <Button
     onClick={handleAnalyze}
     disabled={isAnalyzing}
     className="bg-purple-600 hover:bg-purple-700"
   >
     {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
   </Button>
   ```

3. **Add Insights Display:**
   ```typescript
   {insights.length > 0 && (
     <div className="space-y-4">
       <h3 className="text-xl font-bold text-white">AI Insights</h3>
       <p className="text-slate-300">{insights[0].summary}</p>
       
       <div className="space-y-3">
         {insights[0].insights.map((insight, idx) => (
           <InsightCard key={idx} insight={insight} />
         ))}
       </div>
     </div>
   )}
   ```

4. **Create InsightCard component:**
   ```typescript
   function InsightCard({ insight }: { insight: AIInsight['insights'][0] }) {
     const colors = {
       info: 'border-blue-500/30 bg-blue-500/10',
       low: 'border-yellow-500/30 bg-yellow-500/10',
       medium: 'border-orange-500/30 bg-orange-500/10',
       high: 'border-red-500/30 bg-red-500/10',
     };
     
     return (
       <Card className={`p-4 ${colors[insight.severity]}`}>
         <div className="flex items-start gap-3">
           <div className="mt-1">
             {insight.type === 'warning' && <AlertCircle className="w-5 h-5" />}
             {insight.type === 'recommendation' && <Lightbulb className="w-5 h-5" />}
             {/* Add other icons */}
           </div>
           <div className="flex-1">
             <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
             <p className="text-sm text-slate-300 mb-2">{insight.description}</p>
             <div className="flex gap-2">
               {insight.affectedMetrics.map(m => (
                 <Badge key={m} variant="outline">{m}</Badge>
               ))}
             </div>
           </div>
         </div>
       </Card>
     );
   }
   ```

**Imports Needed:**
```typescript
import { AlertCircle, Lightbulb, TrendingUp, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
```

---

### Task 3: Testing

**Create:** `app/api/analyze/__tests__/route.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';

describe('POST /api/analyze', () => {
  it('validates request body', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
  
  it('returns structured insights', async () => {
    // Mock AI response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ text: '{"insights": [], "summary": "Test"}' }],
      }),
    });
    
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        bloodworkId: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.insights).toBeDefined();
  });
});
```

**Create:** `components/__tests__/ai-insights-panel.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIInsightsPanel } from '../ai-insights-panel';
import { MOCK_BLOODWORK } from '@/lib/validation';

describe('AIInsightsPanel', () => {
  it('renders empty state', () => {
    render(<AIInsightsPanel bloodwork={MOCK_BLOODWORK} />);
    expect(screen.getByText(/Generate AI Insights/i)).toBeInTheDocument();
  });
  
  it('shows loading state when analyzing', () => {
    // Test loading state
  });
  
  it('displays insights after generation', () => {
    // Test insights display
  });
});
```

---

## Example AI Response

**Input Metrics:**
```
Red Blood Cells: 4.5 M/μL (4.2-5.9) - normal
White Blood Cells: 7.2 K/μL (4.0-7.0) - high
Glucose: 105 mg/dL (70-100) - high
```

**Expected AI Output:**
```json
{
  "insights": [
    {
      "type": "warning",
      "severity": "medium",
      "title": "Elevated White Blood Cells",
      "description": "Your WBC count is slightly above normal range. This could indicate recent infection, inflammation, or stress. Monitor and consult your doctor if persistent.",
      "affectedMetrics": ["White Blood Cells"]
    },
    {
      "type": "warning",
      "severity": "low",
      "title": "Elevated Fasting Glucose",
      "description": "Your glucose level is in the pre-diabetic range. Consider reducing sugar intake, increasing exercise, and monitoring regularly.",
      "affectedMetrics": ["Glucose"]
    },
    {
      "type": "recommendation",
      "severity": "info",
      "title": "Healthy Hemoglobin",
      "description": "Your red blood cell and hemoglobin levels are within healthy ranges, indicating good oxygen-carrying capacity.",
      "affectedMetrics": ["Red Blood Cells", "Hemoglobin"]
    }
  ],
  "summary": "Your bloodwork shows mostly healthy results with two areas requiring attention: slightly elevated WBC and glucose levels. Both are manageable with lifestyle adjustments."
}
```

---

## Success Checklist

Before considering complete:

- [ ] `npm test` passes (all 66 existing + new tests)
- [ ] `npm run build` succeeds
- [ ] TypeScript strict mode clean
- [ ] API endpoint returns valid AIInsight
- [ ] UI displays insights correctly
- [ ] Loading states work
- [ ] Error handling tested
- [ ] Environment variable documented
- [ ] Code follows rules.md standards
- [ ] PROGRESS.md updated

---

## Metrics to Measure

- **Token usage:** Total tokens for implementation
- **Time:** Minutes from start to completion
- **Manual interventions:** Number of times human corrected/guided
- **Auto-merge:** Did it merge automatically?
- **Test coverage:** Percentage of new code covered
- **Security findings:** Vulnerabilities detected

---

## Getting Started

1. Read this spec completely
2. Review existing code in `app/api/analyze/route.ts` and `components/ai-insights-panel.tsx`
3. Check `lib/validation.ts` for schemas
4. Check `lib/store.ts` for state management
5. Check `rules.md` for coding standards
6. Start implementation
7. Write tests as you go
8. Update PROGRESS.md when done

**Good luck! The world is watching. Make it production-grade.**
