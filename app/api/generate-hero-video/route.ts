/**
 * Hero Video Generation API
 *
 * Generates an animated hero video via kie.ai (Veo 3.1 fast model).
 * POST /api/generate-hero-video — starts a generation task, returns taskId.
 * GET /api/generate-hero-video?taskId=... — polls for result.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';

const KIE_API_BASE = 'https://api.kie.ai/api/v1';

const HERO_PROMPT =
  'Macro cinematic shot: luminous blood cells drifting and spinning gracefully through a dark liquid medium, iridescent teal and cyan glow from within, bokeh background of deep slate-black, ultra slow motion, photorealistic 4K, smooth seamless loop, no text, no UI elements, no hands, pure visual atmosphere for a medical technology landing page hero background';

const TaskIdSchema = z.object({ taskId: z.string().min(1) });

export async function POST(): Promise<NextResponse> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KIE_API_KEY not configured' }, { status: 500 });
  }

  const response = await fetch(`${KIE_API_BASE}/veo/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: HERO_PROMPT,
      model: 'veo3_fast',
      aspect_ratio: '16:9',
    }),
  });

  const json = await response.json() as { code: number; msg: string; data?: { taskId: string } };

  if (!response.ok || json.code !== 200) {
    return NextResponse.json({ error: json.msg ?? 'Generation failed' }, { status: 502 });
  }

  return NextResponse.json({ taskId: json.data?.taskId });
}

export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KIE_API_KEY not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = TaskIdSchema.safeParse({ taskId: searchParams.get('taskId') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const response = await fetch(
    `${KIE_API_BASE}/veo/record-info?taskId=${parsed.data.taskId}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  const json = await response.json() as {
    code: number;
    msg: string;
    data?: {
      successFlag: number;
      response?: { resultUrls?: string[] };
      errorMessage?: string;
    };
  };

  if (!response.ok || json.code !== 200) {
    return NextResponse.json({ error: json.msg ?? 'Query failed' }, { status: 502 });
  }

  const { successFlag, response: result, errorMessage } = json.data ?? {};

  // 0=generating, 1=success, 2=failed, 3=generation failed
  if (successFlag === 1) {
    return NextResponse.json({
      status: 'complete',
      videoUrl: result?.resultUrls?.[0] ?? null,
    });
  }

  if (successFlag === 2 || successFlag === 3) {
    return NextResponse.json({ status: 'failed', error: errorMessage ?? 'Unknown error' });
  }

  return NextResponse.json({ status: 'pending' });
}
