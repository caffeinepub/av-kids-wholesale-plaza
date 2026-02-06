/**
 * Get the product image URL with fallback to placeholder
 * @param imageUrl - The product image URL from backend
 * @returns The image URL or placeholder path
 */
export function getProductImageUrl(imageUrl: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return '/assets/generated/product-placeholder.dim_800x800.png';
  }
  return imageUrl;
}
