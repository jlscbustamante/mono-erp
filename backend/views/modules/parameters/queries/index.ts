import { db } from "#app/config/database.ts";
import { redis } from "#app/config/redis.ts";
import { IParametersApp, SysParametersSelect } from "@scope/shared";
import { minutesToSeconds } from "date-fns";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const get_parameters_app = async (): Promise<
  DeepPartial<IParametersApp>
> => {
  const cache = await redis.get("erp:parameters_app");
  if (cache) {
    return JSON.parse(cache) as DeepPartial<IParametersApp>;
  }

  const parameters: SysParametersSelect[] = await db
    .selectFrom("sys_parameters")
    .selectAll()
    .execute();

  const parameters_active = parameters.filter((el) => el.status == 1);

  const record_type: Record<string, SysParametersSelect> =
    parameters_active.reduce((acc, parameter) => {
      acc[parameter.type] = parameter;
      return acc;
    }, {} as Record<string, SysParametersSelect>);

  // group parametsr by type
  // const grouped_parameters = parameters_active.reduce((acc, parameter) => {
  //   const { type, name, value } = parameter;
  //   if (!acc[type]) {
  //     acc[type] = {};
  //   }
  //   acc[type][name] = value;
  //   return acc;
  // }, {} as Record<string, Record<string, string>>);

  const detraction_meat_message: Record<string, string> = {};
  if (record_type["DETRACCION_BIEN"]) {
    detraction_meat_message[record_type["DETRACCION_BIEN"].name] =
      record_type["DETRACCION_BIEN"].value;
  }
  if (record_type["DETRACCION_CUENTA"]) {
    detraction_meat_message[record_type["DETRACCION_CUENTA"].name] =
      record_type["DETRACCION_CUENTA"].value;
  }
  const result = {
    detraction_meat: {
      percentage: record_type["DETRACCION_PERC"]
        ? Number(record_type["DETRACCION_PERC"])
        : undefined,
      messsages: detraction_meat_message,
    },
    job_titles_ids: {
      delivery: record_type["JOBS_ID"]
        ? Number(record_type["JOBS_ID"].value)
        : undefined,
    },
    moturider: {
      cia: record_type["CIA_RAUL_MOTURIDER"]
        ? Number(record_type["CIA_RAUL_MOTURIDER"].value)
        : undefined,
    },
  };

  await redis.set(
    "erp:parameters_app",
    JSON.stringify(result),
    "EX",
    minutesToSeconds(3)
  );
  return result as DeepPartial<IParametersApp>;
};

type GetValue<T, P1 extends keyof T> = T[P1];
type GetNestedValue<T, P1 extends keyof T, P2 extends keyof T[P1]> = T[P1][P2];

export async function parameters_get<P1 extends keyof IParametersApp>(
  path: [P1]
): Promise<GetValue<IParametersApp, P1> | undefined>;

export async function parameters_get<
  P1 extends keyof IParametersApp,
  P2 extends keyof IParametersApp[P1]
>(path: [P1, P2]): Promise<GetNestedValue<IParametersApp, P1, P2> | undefined>;

export async function parameters_get(path: string[]) {
  const parameters = await get_parameters_app();
  console.log("paramertes : ", parameters);
  const result = path.reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key as keyof typeof acc];
    }
    return undefined;
  }, parameters as any);
  return result;
}

export async function parameters_get_or_throw<P1 extends keyof IParametersApp>(
  path: [P1]
): Promise<GetValue<IParametersApp, P1>>;

export async function parameters_get_or_throw<
  P1 extends keyof IParametersApp,
  P2 extends keyof IParametersApp[P1]
>(path: [P1, P2]): Promise<GetNestedValue<IParametersApp, P1, P2>>;

export async function parameters_get_or_throw(path: string[]) {
  const parameters = await get_parameters_app();
  const result = path.reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key as keyof typeof acc];
    }
    return undefined;
  }, parameters as any);
  if (!result) {
    throw new Error(`Parameter not found: ${path.join(".")}`);
  }
  return result;
}
