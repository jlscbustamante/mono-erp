export class DecimalTransformer {
  to(value: number | null): string | null {
    if (value === null) return value

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return value?.toString()
  }

  from(value: string | null): number | null {
    if (value === null) return value

    return parseFloat(value)
  }
}
