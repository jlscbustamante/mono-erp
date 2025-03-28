import { db } from "#app/config/database.ts";
import { redis } from "#app/config/redis.ts";
import { AdmSucursalSelect } from "@scope/shared";
import { minutesToSeconds } from "date-fns/minutesToSeconds";

export const get_stores = async (): Promise<AdmSucursalSelect[]> => {
  const cache = await redis.get("erp:stores");
  if (cache) {
    return JSON.parse(cache);
  }

  const stores: AdmSucursalSelect[] = await db
    .selectFrom("adm_sucursal")
    .selectAll()
    .execute();

  await redis.set(
    "erp:stores",
    JSON.stringify(stores),
    "EX",
    minutesToSeconds(60 * 4)
  );

  return stores;
};
