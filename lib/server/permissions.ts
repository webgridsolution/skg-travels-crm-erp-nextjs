import 'server-only';
import type { SessionUser } from './auth';
export function canAccessBranch(user:SessionUser,branchId:number|null):boolean {
  if(user.roles.includes('Super Admin')||user.permissions.includes('branches.access_all')) return true;
  return branchId!==null&&user.branchIds.includes(branchId);
}
export function scopeSql(user:SessionUser, alias:string, field='branch_id'):{sql:string;params:number[]} {
  const col=`${alias}.${field}`;
  if(user.roles.includes('Super Admin')||user.permissions.includes('branches.access_all')) return {sql:'',params:[]};
  if(user.branchIds.length===0) return {sql:' AND 1=0',params:[]};
  return {sql:` AND ${col} IN (${user.branchIds.map(()=>'?').join(',')})`,params:user.branchIds};
}
