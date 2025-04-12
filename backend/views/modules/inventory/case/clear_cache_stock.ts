import { redis } from "#app/config/redis.ts";
import { add, format, parseISO } from "date-fns";

export const clear_cache = async (store_id: string, date: string) => {
  // NOTE: este cache se generea en la app "pos"
  const following_day = format(add(parseISO(date), { days: 1 }), "yyyy-MM-dd");
  await redis.del(`stock:${store_id}:${date}`);
  await redis.del(`stock:${store_id}:${following_day}`);
};
