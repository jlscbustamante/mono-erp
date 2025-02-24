import { Cache } from "@lambdalisue/ttl-cache";
import { minutesToMilliseconds } from "../utils.ts";

export const cache = new Cache<string, string>(minutesToMilliseconds(120));
