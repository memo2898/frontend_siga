// ============================================
// uiX - Text Normalization Utilities
// ============================================

/**
 * Normalize text for comparison:
 * - Converts to lowercase
 * - Removes accents/diacritics (á→a, é→e, ñ→n, etc.)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Check if text contains search term (normalized)
 */
export function normalizedIncludes(text: string, search: string): boolean {
  return normalizeText(text).includes(normalizeText(search));
}

/**
 * Check if text starts with search term (normalized)
 */
export function normalizedStartsWith(text: string, search: string): boolean {
  return normalizeText(text).startsWith(normalizeText(search));
}