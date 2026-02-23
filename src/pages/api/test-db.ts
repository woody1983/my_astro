import type { APIRoute } from 'astro';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../db/schema';

export const POST: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime?.env || (context as any).env;
    
    if (!env?.my_astro_db) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Database binding not found'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const db = drizzle(env.my_astro_db, { schema });
    const { action } = await context.request.json() as { action: string };

    if (action === 'addUser') {
      const result = await db.insert(schema.users).values({
        name: `User ${Date.now()}`,
        email: `user${Date.now()}@example.com`,
      }).returning();

      return new Response(JSON.stringify({
        success: true,
        message: 'User added successfully',
        data: result[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'addPost') {
      const allUsers = await db.select().from(schema.users).all();
      
      if (allUsers.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Please add a user first'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await db.insert(schema.posts).values({
        title: `Test Post ${Date.now()}`,
        content: 'This is a test post content.',
        authorId: allUsers[0].id,
      }).returning();

      return new Response(JSON.stringify({
        success: true,
        message: 'Post added successfully',
        data: result[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Unknown action'
    }), {
      status: 400,
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
