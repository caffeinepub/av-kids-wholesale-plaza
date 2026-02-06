/**
 * Format a bigint price (in cents) to a currency string
 * @param priceInCents - Price in cents as bigint
 * @returns Formatted price string (e.g., "$12.99")
 */
export function formatMoney(priceInCents: bigint): string {
  const dollars = Number(priceInCents) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}
