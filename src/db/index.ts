import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// 统一使用 DB 绑定，无论本地还是线上
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type DbClient = ReturnType<typeof getDb>;
