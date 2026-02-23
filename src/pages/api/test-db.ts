/// <reference types="@cloudflare/workers-types" />

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { users, posts } from '../../db/schema';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const db = getDb(env.my_astro_db);
    const { action } = await request.json() as { action: string };

    if (action === 'addUser') {
      const result = await db.insert(users).values({
        name: `用户 ${Date.now()}`,
        email: `user${Date.now()}@example.com`,
      }).returning();

      return new Response(JSON.stringify({
        success: true,
        message: '用户添加成功',
        data: result[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'addPost') {
      // 先获取一个用户作为作者
      const allUsers = await db.select().from(users).all();
      
      if (allUsers.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          message: '请先添加用户'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await db.insert(posts).values({
        title: `测试文章 ${Date.now()}`,
        content: '这是一篇测试文章的内容。',
        authorId: allUsers[0].id,
      }).returning();

      return new Response(JSON.stringify({
        success: true,
        message: '文章添加成功',
        data: result[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: '未知的操作'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
