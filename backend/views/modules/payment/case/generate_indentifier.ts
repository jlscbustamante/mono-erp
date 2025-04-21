/**
 * Generates a more unique identifier string with the format REQ#######.
 * The total length is 10 characters.
 * Incorporates a timestamp component (base36 encoded) and random characters
 * to significantly reduce the probability of collisions.
 *
 * @returns A unique identifier string, aiming for high uniqueness within the format constraints.
 */
export function generate_identifier(): string {
  const prefix = "REQ";
  const requiredLength = 10;
  const suffixLength = requiredLength - prefix.length; // 7

  // 1. Timestamp part (using base36 for compactness)
  // Take milliseconds since epoch, get modulo 1 million for variability, convert to base36
  // This gives up to 4 characters (zzj3 for 999999)
  const timestampEncoded = (Date.now() % 1000000).toString(36).padStart(4, "0");

  // 2. Random part
  const randomLength = suffixLength - timestampEncoded.length; // Should be 7 - 4 = 3
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  // 3. Combine
  // Ensure the final suffix has exactly suffixLength characters
  const suffix = (timestampEncoded + randomPart).slice(-suffixLength); // Take last 7 chars just in case

  return prefix + suffix;
}

// Example usage:
// const id1 = generate_identifier();
// // Wait a millisecond or generate rapidly
// const id2 = generate_identifier();
// console.log(id1); // e.g., REQ02z1ABC
// console.log(id2); // e.g., REQ02z2XYZ
