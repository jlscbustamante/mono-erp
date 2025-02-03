import type { WhereOption } from "@pizzadb";

interface WhereOptionBasic<T>
  extends Pick<WhereOption<T>, "field" | "mods" | "useMods"> {}

export interface FilterOption<T> {
  operators: string[];
  key: keyof T;
  label: string;
  hide?: boolean;
  type?: "date" | "number";
  render?: (props: FilterComponentProps) => React.ReactNode;
  default?: (operator: string) => any;
  whereOption: WhereOptionBasic<T>;
}

export interface FilterComponentProps {
  fiValue?: unknown;
  onFiChange?: (value: unknown) => void;
  operator: string;
}
