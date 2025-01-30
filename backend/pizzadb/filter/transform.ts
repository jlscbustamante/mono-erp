import type { WhereOption } from "./index.ts";

const valueMods = (value: string, mod: string) => {
  if (mod.includes("$x")) {
    return mod.replace("$x", value);
  }
  if (mod == "LOWER") {
    return value.toString().toLowerCase();
  }
  if (mod == "NOSPACE") {
    return value.toString().replace(/\s/g, "");
  }
  return value;
};

const fieldToStr = (field: string | string[], alias?: string) => {
  const aliasStr = alias ? `${alias}.` : "";

  if (Array.isArray(field)) {
    return field
      .map((f) => {
        if (f == '" "') return f;
        return `${aliasStr}${f}`;
      })
      .join(", ");
  }
  return aliasStr + field;
};

export const transformWhere = <T>(
  initial: WhereOption<T>[],
  alias?: string
) => {
  const filters: string[] = [];

  for (const filter of initial) {
    let val: string | undefined;
    if ("useMods" in filter) {
      let value = filter.value;
      if (filter.mods?.value) {
        if (typeof filter.mods.value == "string") {
          value = valueMods(value as string, filter.mods.value);
        } else {
          value = filter.mods.value.reduce((acc, el) => {
            const newVal = valueMods(acc, el);
            return newVal;
          }, value as string);
        }
      }

      let field = fieldToStr(filter.field as string, alias);
      if (filter.mods?.field) {
        if (typeof filter.mods.field == "string") {
          field = `${filter.mods.field}(${field})`;
        } else {
          field = filter.mods.field.reduce((acc, el) => {
            return `${el}(${acc})`;
          }, field);
        }
      }

      val = operatorAndValue(field, filter.operator, value);
    } else {
      const field = fieldToStr(filter.field as string, alias);
      if (filter.operator == "contain") {
        const valStr = (filter.value + "").toLowerCase();
        val = operatorAndValue(field, filter.operator, `%${valStr}%`);
      } else if (filter.operator == "between") {
        const [start, end] = filter.value as string[];
        val = `BETWEEN '${start}' AND '${end}'`;
      } else {
        val = operatorAndValue(field, filter.operator, filter.value);
      }
    }

    if (val) filters.push(val);
  }

  return filters;
};

export const operatorAndValue = (
  field: string,
  operator: string,
  val?: unknown
): string => {
  const value = Array.isArray(val) ? val : JSON.stringify(val);
  if (operator == "equal") {
    if (val == "$$isNull$$") return field + " IS NULL";
    return field + " = " + value;
  }
  if (operator == "notEqual") return field + " != " + value;
  if (operator == "isNull") return field + " IS NULL";
  if (operator == "contain") return field + " LIKE " + value;
  if (operator == "in") {
    const list = value as string[];
    if (list.includes("$$isNull$$")) {
      return `(${field} IS NULL OR ${field} IN (${list
        .map((v) => {
          if (v == "$$isNull$$") return null;
          return `'${v}'`;
        })
        .filter((el) => el)
        .join(", ")}))`;
    }
    return `${field} IN (${list.map((v) => `'${v}'`).join(", ")})`;
  }
  if (operator == "between")
    return `${field} BETWEEN '${(value as string[])[0]}' AND '${
      (value as string[])[1]
    }'`;
  return "";
};
