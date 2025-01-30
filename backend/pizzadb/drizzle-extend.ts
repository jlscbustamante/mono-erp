import { customType } from "drizzle-orm/mysql-core";

export const decimalNumber = customType<{
  data: number;
  config: {
    precision: number;
    scale: number;
  };
}>({
  dataType(config) {
    return `decimal(${config?.precision ?? 16}, ${config?.scale ?? 2})`;
  },
  fromDriver(value) {
    return Number(value);
  },
});
