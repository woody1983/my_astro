import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';

export const GET: APIRoute = async (context) => {
  try {
    // 在 Cloudflare Pages 中，env 在 context.locals.runtime.env 中
    // 但 wrangler dev 可能直接注入到 context.env
    const env = context.locals.runtime?.env || (context as any).env;
    
    if (!env?.my_astro_db) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Database binding not found. Available env: ' + JSON.stringify(Object.keys(env || {}))
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = drizzle(env.my_astro_db, { schema });
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
