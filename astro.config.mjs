// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// 根据环境选择配置文件
const isProd = process.env.NODE_ENV === 'production';
const configPath = isProd 
  ? './.wrangler/wrangler.prod.jsonc'
  : './.wrangler/wrangler.local.jsonc';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind()],
  devToolbar: {
    enabled: false
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: configPath,
    },
  }),
});
