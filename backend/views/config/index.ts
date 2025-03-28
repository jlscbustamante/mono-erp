import { loadGlobalEnv } from "@scope/shared/env";

await loadGlobalEnv();

export const appConfig = {
  messages: {
    wsp: Deno.env.get("WSP_CODE") as string,
  },
  jwt: {
    secret: Deno.env.get("JWT_APP") as string,
  },
  db: {
    host: Deno.env.get("DB_HOST") as string,
    user: Deno.env.get("DB_USER") as string,
    password: Deno.env.get("DB_PASSWORD") as string,
    port: Deno.env.get("DB_PORT") as string,
    database: Deno.env.get("DB_DATABASE") as string,
    url: Deno.env.get("DATABASE_URL") as string,
  },
};
