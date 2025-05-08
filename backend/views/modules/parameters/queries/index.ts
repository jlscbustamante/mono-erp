import { db } from "#app/config/database.ts";
import { IParametersApp } from "@scope/shared";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const _get_first_value = (obj: Record<string, any>) => {
  // return any value of object
  for (const key in obj) {
    return obj[key];
  }
};

export const get_parameters_app = async (): Promise<
  DeepPartial<IParametersApp>
> => {
  const parameters = await db
    .selectFrom("sys_parameters")
    .selectAll()
    .execute();

  // group parametsr by type
  const grouped_parameters = parameters
    .filter((el) => el.status != 1)
    .reduce((acc, parameter) => {
      const { type, name, value } = parameter;
      if (!acc[type]) {
        acc[type] = {};
      }
      acc[type][name] = value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

  return {
    job_titles: {
      delivery: grouped_parameters["JOBS_ID"]?.["DELIVERY"]
        ? Number(grouped_parameters["JOBS_ID"]["DELIVERY"])
        : undefined,
    },
    detraction_meat: {
      // percentage: grouped_parameters["DETRACCION_PERC"],
      percentage: 0,
      messsage: {
        "Producto sujeto detraccion": "Sujeto a detracción",
        "Cuenta detraccion": "123456789",
      },
    },
    moturider: {
      cia_raul: 1,
    },
  };
};
