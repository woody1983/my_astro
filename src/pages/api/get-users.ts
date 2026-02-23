import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';

export const GET: APIRoute = async (context) => {
  try {
    // 从 runtime.env 获取 DB，无论本地还是线上都通过这里
    const env = context.locals.runtime?.env || (context as any).env;
    
    if (!env?.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'DB binding not found in env'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = drizzle(env.DB, { schema });
    const allUsers = await db.select().from(schema.users).all();

    return new Response(JSON.stringify({
      success: true,
      users: allUsers
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
