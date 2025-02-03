type Mods = "DATE" | "CONCAT" | "LOWER";
type ModsValue = "LOWER" | "NOSPACE" | string;
export interface WhereOptionMod<T> {
  key: string;
  field: keyof T | (keyof T | '" "')[];
  operator: string;
  value?: unknown;
  useMods?: boolean;
  mods?: {
    field?: Mods | Mods[];
    value?: ModsValue | ModsValue[];
  };
}

export type WhereOption<T> = WhereOptionMod<T>;

export interface Filter<T> {
  where?: WhereOption<T>[];
  select?: (keyof T)[];
  order?: { field: keyof T; order: "asc" | "desc" }[];
  limit?: number;
  skip?: number;
}
