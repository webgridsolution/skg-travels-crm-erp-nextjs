import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';

export type SessionUser = { id: number; companyId: number; branchId: number | null; name: string; email: string; isActive: boolean; roles: string[]; permissions: string[]; branchIds: number[]; demo?: boolean };
const COOKIE = 'skg_session';
const demoUser: SessionUser = { id: 1, companyId: 1, branchId: 1, name: 'SKG Administrator', email: 'admin@skgtravels.test', isActive: true, roles: ['Super Admin'], permissions: ['*'], branchIds: [1,2], demo: true };
export function databaseConfigured(): boolean { return Boolean(process.env.MYSQL_DATABASE && process.env.MYSQL_USER); }
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!databaseConfigured() && process.env.NODE_ENV !== 'production') return demoUser;
  const jar = await cookies(); const token = jar.get(COOKIE)?.value; if (!token) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const [rows] = await db().execute<any[]>(`SELECT u.id,u.company_id,u.branch_id,u.name,u.email,u.is_active,s.expires_at FROM auth_sessions s JOIN users u ON u.id=s.user_id JOIN companies c ON c.id=u.company_id WHERE s.id=? AND (u.branch_id IS NULL OR EXISTS(SELECT 1 FROM branches bx WHERE bx.id=u.branch_id AND bx.company_id=u.company_id)) LIMIT 1`, [tokenHash]);
  const row = rows[0]; if (!row || !row.is_active || new Date(row.expires_at).getTime() <= Date.now()) return null;
  const [rolesRows] = await db().execute<any[]>(`SELECT r.name FROM user_roles ur JOIN roles r ON r.id=ur.role_id WHERE ur.user_id=? AND r.company_id=?`,[row.id,row.company_id]);
  const [permissionRows] = await db().execute<any[]>(`SELECT DISTINCT p.name FROM permissions p JOIN role_permissions rp ON rp.permission_id=p.id JOIN user_roles ur ON ur.role_id=rp.role_id JOIN roles r ON r.id=ur.role_id AND r.company_id=? WHERE ur.user_id=?`,[row.company_id,row.id]);
  const [branchRows] = await db().execute<any[]>(`SELECT ub.branch_id FROM user_branches ub JOIN branches b ON b.id=ub.branch_id AND b.company_id=? WHERE ub.user_id=? AND b.is_active=1 UNION SELECT b.id branch_id FROM branches b WHERE b.id=? AND b.company_id=? AND b.is_active=1`,[row.company_id,row.id,row.branch_id,row.company_id]);
  const branchIds = [...new Set(branchRows.map((b:any)=>Number(b.branch_id)))];
  return { id:Number(row.id), companyId:Number(row.company_id), branchId:row.branch_id===null?null:Number(row.branch_id), name:row.name, email:row.email, isActive:Boolean(row.is_active), roles:rolesRows.map((x:any)=>x.name), permissions:permissionRows.map((x:any)=>x.name), branchIds };
}
export async function requireUser(): Promise<SessionUser> { const user=await getCurrentUser(); if(!user) throw new Error('UNAUTHENTICATED'); return user; }
export function hasPermission(user: SessionUser, permission: string): boolean { return user.roles.includes('Super Admin') || user.permissions.includes('*') || user.permissions.includes(permission); }
export async function requirePermission(permission: string): Promise<SessionUser> { const user=await requireUser(); if(!hasPermission(user,permission)) throw new Error('FORBIDDEN'); return user; }
export async function createSession(userId: number): Promise<void> {
  const token=randomBytes(32).toString('base64url'); const hash=createHash('sha256').update(token).digest('hex');
  await db().execute(`INSERT INTO auth_sessions(id,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 30 DAY))`,[hash,userId]);
  const jar=await cookies(); jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production'||process.env.COOKIE_SECURE==='true',sameSite:'lax',path:'/',maxAge:60*60*24*30});
}
export async function destroySession(): Promise<void> {
  const jar=await cookies(); const token=jar.get(COOKIE)?.value;
  if(token&&databaseConfigured()){const hash=createHash('sha256').update(token).digest('hex');await db().execute('DELETE FROM auth_sessions WHERE id=?',[hash]);}
  jar.delete(COOKIE);
}
export { COOKIE };
