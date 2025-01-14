import { FindManyOptions } from "typeorm";

export interface WhereOption<T> {
  field: keyof T;
  operator: string;
  value?: unknown;
  useMod?: boolean;
  mods?: {
    field?: string;
    value?: string;
  };
}

export interface Fillime<T>
  extends Pick<
    FindManyOptions<T>,
    "select" | "relations" | "order" | "take" | "skip"
  > {
  where?: WhereOption<T>[];
}
