import { defineConfig } from 'drizzle-kit';

const isLocal = process.env.LOCAL_DB === 'true';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: isLocal
    ? {
        // 本地开发：使用 wrangler 本地 D1
        accountId: 'local',
        databaseId: '100b1038-f414-42d6-a869-5c9311c48651',
        token: 'local',
      }
    : {
        // 生产环境：使用远程 D1
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
        token: process.env.CLOUDFLARE_TOKEN!,
      },
});
