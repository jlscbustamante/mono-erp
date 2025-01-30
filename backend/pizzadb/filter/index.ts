type Mods = "DATE" | "CONCAT" | "LOWER";
type ModsValue = "LOWER" | "NOSPACE" | string;
export interface WhereOptionMod<T> {
  field: keyof T | (keyof T | '" "')[];
  operator: string;
  value?: unknown;
  useMods: true;
  mods?: {
    field?: Mods | Mods[];
    value?: ModsValue | ModsValue[];
  };
}
export interface WhereOptionNormal<T> {
  field: keyof T;
  operator: string;
  value?: unknown;
}

export type WhereOption<T> = WhereOptionNormal<T> | WhereOptionMod<T>;

export interface Filter<T> {
  where?: WhereOption<T>[];
  select?: (keyof T)[];
  order?: { field: keyof T; order: "asc" | "desc" }[];
  limit?: number;
  skip?: number;
}
