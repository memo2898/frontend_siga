// ============================================
// uiX - Formatting Utilities
// ============================================

import { type FormattingRule } from "../types";

/**
 * Format phone number
 * Default format: (###) ###-####
 */
function formatPhone(value: string, format: string = "(###) ###-####"): string {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;

  for (const char of format) {
    if (digitIndex >= digits.length) break;
    
    if (char === "#") {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Format currency
 * Example: 1500 -> $1,500.00
 */
function formatCurrency(value: string, locale: string = "en-US"): string {
  const number = parseFloat(value.replace(/[^0-9.-]/g, ""));
  
  if (isNaN(number)) return value;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(number);
}

/**
 * Format Dominican cedula
 * Example: 00112345678 -> 001-1234567-8
 */
function formatCedula(value: string): string {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10, 11)}`;
  }
}

/**
 * Format credit card number
 * Example: 1234567890123456 -> 1234 5678 9012 3456
 */
function formatCreditCard(value: string): string {
  const digits = value.replace(/\D/g, "");
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : digits;
}

/**
 * Capitalize first letter of each word
 */
function capitalize(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Apply a single formatting rule
 */
function applyFormattingRule(value: string, rule: FormattingRule): string {
  switch (rule.type) {
    case "uppercase":
      return value.toUpperCase();

    case "lowercase":
      return value.toLowerCase();

    case "capitalize":
      return capitalize(value);

    case "trim":
      return value.trim();

    case "phone":
      return formatPhone(value, rule.format);

    case "currency":
      return formatCurrency(value);

    case "cedula":
      return formatCedula(value);

    case "creditCard":
      return formatCreditCard(value);

    default:
      return value;
  }
}

/**
 * Apply multiple formatting rules in sequence
 */
export function applyFormatting(
  value: string,
  formatting: FormattingRule[]
): string {
  let result = value;

  for (const rule of formatting) {
    result = applyFormattingRule(result, rule);
  }

  return result;
}

/**
 * Get raw value (remove formatting for submission)
 * Useful for phone, currency, cedula, etc.
 */
export function getRawValue(value: string, formatting: FormattingRule[]): string {
  let result = value;

  for (const rule of formatting) {
    switch (rule.type) {
      case "phone":
      case "cedula":
      case "creditCard":
        result = result.replace(/\D/g, "");
        break;

      case "currency":
        result = result.replace(/[^0-9.-]/g, "");
        break;

      // uppercase, lowercase, capitalize, trim don't need raw conversion
    }
  }

  return result;
}