import 'server-only';
import mysql, { type Pool, type PoolConnection, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
let pool: Pool | undefined;
export function db(): Pool {
  if (!pool) {
    if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER) throw new Error('Database is not configured. Copy .env.example to .env.local and set MySQL credentials.');
    pool = mysql.createPool({ host: process.env.MYSQL_HOST ?? '127.0.0.1', port: Number(process.env.MYSQL_PORT ?? 3306), database: process.env.MYSQL_DATABASE, user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, waitForConnections: true, connectionLimit: 10, queueLimit: 0, timezone: 'Z', decimalNumbers: false, namedPlaceholders: false, enableKeepAlive: true });
    pool.on('connection', (connection) => { connection.query("SET time_zone = '+00:00'"); });
  }
  return pool;
}
export async function transaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await db().getConnection();
  try { await conn.beginTransaction(); const value = await fn(conn); await conn.commit(); return value; }
  catch (error) { await conn.rollback(); throw error; }
  finally { conn.release(); }
}
export type { PoolConnection, RowDataPacket, ResultSetHeader };
