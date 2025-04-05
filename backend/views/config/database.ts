import { appConfig } from "#app/config/index.ts";
import { DB } from "@scope/shared";
import { Kysely, MysqlDialect, MysqlPool } from "kysely";
import { createPool } from "mysql2";

const dialect = new MysqlDialect({
  pool: createPool(appConfig.db.url) as unknown as MysqlPool,
});

export const db = new Kysely<DB>({
  log: ["query"],
  dialect: dialect,
});
