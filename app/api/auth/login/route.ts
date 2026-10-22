import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/server/db';
import { createSession,databaseConfigured } from '@/lib/server/auth';
const bodySchema=z.object({email:z.string().email().max(190),password:z.string().min(1).max(200)});
function sameOrigin(req:NextRequest){const origin=req.headers.get('origin');if(!origin)return false;try{const host=req.headers.get('x-forwarded-host')??req.headers.get('host');return new URL(origin).host===host}catch{return false}}
export async function POST(req:NextRequest){if(!sameOrigin(req))return NextResponse.json({error:'Invalid request origin.'},{status:403});let body;try{body=bodySchema.parse(await req.json())}catch{return NextResponse.json({error:'Enter a valid email and password.'},{status:400})}
 if(!databaseConfigured()&&process.env.NODE_ENV!=='production')return NextResponse.json({ok:true,preview:true});
 try{const [rows]=await db().execute<any[]>(`SELECT id,password_hash,is_active FROM users WHERE email=? LIMIT 1`,[body.email.trim().toLowerCase()]);const user=rows[0];if(!user||!user.is_active||!(await bcrypt.compare(body.password,user.password_hash)))return NextResponse.json({error:'Email or password is incorrect.'},{status:401});await createSession(Number(user.id));await db().execute('UPDATE users SET last_login_at=UTC_TIMESTAMP() WHERE id=?',[user.id]);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Sign-in service is unavailable. Check the database connection.'},{status:503})}}
