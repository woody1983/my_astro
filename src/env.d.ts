/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type D1Database = import('@cloudflare/workers-types').D1Database;

declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: {
          DB: D1Database;
        };
      };
    }
  }
}

export {};
