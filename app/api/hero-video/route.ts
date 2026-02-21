/**
 * GET /api/hero-video
 *
 * Returns the cached hero video URL from the environment variable.
 * Set HERO_VIDEO_URL in .env.local after generation completes.
 */

import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const videoUrl = process.env.HERO_VIDEO_URL ?? null;
  return NextResponse.json({ videoUrl });
}
