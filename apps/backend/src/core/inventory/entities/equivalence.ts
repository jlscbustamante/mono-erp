export class Equivalence {
  constructor(
    readonly presentationId: number,
    readonly measure_to: number,
    readonly value: number,
    readonly value_factor: number,
  ) {}

  getValue(quantity: number) {
    return (this.value_factor * quantity) / this.value
  }

  reverseGetValue(quantity: number) {
    return (this.value * quantity) / this.value_factor
  }
}
