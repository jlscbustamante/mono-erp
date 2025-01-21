import {
  dispatches,
  dispatchesItems,
  dispatchesRelation,
  dispatchItemRelation,
  stocks,
  templateItemsRelation,
  templateRelation,
  templates,
  templatesItems,
} from "@scope/pizzadb";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { appConfig } from "./config/index.ts";

const connection = mysql.createPool({
  host: appConfig.db.host,
  user: appConfig.db.user,
  password: appConfig.db.password,
  database: appConfig.db.database,
  port: Number(appConfig.db.port),
});

export const db = drizzle(connection, {
  mode: "default",
  logger: false,
  schema: {
    dispatches,
    dispatchesItems,
    dispatchesRelation,
    dispatchItemRelation,
    templates,
    templatesItems,
    templateItemsRelation,
    templateRelation,
    stocks,
  },
});
