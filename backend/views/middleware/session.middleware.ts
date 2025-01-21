import { Session } from "@scope/shared";
import { JwtService } from "@scope/shared/services/jwt";
import { createMiddleware } from "hono/factory";
import { appConfig } from "../config/index.ts";

declare module "hono" {
  interface ContextVariableMap {
    user: Session;
  }
}

const jwtService = new JwtService(appConfig.jwt.secret);

export const session = createMiddleware(async (c, next) => {
  const [, token] = c.req.header("Authorization")?.split(" ") ?? [];
  if (!token) {
    throw new Error("No autorizado");
  } else {
    const parsed = await jwtService.decrypt<Session>(token);
    c.set("user", parsed);
  }
  await next();
});
