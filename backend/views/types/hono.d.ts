import { Session } from "@scope/shared";

declare module "hono" {
  interface ContextVariableMap {
    user: Session;
  }
}
