export const format_number = (
  num: number,
  props: {
    decimal_places?: number;
    max_digits_integer?: number;
  } = {},
  error: {
    decimal_places?: boolean;
    max_digits_integer?: boolean;
  } = {}
): string => {
  // Default values
  const decimalPlaces =
    props.decimal_places !== undefined ? props.decimal_places : 2;
  const maxDigitsInteger =
    props.max_digits_integer !== undefined
      ? props.max_digits_integer
      : Infinity;

  // Handle special cases
  if (!isFinite(num)) {
    return num.toString();
  }

  // Split number into integer and decimal parts
  let integerPart = Math.floor(Math.abs(num)).toString();
  const isNegative = num < 0;

  // Check if integer part exceeds max_digits_integer
  if (integerPart.length > maxDigitsInteger) {
    if (error.max_digits_integer) {
      throw new Error(
        `Integer part exceeds maximum of ${maxDigitsInteger} digits`
      );
    }
    integerPart = integerPart.substring(0, maxDigitsInteger);
  }

  // Format decimal part
  let result = "";
  if (decimalPlaces > 0) {
    // Calculate decimal part with proper rounding
    const factor = Math.pow(10, decimalPlaces);
    const adjustedNum = Math.round(Math.abs(num) * factor) / factor;

    // Get decimal part as string with fixed length
    const decimalPart = adjustedNum.toFixed(decimalPlaces).split(".")[1] || "";

    // Check if the original number has more decimal places than allowed
    const originalDecimalPart = Math.abs(num).toString().split(".")[1] || "";
    if (error.decimal_places && originalDecimalPart.length > decimalPlaces) {
      throw new Error(`Number has more than ${decimalPlaces} decimal places`);
    }

    result = `${isNegative ? "-" : ""}${integerPart}.${decimalPart}`;
  } else {
    // No decimal places, just round to integer
    const roundedInteger = Math.round(Math.abs(num))
      .toString()
      .substring(0, maxDigitsInteger);

    // Check if the original number has any decimal places when none are allowed
    const originalDecimalPart = Math.abs(num).toString().split(".")[1] || "";
    if (error.decimal_places && originalDecimalPart.length > 0) {
      throw new Error("Number contains decimal places but none are allowed");
    }

    result = `${isNegative ? "-" : ""}${roundedInteger}`;
  }

  return result;
};
