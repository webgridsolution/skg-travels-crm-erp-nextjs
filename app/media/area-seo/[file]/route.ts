import fs from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { imageFilePath } from '@/lib/server/area-seo';

const TYPES: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const p = imageFilePath(file);
  if (!p) return new NextResponse('Not found', { status: 404 });
  try {
    const data = await fs.readFile(p);
    return new NextResponse(new Uint8Array(data), {
      headers: { 'Content-Type': TYPES[file.split('.').pop()!], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch { return new NextResponse('Not found', { status: 404 }); }
}
