import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { posts } from '../../db/schema';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const { env } = locals.runtime;
    const db = getDb(env.my_astro_db);
    const allPosts = await db.select().from(posts).all();

    return new Response(JSON.stringify({
      success: true,
      posts: allPosts
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
