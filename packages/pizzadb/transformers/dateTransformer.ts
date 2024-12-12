import { format, parseISO } from "date-fns";

export class DateTransformer {
  to(value: string | null): Date | null {
    // if (value === null) return value
    if (!value) return new Date();

    return parseISO(value);
  }

  from(value: string | null): string | null {
    if (value === null) return value;

    return format(new Date(value), "yyyy-MM-dd HH:mm:ss");
  }
}

export class DateTransformer2 {
  to(value: string | null): Date | null {
    if (!value) return new Date();
    return parseISO(value);
  }

  from(value: string | null): string | null {
    if (value == null) return value;
    return format(new Date(value), "yyyy-MM-dd");
  }
}
