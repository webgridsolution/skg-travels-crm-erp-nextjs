import { NextRequest,NextResponse } from 'next/server';
import { destroySession } from '@/lib/server/auth';
export async function POST(req:NextRequest){try{const origin=req.headers.get('origin');const host=req.headers.get('x-forwarded-host')??req.headers.get('host');if(!origin||new URL(origin).host!==host)return NextResponse.json({error:'Invalid request origin.'},{status:403})}catch{return NextResponse.json({error:'Invalid request origin.'},{status:403})}await destroySession();return NextResponse.json({ok:true})}
