import 'server-only';
import type { PoolConnection } from './db';
const prefixes:Record<string,string>={customer:'SKG-CUS',enquiry:'SKG-ENQ',quotation:'SKG-QT',booking:'SKG-BK',trip:'SKG-TR',invoice:'SKG-INV',receipt:'SKG-RC',expense:'SKG-EX',vendor:'SKG-VD',maintenance:'SKG-MN',journal:'SKG-JE',vehicle:'SKG-VH',staff:'SKG-EMP',driver:'SKG-DRV'};
export async function nextNumber(conn:PoolConnection,companyId:number,key:keyof typeof prefixes):Promise<string>{
 const prefix=prefixes[key]; if(!prefix)throw new Error('Unknown number sequence.');
 await conn.execute(`INSERT INTO numbering_sequences(company_id,sequence_key,prefix,next_value) VALUES(?,?,?,1) ON DUPLICATE KEY UPDATE sequence_key=VALUES(sequence_key)`,[companyId,key,prefix]);
 const [rows]=await conn.execute<any[]>(`SELECT next_value FROM numbering_sequences WHERE company_id=? AND sequence_key=? FOR UPDATE`,[companyId,key]);
 const next=Number(rows[0]?.next_value??0); if(!Number.isSafeInteger(next)||next<1)throw new Error('Invalid sequence counter.');
 await conn.execute(`UPDATE numbering_sequences SET next_value=? WHERE company_id=? AND sequence_key=?`,[next+1,companyId,key]);
 return `${prefix}-${String(next).padStart(6,'0')}`;
}
