import { parse } from "@std/dotenv";

export const loadGlobalEnv = async () => {
  const env = await Deno.readTextFile("../.env");

  const parsed = parse(env);

  Deno.env.set("WSP_CODE", parsed.WSP_CODE);
  Deno.env.set("JWT_APP", parsed.JWT_APP);
  Deno.env.set("DB_HOST", parsed.DB_HOST);
  Deno.env.set("DB_USER", parsed.DB_USER);
  Deno.env.set("DB_PASSWORD", parsed.DB_PASSWORD);
  Deno.env.set("DB_PORT", parsed.DB_PORT);
  Deno.env.set("DB_DATABASE", parsed.DB_DATABASE);

  Deno.env.set("FACTURACION_HOST", parsed.FACTURACION_HOST);
};
