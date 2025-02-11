import { hc } from "hono/client";
import { apiRouter } from "./main.ts";

export type ViewType = typeof apiRouter;
export type ClientType = ReturnType<typeof hc<ViewType>>;
